"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { Calendar, ChevronLeft, RefreshCw } from "lucide-react"

type PropertyOption = { slug: string; name: string }
type PriceOverride = { id: string; date: string; price: number; notes?: string | null }
type CalendarBlock = {
  id: string
  start_date: string
  end_date: string
  source: string
  summary: string | null
}
type SyncSource = {
  id: string
  source_name: string
  ical_url: string
  last_synced_at: string | null
  last_status: string | null
}

export default function AdminCalendarPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [properties, setProperties] = useState<PropertyOption[]>([])
  const [selectedProperty, setSelectedProperty] = useState("")
  const [prices, setPrices] = useState<PriceOverride[]>([])
  const [blocks, setBlocks] = useState<CalendarBlock[]>([])
  const [syncSources, setSyncSources] = useState<SyncSource[]>([])
  const [exportUrl, setExportUrl] = useState("")

  const [priceDate, setPriceDate] = useState("")
  const [priceValue, setPriceValue] = useState("")
  const [blockStartDate, setBlockStartDate] = useState("")
  const [blockEndDate, setBlockEndDate] = useState("")
  const [syncSource, setSyncSource] = useState("airbnb")
  const [syncUrl, setSyncUrl] = useState("")

  const sourceRecord = useMemo(
    () => syncSources.find((item) => item.source_name === syncSource),
    [syncSources, syncSource]
  )

  async function fetchProperties() {
    const response = await fetch("/api/admin/calendar", { cache: "no-store" })
    const json = await response.json()
    if (!response.ok) throw new Error(json.error || "Errore caricamento proprietà")

    setProperties(json.properties || [])
    if (!selectedProperty && json.properties?.length) {
      setSelectedProperty(json.properties[0].slug)
    }
  }

  async function fetchCalendarData(propertySlug: string) {
    if (!propertySlug) return
    const response = await fetch(`/api/admin/calendar?propertySlug=${encodeURIComponent(propertySlug)}`, { cache: "no-store" })
    const json = await response.json()
    if (!response.ok) throw new Error(json.error || "Errore caricamento calendario")

    setPrices(json.prices || [])
    setBlocks(json.blocks || [])
    setSyncSources(json.syncSources || [])
    setExportUrl(json.exportUrl || "")
  }

  async function loadAll(propertySlug?: string) {
    setLoading(true)
    try {
      await fetchProperties()
      const slug = propertySlug || selectedProperty
      if (slug) await fetchCalendarData(slug)
    } catch (error) {
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !adminLoading && isAdmin) {
      loadAll()
    }
  }, [authLoading, adminLoading, isAdmin])

  useEffect(() => {
    if (selectedProperty && isAdmin) {
      fetchCalendarData(selectedProperty).catch((error) => alert((error as Error).message))
    }
  }, [selectedProperty, isAdmin])

  async function postAction(body: Record<string, unknown>) {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || "Operazione non riuscita")
      await fetchCalendarData(selectedProperty)
      return json
    } finally {
      setSaving(false)
    }
  }

  const addPrice = async () => {
    if (!selectedProperty || !priceDate || !priceValue) return
    const parsed = Number(priceValue)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      alert("Prezzo non valido")
      return
    }
    await postAction({
      action: "set_price",
      propertySlug: selectedProperty,
      date: priceDate,
      price: parsed,
    })
    setPriceDate("")
    setPriceValue("")
  }

  const addBlock = async () => {
    if (!selectedProperty || !blockStartDate || !blockEndDate) return
    if (blockEndDate <= blockStartDate) {
      alert("La data di fine deve essere successiva alla data di inizio")
      return
    }
    await postAction({
      action: "add_block",
      propertySlug: selectedProperty,
      startDate: blockStartDate,
      endDate: blockEndDate,
      source: "manual",
      summary: "Blocco manuale admin",
    })
    setBlockStartDate("")
    setBlockEndDate("")
  }

  const importIcal = async () => {
    if (!selectedProperty || !syncUrl) return
    if (!syncUrl.includes(".ics") && !syncUrl.includes(".ical")) {
      alert("Inserisci un URL iCal valido (.ics o .ical)")
      return
    }
    const result = await postAction({
      action: "import_ical",
      propertySlug: selectedProperty,
      source: syncSource,
      url: syncUrl,
    })
    alert(`Import completato: ${result.imported || 0} eventi`)
  }

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3 text-red-600">Accesso Negato</h1>
          <p className="text-gray-600 mb-6">Solo admin può gestire prezzi e sincronizzazioni calendario.</p>
          <Link href="/">
            <Button>Torna alla Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-600" />
              Calendario, Prezzi e iCal
            </h1>
            <p className="text-sm text-gray-600">Admin: {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" onClick={() => loadAll(selectedProperty)} disabled={loading || saving}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Aggiorna
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Struttura</label>
          <select
            value={selectedProperty}
            onChange={(event) => setSelectedProperty(event.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            {properties.map((property) => (
              <option key={property.slug} value={property.slug}>
                {property.name} ({property.slug})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Prezzi per data</h2>
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <input type="date" value={priceDate} onChange={(e) => setPriceDate(e.target.value)} className="border rounded-md px-3 py-2" />
            <input
              type="number"
              min="1"
              step="0.01"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              placeholder="Prezzo notte"
              className="border rounded-md px-3 py-2"
            />
            <Button onClick={addPrice} disabled={saving || !selectedProperty}>
              Salva prezzo
            </Button>
          </div>
          <div className="space-y-2">
            {prices.length === 0 && <p className="text-sm text-gray-500">Nessun override prezzo.</p>}
            {prices.map((item) => (
              <div key={item.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                <span>
                  {item.date} - <strong>EUR {Number(item.price).toFixed(2)}</strong>
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    postAction({ action: "delete_price", propertySlug: selectedProperty, date: item.date }).catch((error) =>
                      alert((error as Error).message)
                    )
                  }
                  disabled={saving}
                >
                  Elimina
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Blocchi calendario manuali</h2>
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <input
              type="date"
              value={blockStartDate}
              onChange={(e) => setBlockStartDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <input
              type="date"
              value={blockEndDate}
              onChange={(e) => setBlockEndDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <Button onClick={addBlock} disabled={saving || !selectedProperty}>
              Aggiungi blocco
            </Button>
          </div>
          <div className="space-y-2">
            {blocks.length === 0 && <p className="text-sm text-gray-500">Nessun blocco calendario.</p>}
            {blocks.map((block) => (
              <div key={block.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                <span>
                  {block.start_date} {"->"} {block.end_date} ({block.source})
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => postAction({ action: "delete_block", id: block.id }).catch((error) => alert((error as Error).message))}
                  disabled={saving}
                >
                  Elimina
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sincronizzazione iCal (Airbnb / Booking)</h2>
          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <select value={syncSource} onChange={(e) => setSyncSource(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="airbnb">Airbnb</option>
              <option value="booking">Booking</option>
              <option value="ical_import">Altro iCal</option>
            </select>
            <input
              type="url"
              value={syncUrl}
              onChange={(e) => setSyncUrl(e.target.value)}
              placeholder="https://.../calendar.ics"
              className="border rounded-md px-3 py-2 md:col-span-2"
            />
          </div>
          <div className="flex gap-3 mb-4">
            <Button
              variant="outline"
              onClick={() =>
                postAction({
                  action: "save_sync_source",
                  propertySlug: selectedProperty,
                  source: syncSource,
                  url: syncUrl,
                }).catch((error) => alert((error as Error).message))
              }
              disabled={saving || !selectedProperty || !syncUrl}
            >
              Salva link iCal
            </Button>
            <Button onClick={() => importIcal().catch((error) => alert((error as Error).message))} disabled={saving || !selectedProperty || !syncUrl}>
              Importa adesso
            </Button>
          </div>
          {sourceRecord && (
            <p className="text-sm text-gray-600 mb-3">
              Ultima sync {sourceRecord.source_name}: {sourceRecord.last_synced_at ? new Date(sourceRecord.last_synced_at).toLocaleString("it-IT") : "mai"}
              {sourceRecord.last_status ? ` - ${sourceRecord.last_status}` : ""}
            </p>
          )}
          <div className="rounded-md bg-gray-100 p-3">
            <p className="text-sm font-medium mb-1">Link export iCal (.ics) da inserire su Airbnb/Booking:</p>
            <code className="text-xs break-all">{exportUrl || "Seleziona una struttura per vedere il link export."}</code>
          </div>
        </div>
      </div>
    </div>
  )
}

