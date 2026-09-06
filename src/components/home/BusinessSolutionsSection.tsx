"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface SolutionItem {
  id: "reservation" | "reminder" | "form" | "template";
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  features: string[];
  tags: string[];
}

export function BusinessSolutionsSection() {
  const { t } = useI18n();

  const solutions: SolutionItem[] = [
    {
      id: "reservation",
      icon: Calendar,
      titleKey: "common.landing.solutions.reservationTitle",
      descKey: "common.landing.solutions.reservationDesc",
      features: [
        t("common.landing.solutions.reservationF1"),
        t("common.landing.solutions.reservationF2"),
        t("common.landing.solutions.reservationF3"),
      ],
      tags: [
        t("common.landing.solutions.reservationTag1"),
        t("common.landing.solutions.reservationTag2"),
        t("common.landing.solutions.reservationTag3"),
      ],
    },
    {
      id: "reminder",
      icon: Clock,
      titleKey: "common.landing.solutions.reminderTitle",
      descKey: "common.landing.solutions.reminderDesc",
      features: [
        t("common.landing.solutions.reminderF1"),
        t("common.landing.solutions.reminderF2"),
        t("common.landing.solutions.reminderF3"),
      ],
      tags: [
        t("common.landing.solutions.reminderTag1"),
        t("common.landing.solutions.reminderTag2"),
        t("common.landing.solutions.reminderTag3"),
      ],
    },
    {
      id: "form",
      icon: FileText,
      titleKey: "common.landing.solutions.formTitle",
      descKey: "common.landing.solutions.formDesc",
      features: [
        t("common.landing.solutions.formF1"),
        t("common.landing.solutions.formF2"),
        t("common.landing.solutions.formF3"),
      ],
      tags: [
        t("common.landing.solutions.formTag1"),
        t("common.landing.solutions.formTag2"),
        t("common.landing.solutions.formTag3"),
      ],
    },
    {
      id: "template",
      icon: MessageSquare,
      titleKey: "common.landing.solutions.templateTitle",
      descKey: "common.landing.solutions.templateDesc",
      features: [
        t("common.landing.solutions.templateF1"),
        t("common.landing.solutions.templateF2"),
        t("common.landing.solutions.templateF3"),
      ],
      tags: [
        t("common.landing.solutions.templateTag1"),
        t("common.landing.solutions.templateTag2"),
        t("common.landing.solutions.templateTag3"),
      ],
    },
  ];

  return (
    <section id="solutions" className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6">
      {/* Header Section */}
      <div className="mx-auto max-w-2xl space-y-2.5 text-center">
        <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
          <Layers className="size-3.5" />
          <span>{t("common.landing.solutions.badge")}</span>
        </div>
        <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
          {t("common.landing.solutions.title")}
        </h2>
        <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
          {t("common.landing.solutions.subtitle")}
        </p>
      </div>

      {/* 4 Cards Bento Grid */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        {solutions.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.id}
              className="border-border/80 bg-surface/90 hover:border-wise-green/60 dark:hover:border-wise-green/40 group relative flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <div className="space-y-4">
                <CardHeader className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-wise-green/15 dark:bg-wise-green/20 text-dark-green dark:text-wise-green group-hover:bg-wise-green/25 flex size-11 items-center justify-center rounded-xl transition-colors">
                      <IconComponent className="size-5" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {item.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="neutral"
                          className="text-[11px] font-medium px-2 py-0.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <CardTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
                      <h3 className="text-inherit font-inherit inline">{t(item.titleKey)}</h3>
                    </CardTitle>
                    <CardDescription className="text-foreground-secondary mt-1.5 text-xs font-medium leading-relaxed sm:text-sm">
                      {t(item.descKey)}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-1">
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-foreground-secondary flex items-start gap-2.5 text-xs font-medium sm:text-sm"
                      >
                        <CheckCircle2 className="text-dark-green dark:text-wise-green mt-0.5 size-4 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <div className="mt-5 space-y-4">
                <Separator className="bg-border/60" />
                <CardFooter className="p-0 flex items-center justify-between">
                  <span className="text-foreground-muted text-xs font-semibold">
                    {t("common.landing.solutions.badge")}
                  </span>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "text-dark-green hover:text-dark-green dark:text-wise-green dark:hover:text-wise-green group-hover:translate-x-0.5 gap-1.5 px-2.5 text-xs font-bold transition-transform"
                    )}
                  >
                    <span>{t("common.landing.solutions.ctaTry")}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
