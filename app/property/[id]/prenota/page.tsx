import { Suspense } from "react"
import PropertyBookingPage from "./page-content"

export default function PropertyBookingRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <p className="text-gray-700">Caricamento prenotazione...</p>
        </div>
      }
    >
      <PropertyBookingPage />
    </Suspense>
  )
}
