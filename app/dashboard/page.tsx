// app/dashboard/page.tsx
import { UserButton, auth } from "@clerk/nextjs";

export default async function DashboardPage() {
  // Get the userId from auth() -- no need to check if it's there
  const { userId } = auth();

  if (!userId) {
    // This condition is technically not needed due to the middleware,
    // but it's good practice for type-safety and clarity.
    return null;
  }
  
  // You can now use the userId to fetch data from your database
  
  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main>
        <p>Welcome to your protected dashboard!</p>
        <p>Your User ID is: {userId}</p>
      </main>
    </div>
  );
}