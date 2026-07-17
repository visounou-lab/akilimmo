import { redirect } from "next/navigation";
import { defaultRouteLocale } from "@/lib/i18n/config";

export default function RootPage() {
  // The public site is served under an explicit locale prefix (/de, /pl, /sv, /cz).
  redirect(`/${defaultRouteLocale}`);
}
