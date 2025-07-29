"use client"

import { SignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ClerkSignInProps {
  onClose?: () => void
}

export function ClerkSignIn({ onClose }: ClerkSignInProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Accesso
          </CardTitle>
          <CardDescription className="text-center">
            Accedi al tuo account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
                formFieldInput: "border-gray-300 focus:border-amber-500 focus:ring-amber-500",
                footerActionLink: "text-amber-600 hover:text-amber-700",
              }
            }}
            afterSignInUrl="/dashboard"
            signUpUrl="/sign-up"
          />

          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Chiudi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 