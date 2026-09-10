"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const { t } = useI18n();
  const segments = pathname.split("/").filter(Boolean);

  const getSegmentTitle = (segment: string): string => {
    switch (segment.toLowerCase()) {
      case "dashboard":
        return t("common.breadcrumbDashboard");
      case "devices":
        return t("dashboardMenu.whatsappSlots");
      case "campaigns":
        return t("dashboardMenu.campaigns");
      case "contacts":
        return t("dashboardMenu.contacts");
      case "templates":
        return t("dashboardMenu.templates");
      case "reminders":
        return t("dashboardMenu.reminders");
      case "reservations":
        return t("dashboardMenu.reservations");
      case "forms":
        return t("dashboardMenu.forms");
      case "subscription":
        return t("dashboardMenu.subscription");
      case "billing":
        return t("dashboardMenu.billing");
      case "activities":
        return t("dashboardMenu.activities");
      case "settings":
        return t("dashboardMenu.settings");
      case "support":
        return t("dashboardMenu.support");
      case "team":
        return t("dashboardMenu.team");
      case "address":
        return t("address.title");
      case "api-key":
        return t("dashboardMenu.apiKey");
      case "users":
        return t("admin.usersTitle");
      case "plans":
        return t("admin.plansTitle");
      case "subscriptions":
        return t("admin.subscriptionsTitle");
      case "messages":
        return t("dashboardMenu.messages");
      case "notifications":
        return t("admin.notificationsTitle");
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  const activeTitle =
    segments.length > 0
      ? getSegmentTitle(segments[segments.length - 1])
      : t("common.breadcrumbDashboard");

  return (
    <div className="flex min-w-0 items-center">
      {/* Mobile Single Page Title (< sm) */}
      <div className="flex min-w-0 items-center sm:hidden">
        <h1 className="text-foreground max-w-[130px] truncate text-sm font-bold tracking-tight xs:max-w-[180px]">
          {activeTitle}
        </h1>
      </div>

      {/* Desktop / Tablet Breadcrumb Trail (≥ sm) */}
      <nav
        className="text-foreground-muted hidden min-w-0 items-center gap-1.5 text-xs font-semibold sm:flex"
        aria-label="Breadcrumb"
      >
        <Link
          href="/dashboard"
          className="hover:text-foreground flex shrink-0 items-center gap-1"
        >
          <Home className="size-3.5" />
          <span>{t("common.breadcrumbHome")}</span>
        </Link>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const title = getSegmentTitle(segment);

          return (
            <React.Fragment key={href}>
              <ChevronRight className="text-border size-3 shrink-0" />
              {isLast ? (
                <span className="text-foreground max-w-[160px] truncate font-bold md:max-w-[240px] lg:max-w-none">
                  {title}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-foreground max-w-[100px] truncate md:max-w-[140px]"
                >
                  {title}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}
