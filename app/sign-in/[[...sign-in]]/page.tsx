import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/80 backdrop-blur-sm border border-amber-200 shadow-2xl rounded-2xl",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl",
              formFieldInput: "border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl",
              footerActionLink: "text-amber-600 hover:text-amber-700 font-semibold",
              dividerLine: "bg-amber-200",
              dividerText: "text-gray-600",
              socialButtonsBlockButton: "border-amber-200 hover:bg-amber-50 rounded-xl",
              formFieldLabel: "text-gray-700 font-medium",
              formFieldLabelRow: "mb-2",
              formFieldInputShowPasswordButton: "text-amber-600 hover:text-amber-700",
              formFieldInputShowPasswordIcon: "text-amber-600",
              formResendCodeLink: "text-amber-600 hover:text-amber-700",
              formFieldAction: "text-amber-600 hover:text-amber-700",
              footerAction: "text-gray-600",
              formFieldErrorText: "text-red-600",
              alert: "bg-amber-50 border-amber-200 text-amber-800 rounded-xl",
              alertText: "text-amber-800",
              alertIcon: "text-amber-600",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              showOptionalFields: false,
            },
          }}
        />
      </div>
    </div>
  )
} 