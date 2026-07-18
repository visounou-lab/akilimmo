import { redirect } from "next/navigation";

// User management now lives under Zugang & Sicherheit.
export default function UsersRedirect() {
  redirect("/admin/zugang");
}
