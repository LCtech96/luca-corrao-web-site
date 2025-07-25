"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SignUp } from "@clerk/nextjs"

interface RegistrationModalProps {
  onClose: () => void
}

export function RegistrationModal({ onClose }: RegistrationModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <SignUp />
      </DialogContent>
    </Dialog>
  )
} 