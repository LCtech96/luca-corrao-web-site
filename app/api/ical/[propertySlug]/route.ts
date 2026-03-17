import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { buildIcsFeed } from "@/lib/ical"

type Params = {
  params: Promise<{ propertySlug: string }>
}

export async function GET(_request: NextRequest, context: Params) {
  const { propertySlug } = await context.params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const [{ data: blocks }, { data: bookings }] = await Promise.all([
    supabase.from("calendar_blocks").select("*").eq("property_slug", propertySlug),
    supabase
      .from("bookings")
      .select("id,property_slug,check_in,check_out,status,guest_name")
      .eq("property_slug", propertySlug)
      .neq("status", "cancelled"),
  ])

  const blockEvents = (blocks || []).map((block) => ({
    uid: `block-${block.id}@lucacorrao`,
    summary: block.summary || `Blocked (${block.source})`,
    startDate: block.start_date,
    endDate: block.end_date,
  }))

  const bookingEvents = (bookings || []).map((booking) => ({
    uid: `booking-${booking.id}@lucacorrao`,
    summary: `Booked (${booking.guest_name || "guest"})`,
    startDate: booking.check_in,
    endDate: booking.check_out,
  }))

  const ics = buildIcsFeed(`Availability ${propertySlug}`, [...blockEvents, ...bookingEvents])
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${propertySlug}.ics"`,
      "Cache-Control": "no-store",
    },
  })
}

