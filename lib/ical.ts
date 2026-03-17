export type ParsedIcalEvent = {
  uid?: string
  summary?: string
  startDate: string
  endDate: string
}

function unfoldIcalLines(content: string): string[] {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  const unfolded = normalized.replace(/\n[ \t]/g, "")
  return unfolded.split("\n")
}

function parseIcalDate(raw: string): string | null {
  const value = raw.trim()
  const dateMatch = value.match(/^(\d{4})(\d{2})(\d{2})/)
  if (!dateMatch) return null
  return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
}

function addOneDay(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

export function parseIcalEvents(content: string): ParsedIcalEvent[] {
  const lines = unfoldIcalLines(content)
  const events: ParsedIcalEvent[] = []
  let inEvent = false
  let uid: string | undefined
  let summary: string | undefined
  let dtStart: string | null = null
  let dtEnd: string | null = null
  let hasDateTimeEnd = false

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true
      uid = undefined
      summary = undefined
      dtStart = null
      dtEnd = null
      hasDateTimeEnd = false
      continue
    }

    if (line === "END:VEVENT") {
      if (inEvent && dtStart) {
        const startDate = dtStart
        let endDate = dtEnd

        if (!endDate) {
          endDate = addOneDay(startDate)
        } else if (hasDateTimeEnd && endDate <= startDate) {
          endDate = addOneDay(startDate)
        }

        events.push({
          uid,
          summary,
          startDate,
          endDate,
        })
      }
      inEvent = false
      continue
    }

    if (!inEvent) continue

    if (line.startsWith("UID:")) {
      uid = line.slice(4).trim()
      continue
    }
    if (line.startsWith("SUMMARY:")) {
      summary = line.slice(8).trim()
      continue
    }
    if (line.startsWith("DTSTART")) {
      const value = line.split(":").slice(1).join(":")
      dtStart = parseIcalDate(value)
      continue
    }
    if (line.startsWith("DTEND")) {
      const value = line.split(":").slice(1).join(":")
      dtEnd = parseIcalDate(value)
      hasDateTimeEnd = !line.includes("VALUE=DATE")
      continue
    }
  }

  return events.filter((event) => event.startDate && event.endDate && event.startDate < event.endDate)
}

function formatDateForIcs(date: string): string {
  return date.replaceAll("-", "")
}

export function buildIcsFeed(
  calendarName: string,
  events: Array<{ uid: string; summary: string; startDate: string; endDate: string }>
): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Luca Corrao//Availability Calendar//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${calendarName}`,
  ]

  for (const event of events) {
    lines.push("BEGIN:VEVENT")
    lines.push(`UID:${event.uid}`)
    lines.push(`DTSTAMP:${now}`)
    lines.push(`DTSTART;VALUE=DATE:${formatDateForIcs(event.startDate)}`)
    lines.push(`DTEND;VALUE=DATE:${formatDateForIcs(event.endDate)}`)
    lines.push(`SUMMARY:${event.summary}`)
    lines.push("END:VEVENT")
  }

  lines.push("END:VCALENDAR")
  return lines.join("\r\n")
}

