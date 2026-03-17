import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { isAdminEmail } from "@/lib/admin"
import { parseIcalEvents } from "@/lib/ical"
import { absoluteUrl } from "@/lib/seo"
import { properties } from "@/lib/properties-data"

function isValidDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function eachDateInclusive(startDate: string, endDate: string): string[] {
  const start = new Date(`${startDate}T00:00:00.000Z`)
  const end = new Date(`${endDate}T00:00:00.000Z`)
  const out: string[] = []

  for (let cursor = start; cursor <= end; cursor = new Date(cursor.getTime() + 86400000)) {
    out.push(cursor.toISOString().slice(0, 10))
  }
  return out
}

function dayOfWeek(dateString: string): number {
  // 0=Sun ... 6=Sat
  return new Date(`${dateString}T00:00:00.000Z`).getUTCDay()
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const email = session?.user?.email || null
  if (!session?.user || !isAdminEmail(email)) return null

  return { supabase, user: session.user }
}

export async function GET(request: NextRequest) {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const propertySlug = searchParams.get("propertySlug")

  const staticProperties = Object.entries(properties).map(([slug, property]) => ({
    slug,
    name: property.name,
  }))

  const { data: structures } = await admin.supabase
    .from("structures")
    .select("id,name")
    .eq("is_active", true)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  const dynamicProperties = (structures || []).map((structure) => ({
    slug: slugify(structure.name),
    name: structure.name,
  }))

  const propertiesList = [...staticProperties, ...dynamicProperties].filter(
    (item, index, self) => self.findIndex((candidate) => candidate.slug === item.slug) === index
  )

  if (!propertySlug) {
    return NextResponse.json({
      success: true,
      properties: propertiesList,
    })
  }

  const [{ data: prices, error: pricesError }, { data: blocks, error: blocksError }, { data: syncSources, error: syncError }] =
    await Promise.all([
      admin.supabase
        .from("price_overrides")
        .select("*")
        .eq("property_slug", propertySlug)
        .order("date", { ascending: true }),
      admin.supabase
        .from("calendar_blocks")
        .select("*")
        .eq("property_slug", propertySlug)
        .order("start_date", { ascending: true }),
      admin.supabase
        .from("calendar_sync_sources")
        .select("*")
        .eq("property_slug", propertySlug)
        .order("source_name", { ascending: true }),
    ])

  if (pricesError || blocksError || syncError) {
    return NextResponse.json(
      {
        error:
          "Tabelle calendario non trovate. Esegui la migration SQL per calendario/prezzi prima di usare questa sezione.",
        details: pricesError?.message || blocksError?.message || syncError?.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    properties: propertiesList,
    prices: prices || [],
    blocks: blocks || [],
    syncSources: syncSources || [],
    exportUrl: absoluteUrl(`/api/ical/${propertySlug}`),
  })
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const action = body.action as string

  if (action === "set_price") {
    const { propertySlug, date, price } = body
    if (!propertySlug || !date || price === undefined) {
      return NextResponse.json({ error: "propertySlug, date, price required" }, { status: 400 })
    }

    const { error } = await admin.supabase.from("price_overrides").upsert(
      {
        property_slug: propertySlug,
        date,
        price,
        created_by: admin.user.id,
      },
      { onConflict: "property_slug,date" }
    )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "set_price_range") {
    const { propertySlug, startDate, endDate, price, mode } = body as {
      propertySlug?: string
      startDate?: string
      endDate?: string
      price?: number
      mode?: "all" | "weekdays" | "weekend"
    }

    if (!propertySlug || !isValidDateString(startDate) || !isValidDateString(endDate) || price === undefined) {
      return NextResponse.json({ error: "propertySlug, startDate, endDate, price required" }, { status: 400 })
    }
    if (endDate < startDate) {
      return NextResponse.json({ error: "endDate must be >= startDate" }, { status: 400 })
    }
    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ error: "price must be > 0" }, { status: 400 })
    }

    const dates = eachDateInclusive(startDate, endDate).filter((date) => {
      const dow = dayOfWeek(date)
      if (mode === "weekdays") return dow >= 1 && dow <= 5
      if (mode === "weekend") return dow === 0 || dow === 6
      return true
    })

    if (!dates.length) return NextResponse.json({ success: true, affected: 0 })

    const rows = dates.map((date) => ({
      property_slug: propertySlug,
      date,
      price,
      created_by: admin.user.id,
    }))

    const { error } = await admin.supabase.from("price_overrides").upsert(rows, { onConflict: "property_slug,date" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, affected: rows.length })
  }

  if (action === "delete_price") {
    const { propertySlug, date } = body
    const { error } = await admin.supabase.from("price_overrides").delete().eq("property_slug", propertySlug).eq("date", date)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "add_block") {
    const { propertySlug, startDate, endDate, source, summary } = body
    if (!propertySlug || !startDate || !endDate) {
      return NextResponse.json({ error: "propertySlug, startDate, endDate required" }, { status: 400 })
    }
    const { error } = await admin.supabase.from("calendar_blocks").insert({
      property_slug: propertySlug,
      start_date: startDate,
      end_date: endDate,
      source: source || "manual",
      summary: summary || "Blocco manuale",
      created_by: admin.user.id,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "delete_block") {
    const { id } = body
    const { error } = await admin.supabase.from("calendar_blocks").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "save_sync_source") {
    const { propertySlug, source, url } = body
    if (!propertySlug || !source || !url) {
      return NextResponse.json({ error: "propertySlug, source, url required" }, { status: 400 })
    }

    const { error } = await admin.supabase.from("calendar_sync_sources").upsert(
      {
        property_slug: propertySlug,
        source_name: source,
        ical_url: url,
        created_by: admin.user.id,
      },
      { onConflict: "property_slug,source_name" }
    )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "import_ical") {
    const { propertySlug, source, url } = body
    if (!propertySlug || !source || !url) {
      return NextResponse.json({ error: "propertySlug, source, url required" }, { status: 400 })
    }

    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) {
      return NextResponse.json({ error: `Impossibile leggere il feed iCal (${response.status})` }, { status: 400 })
    }

    const content = await response.text()
    const events = parseIcalEvents(content)
    if (!events.length) {
      return NextResponse.json({ success: true, imported: 0, message: "Nessun evento trovato nel feed iCal." })
    }

    await admin.supabase
      .from("calendar_blocks")
      .delete()
      .eq("property_slug", propertySlug)
      .eq("source", source)

    const insertRows = events.map((event) => ({
      property_slug: propertySlug,
      start_date: event.startDate,
      end_date: event.endDate,
      source,
      external_uid: event.uid || null,
      summary: event.summary || `${source} imported`,
      created_by: admin.user.id,
    }))

    const { error } = await admin.supabase.from("calendar_blocks").insert(insertRows)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await admin.supabase.from("calendar_sync_sources").upsert(
      {
        property_slug: propertySlug,
        source_name: source,
        ical_url: url,
        last_synced_at: new Date().toISOString(),
        last_status: `ok (${insertRows.length} eventi)`,
        created_by: admin.user.id,
      },
      { onConflict: "property_slug,source_name" }
    )

    return NextResponse.json({ success: true, imported: insertRows.length })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

