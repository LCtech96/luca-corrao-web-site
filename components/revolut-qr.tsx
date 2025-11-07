"use client"

import Image from "next/image"

interface RevolutQRProps {
  size?: number
  showLabel?: boolean
}

export function RevolutQR({ size = 200, showLabel = true }: RevolutQRProps) {
  const revolutLink = "https://revolut.me/lctech96"
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(revolutLink)}`

  return (
    <div className="inline-block text-center">
      <div className="p-4 bg-white border-2 border-gray-200 rounded-lg inline-block">
        <Image
          src={qrCodeUrl}
          alt="Revolut QR Code - Luca Corrao"
          width={size}
          height={size}
          className="mx-auto"
        />
      </div>
      {showLabel && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">Scansiona per pagare</p>
          <p className="text-xs text-gray-400 mt-1">
            <a href={revolutLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {revolutLink}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

