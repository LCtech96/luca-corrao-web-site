"use client"

import Image from "next/image"

export function ProfileBanner() {
  return (
    <div className="profile-banner w-full h-48 md:h-64 mb-8">
      {/* Banner Image */}
      <Image
        src="/images/terrasini-sunset.jpg"
        alt="Banner Profilo - Terrasini Sunset"
        fill
        className="profile-banner-image object-cover opacity-70"
        priority
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 banner-overlay"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-16 h-16 banner-decoration rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 banner-decoration rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 banner-decoration rounded-full transform -translate-y-1/2"></div>
      
      {/* Profile Image Container - Positioned to overlap */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-xl opacity-20 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
          <Image
            src="/images/luca-corrao-profile.jpg"
            alt="Luca Corrao - Innovazione AI & Eccellenza nell'Ospitalità Siciliana"
            width={320}
            height={320}
            className="relative rounded-full shadow-2xl object-cover border-8 border-white/90 backdrop-blur-sm hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </div>
    </div>
  )
} 