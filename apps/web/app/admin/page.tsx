import type { Metadata } from "next";

import AdminPanel from "@/components/admin/AdminPanel";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  return (await isAdmin()) ? <AdminPanel /> : <LoginForm />;
}
