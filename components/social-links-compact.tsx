"use client"

import { Linkedin, Instagram, Facebook, Twitter } from "lucide-react"

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
      icon: Twitter,
      url: "https://twitter.com/lucacorrao",
      color: "hover:text-gray-900"
    },
    {
      name: "bedda.AI",
      icon: null, // Logo custom
      url: "https://bedda.tech",
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
            <span className="text-xs font-bold tracking-wider">bedda.AI</span>
          ) : (
            link.icon && <link.icon className="w-4 h-4" />
          )}
        </a>
      ))}
    </div>
  )
}

