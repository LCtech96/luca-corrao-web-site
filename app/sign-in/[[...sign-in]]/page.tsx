import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4">
      <div className="w-full max-w-md">
        <SignIn 
          afterSignInUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
} 