"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SignIn } from "@clerk/nextjs"

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <SignIn />
      </DialogContent>
    </Dialog>
  )
} 