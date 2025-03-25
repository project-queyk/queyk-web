import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) return redirect("/signin");

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <Header />
        <div className="mx-5 mb-5">{children}</div>
      </main>
    </SidebarProvider>
  );
}
