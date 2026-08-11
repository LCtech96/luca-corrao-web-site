"use client"

import { Linkedin, Instagram, Facebook } from "lucide-react"
import { XIcon } from "./x-icon"

export function SocialLinksCompact() {
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/luca-corrao?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
      color: "hover:text-blue-500"
    },
    {
      name: "Instagram", 
      icon: Instagram,
      url: "https://www.instagram.com/lucacorrao_com/",
      color: "hover:text-pink-500"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/share/1JMaVG8bsh/?mibextid=wwXIfr",
      color: "hover:text-blue-600"
    },
    {
      name: "X",
      icon: XIcon,
      url: "https://x.com/luca_corrao?s=11",
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

