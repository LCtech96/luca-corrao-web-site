import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware((auth, req) => {
  // Route pubbliche
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhook/clerk",
    "/api/chat",
    "/api/structures",
    "/api/reviews",
    "/api/spreadsheet",
    "/api/cron/sync-airbnb",
    "/api/test-email",
  ]
  
  const isPublic = publicRoutes.some(route => req.url.includes(route))
  
  if (isPublic) return
  
  return auth().protect()
})

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
} 