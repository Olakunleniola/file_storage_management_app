import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import UserProvider from "@/components/UserProvider";

export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <main className="h-screen flex">
      <Sidebar {...user} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...user} />
        <Header {...user} />
        <UserProvider user={user}>
          <div className="main-content">{children}</div>
        </UserProvider>
      </section>
      <Toaster />
    </main>
  );
};

export default layout;
