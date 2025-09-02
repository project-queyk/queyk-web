import { auth } from "@/auth";
import UserManagementPage from "@/components/UserManagementPage";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User Management",
  description:
    "Manage user accounts, assign roles, and control access permissions",
};

export default async function Page() {
  const session = await auth();

  if (!session) return redirect("/signin");

  if (session.user.role !== "admin") return redirect("/dashboard");

  return <UserManagementPage session={session} />;
}
