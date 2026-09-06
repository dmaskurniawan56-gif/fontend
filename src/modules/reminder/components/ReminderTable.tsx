"use client";

import React from "react";
import { Reminder, ReminderStatus } from "../types/reminder.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Phone,
  User,
  Play,
  Pause,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ReminderTableProps {
  reminders: Reminder[];
  isLoading: boolean;
  search: string;
  status: ReminderStatus | "ALL";
  page: number;
  totalPages: number;
  total: number;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: ReminderStatus | "ALL") => void;
  onPageChange: (p: number) => void;
  onToggleStatus: (id: string, currentStatus: ReminderStatus) => void;
  onDeleteRequest: (rem: Reminder) => void;
}

export function ReminderTable({
  reminders,
  isLoading,
  search,
  status,
  page,
  totalPages,
  total,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onToggleStatus,
  onDeleteRequest,
}: ReminderTableProps) {
  const getStatusBadge = (s: ReminderStatus) => {
    switch (s) {
      case "ACTIVE":
        return (
          <Badge variant="success" className="gap-1 text-[11px] font-semibold">
            <CheckCircle2 className="size-3" />
            <span>Aktif</span>
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge variant="warning" className="gap-1 text-[11px] font-semibold">
            <Pause className="size-3" />
            <span>Ditunda</span>
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="gap-1 text-[11px] font-semibold">
            <CheckCircle2 className="size-3" />
            <span>Selesai</span>
          </Badge>
        );
      case "CANCELLED":
      default:
        return (
          <Badge variant="destructive" className="gap-1 text-[11px] font-semibold">
            <XCircle className="size-3" />
            <span>Batal</span>
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="p-5">
      {/* Header & Controls */}
      <CardHeader className="p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold">Daftar Jadwal Pengingat</CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {total} kontak
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Seluruh antrean pesan pengingat yang dievaluasi secara otomatis setiap hari.
            </CardDescription>
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={onSearchChange}
              onSearch={onSearchChange}
              onClear={() => onSearchChange("")}
              placeholder="Cari penerima / catatan..."
              className="h-9 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="pt-2">
          <Tabs
            value={status}
            onValueChange={(v) => onStatusChange(v as ReminderStatus | "ALL")}
          >
            <TabsList className="h-8">
              <TabsTrigger value="ALL" className="text-xs">Semua</TabsTrigger>
              <TabsTrigger value="ACTIVE" className="text-xs">Aktif</TabsTrigger>
              <TabsTrigger value="PAUSED" className="text-xs">Ditunda</TabsTrigger>
              <TabsTrigger value="COMPLETED" className="text-xs">Selesai</TabsTrigger>
              <TabsTrigger value="CANCELLED" className="text-xs">Batal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <Separator />

      {/* Table Content */}
      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Penerima</TableHead>
                <TableHead className="text-xs font-semibold">No. WhatsApp</TableHead>
                <TableHead className="text-xs font-semibold">Tanggal Target</TableHead>
                <TableHead className="text-xs font-semibold">Catatan / Layanan</TableHead>
                <TableHead className="text-center text-xs font-semibold">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : reminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-foreground-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="size-8 text-foreground-muted/40" />
                      <p className="text-sm font-medium">Belum ada jadwal pengingat</p>
                      <p className="text-xs text-foreground-muted/70">
                        Gunakan form di atas untuk menjadwalkan pengingat pertama Anda.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reminders.map((rem) => (
                  <TableRow key={rem.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                        <User className="size-3 text-primary/70" />
                        <span>{rem.recipientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground-muted text-xs">
                      <div className="flex items-center gap-1 font-mono">
                        <Phone className="size-3 text-emerald-500/70" />
                        <span>{rem.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1 font-medium text-foreground">
                        <Calendar className="size-3 text-blue-500/70" />
                        <span>{formatDate(rem.targetDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground-muted text-xs">
                      <span className="line-clamp-1">
                        {rem.notes || <span className="opacity-50 italic">-</span>}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(rem.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Pause / Active */}
                        {(rem.status === "ACTIVE" || rem.status === "PAUSED") && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => onToggleStatus(rem.id, rem.status)}
                                  className="text-foreground-muted hover:text-foreground cursor-pointer"
                                />
                              }
                            >
                              {rem.status === "ACTIVE" ? (
                                <Pause className="size-3.5 text-amber-500" />
                              ) : (
                                <Play className="size-3.5 text-emerald-500" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              {rem.status === "ACTIVE" ? "Tunda Jadwal" : "Aktifkan Jadwal"}
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Delete */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => onDeleteRequest(rem)}
                                className="text-foreground-muted hover:text-destructive cursor-pointer"
                              />
                            }
                          >
                            <Trash2 className="size-3.5" />
                          </TooltipTrigger>
                          <TooltipContent>Hapus Jadwal</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between p-0 pt-2 text-xs text-foreground-muted">
          <span>
            Menampilkan halaman <strong className="text-foreground">{page}</strong> dari{" "}
            <strong className="text-foreground">{totalPages}</strong> (Total {total} data)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="cursor-pointer"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
