"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PriceOverride = { id?: string; date: string; price: number }

type AdminPriceCalendarProps = {
  basePrice: number
  prices: PriceOverride[]
  onSavePrice: (date: string, price: number) => Promise<void>
  saving?: boolean
}

const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
]

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]

export function AdminPriceCalendar({ basePrice, prices, onSavePrice, saving }: AdminPriceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState("")

  const priceMap = useMemo(() => {
    const map = new Map<string, number>()
    prices.forEach((item) => map.set(item.date, Number(item.price)))
    return map
  }, [prices])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const openEditor = (date: string) => {
    setSelectedDate(date)
    setEditPrice(String(priceMap.get(date) ?? basePrice))
  }

  const saveSelected = async () => {
    if (!selectedDate) return
    const parsed = Number(editPrice)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    await onSavePrice(selectedDate, parsed)
    setSelectedDate(null)
  }

  const cells = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`empty-${i}`} className="h-20" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const price = priceMap.get(date) ?? basePrice
    const isCustom = priceMap.has(date)
    const isSelected = selectedDate === date

    cells.push(
      <button
        key={date}
        type="button"
        onClick={() => openEditor(date)}
        className={`h-20 rounded-lg border p-2 text-left transition-colors ${
          isSelected
            ? "border-amber-500 bg-amber-50 ring-2 ring-amber-300"
            : isCustom
              ? "border-amber-300 bg-amber-50/70 hover:bg-amber-50"
              : "border-gray-200 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
        }`}
      >
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{day}</div>
        <div className={`text-xs font-medium mt-1 ${isCustom ? "text-amber-700" : "text-gray-600 dark:text-gray-300"}`}>
          €{price}
        </div>
      </button>,
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {MONTH_NAMES[month]} {year}
        </h3>
        <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Clicca su una data per impostare il prezzo della notte. Prezzo base: <strong>€{basePrice}</strong>
      </p>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{cells}</div>

      {selectedDate && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:bg-gray-900 dark:border-amber-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Prezzo per {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300">€</span>
              <input
                type="number"
                min="1"
                step="1"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-28 border rounded-md px-3 py-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveSelected()
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">/ notte</span>
            </div>
            <Button onClick={saveSelected} disabled={saving}>
              {saving ? "Salvataggio..." : "Salva prezzo"}
            </Button>
            <Button variant="outline" onClick={() => setSelectedDate(null)}>
              Annulla
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
