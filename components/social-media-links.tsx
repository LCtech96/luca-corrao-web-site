"use client"

import { Button } from "@/components/ui/button"
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Linkedin, 
  Instagram, 
  Facebook,
  Twitter
} from "lucide-react"

export function SocialMediaLinks() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 mt-12">
      {/* WhatsApp */}
      <Button
        variant="ghost"
        size="sm"
        className="social-btn text-gray-600 hover:text-green-600 hover:bg-green-50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        onClick={() => window.open("https://wa.me/+393514206353", "_blank")}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">WhatsApp</span>
      </Button>

      {/* Telefono */}
      <Button
        variant="ghost"
        size="sm"
        className="social-btn text-gray-600 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        onClick={() => window.open("tel:+393513671340", "_blank")}
      >
        <Phone className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Telefono</span>
      </Button>

      {/* Email */}
      <Button
        variant="ghost"
        size="sm"
        className="social-btn text-gray-600 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        onClick={() => window.open("mailto:info@lucacorrao.com", "_blank")}
      >
        <Mail className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Email</span>
      </Button>

      {/* LinkedIn */}
      <Button
        variant="ghost"
        size="sm"
        className="social-btn text-gray-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        onClick={() => window.open("https://linkedin.com/in/lucacorrao", "_blank")}
      >
        <Linkedin className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">LinkedIn</span>
      </Button>

      {/* Instagram */}
      <Button
        variant="ghost"
        size="sm"
        className="social-btn text-gray-600 hover:text-pink-600 hover:bg-pink-50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        onClick={() => window.open("https://instagram.com/lucacorrao", "_blank")}
      >
        <Instagram className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Instagram</span>
      </Button>

      {/* Facebook */}
      <Button
        variant="ghost"
        size="sm"
        className="social-btn text-gray-600 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        onClick={() => window.open("https://facebook.com/lucacorrao", "_blank")}
      >
        <Facebook className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Facebook</span>
      </Button>

      {/* Twitter/X */}
      <Button
        variant="ghost"
        size="sm"
        className="social-btn text-gray-600 hover:text-black hover:bg-gray-50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        onClick={() => window.open("https://twitter.com/lucacorrao", "_blank")}
      >
        <Twitter className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Twitter</span>
      </Button>
    </div>
  )
} 