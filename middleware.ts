// Middleware temporaneamente disabilitato per evitare problemi di importazione
// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   // Route pubbliche che non richiedono autenticazione
//   publicRoutes: [
//     "/",
//     "/sign-in",
//     "/sign-up",
//     "/api/auth",
//     "/api/auth/google",
//     "/api/auth/google/callback",
//     "/api/chat",
//     "/api/reviews",
//     "/api/spreadsheet",
//     "/api/structures"
//   ],
  
//   // Route ignorate dal middleware
//   ignoredRoutes: [
//     "/api/public"
//   ]
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// Middleware temporaneo che non fa nulla
export function middleware() {
  // Middleware vuoto per ora
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 