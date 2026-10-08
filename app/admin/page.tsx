import { AdminLogin, AdminPanel } from "@/components/admin-panel";
import { isAdmin } from "@/lib/admin";
import { getSite } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  return <AdminPanel initial={await getSite()} />;
}
