import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isPropertySlug, getPropertyBySlug } from "@/lib/property-utils"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ propertySlug: string }> },
) {
  const { propertySlug } = await context.params

  if (!isPropertySlug(propertySlug)) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  const property = getPropertyBySlug(propertySlug)!
  const supabase = getSupabase()

  const [{ data: prices }, { data: blocks }] = await Promise.all([
    supabase
      .from("price_overrides")
      .select("date, price")
      .eq("property_slug", propertySlug)
      .order("date"),
    supabase
      .from("calendar_blocks")
      .select("start_date, end_date, source")
      .eq("property_slug", propertySlug),
  ])

  return NextResponse.json({
    propertySlug,
    propertyName: property.name,
    basePrice: property.price,
    prices: prices ?? [],
    blocks: blocks ?? [],
  })
}
