"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, ArrowRight } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { LocaleSwitcher } from "./locale-switcher";
import { BorealMark, Wordmark } from "./logo";

const NAV = [
  { href: "/financements", key: "financing" },
  { href: "/simulateur", key: "simulator" },
  { href: "/comment-ca-fonctionne", key: "howItWorks" },
  { href: "/a-propos", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-background",
      )}
    >
      <div className="container-boreal flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BorealMark />
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Button asChild variant="aurora" size="sm">
            <Link href="/simulateur">
              {t("apply")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label={t("openMenu")}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BorealMark className="size-7" />
                  <Wordmark className="text-base" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-2">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-accent",
                        )}
                      >
                        {t(item.key)}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <SheetClose asChild>
                  <Button asChild variant="aurora">
                    <Link href="/simulateur">
                      {t("apply")}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
