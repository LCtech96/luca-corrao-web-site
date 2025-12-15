"use client"

import { Linkedin, Instagram, Facebook } from "lucide-react"
import { XIcon } from "./x-icon"

export function SocialLinksCompact() {
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/luca-corrao",
      color: "hover:text-blue-500"
    },
    {
      name: "Instagram", 
      icon: Instagram,
      url: "https://www.instagram.com/luca.corrao.s?igsh=MXhuN3hiamh4bTNpaQ%3D%3D&utm_source=qr",
      color: "hover:text-pink-500"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/people/Luca-Corrao/pfbid021tDysnufGorRVgbBAkKyZkr94y3pRt2km9GuYixDE4b3SWS5P4faqUbbf5LQptsQl/",
      color: "hover:text-blue-600"
    },
    {
      name: "X",
      icon: XIcon,
      url: "https://twitter.com/lucacorrao",
      color: "hover:text-white"
    },
    {
      name: "Nomadiqe.com",
      icon: null, // Logo custom
      url: "https://nomadiqe.com",
      color: "hover:text-cyan-400",
      isText: true
    }
  ]

  return (
    <div className="flex items-center justify-center gap-4 mt-3">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-400 ${link.color} transition-colors duration-200`}
          title={link.name}
        >
          {link.isText ? (
            <span className="text-xs font-bold tracking-wider">Nomadiqe.com</span>
          ) : (
            link.icon && <link.icon className="w-4 h-4" />
          )}
        </a>
      ))}
    </div>
  )
}

