"use client";

import React, { useState, useMemo } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import { env } from "@/lib/config/env";

type Lang = "curl" | "node" | "go" | "python" | "php";

interface CodeSnippet {
  id: Lang;
  label: string;
  code: string;
}

function getSnippets(apiBaseUrl: string): CodeSnippet[] {
  const cleanBase = apiBaseUrl.replace(/\/+$/, "");
  const endpoint = cleanBase.endsWith("/whatsapp/messages")
    ? cleanBase
    : cleanBase.endsWith("/api/v1") || cleanBase.endsWith("/v1")
      ? `${cleanBase}/whatsapp/messages`
      : `${cleanBase}/api/v1/whatsapp/messages`;

  return [
    {
      id: "curl",
      label: "cURL",
      code: `curl -X POST ${endpoint} \\
  -H "Authorization: Bearer hide_live_9a8b7c6d5e4f3a2b1c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "01M237H3Z63XCG3D15WJAW8QAM",
    "recipient": "6281234567890",
    "message": "Kode OTP verifikasi Anda adalah 884210. Berlaku 5 menit.",
    "is_priority": true
  }'`,
    },
    {
      id: "node",
      label: "Node.js (Fetch)",
      code: `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer hide_live_9a8b7c6d5e4f3a2b1c",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    device_id: "01M237H3Z63XCG3D15WJAW8QAM",
    recipient: "6281234567890",
    message: "Kode OTP verifikasi Anda adalah 884210. Berlaku 5 menit.",
    is_priority: true, // VIP Express Lane (< 400ms)
  }),
});

const data = await response.json();
console.log("Status pengiriman:", data.message_id);`,
    },
    {
      id: "go",
      label: "Go",
      code: `package main

import (
	"bytes"
	"context"
	"net/http"
	"time"
)

func main() {
	payload := []byte(\`{
		"device_id": "01M237H3Z63XCG3D15WJAW8QAM",
		"recipient": "6281234567890",
		"message": "Kode OTP verifikasi Anda adalah 884210.",
		"is_priority": true
	}\`)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	req, _ := http.NewRequestWithContext(ctx, "POST", "${endpoint}", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer hide_live_9a8b7c6d5e4f3a2b1c")
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	// Handle response (< 400ms)
}`,
    },
    {
      id: "python",
      label: "Python",
      code: `import requests

url = "${endpoint}"
headers = {
    "Authorization": "Bearer hide_live_9a8b7c6d5e4f3a2b1c",
    "Content-Type": "application/json"
}
payload = {
    "device_id": "01M237H3Z63XCG3D15WJAW8QAM",
    "recipient": "6281234567890",
    "message": "Kode OTP verifikasi Anda adalah 884210.",
    "is_priority": True
}

response = requests.post(url, json=payload, headers=headers, timeout=5)
print(response.json())`,
    },
    {
      id: "php",
      label: "PHP",
      code: `<?php

$payload = json_encode([
    'device_id'   => '01M237H3Z63XCG3D15WJAW8QAM',
    'recipient'   => '6281234567890',
    'message'     => 'Kode OTP verifikasi Anda adalah 884210.',
    'is_priority' => true,
]);

$ch = curl_init('${endpoint}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer hide_live_9a8b7c6d5e4f3a2b1c',
    'Content-Type: application/json',
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
    },
  ];
}

export function LiveEndpointSandbox() {
  const { t } = useI18n();
  const [activeLang, setActiveLang] = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.wahide.id/api/v1";

  const snippets = useMemo(() => getSnippets(apiBaseUrl), [apiBaseUrl]);

  const currentSnippet =
    snippets.find((s) => s.id === activeLang) || snippets[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet.code);
      setCopied(true);
      toast.success("Contoh kode berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin kode");
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-4 sm:py-6">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {t("landingPages.apiGateway.sandboxTitle")}
        </h2>
        <p className="text-foreground-secondary text-sm font-semibold leading-relaxed">
          {t("landingPages.apiGateway.sandboxSubtitle")}
        </p>
      </div>

      <div className="border border-border/80 bg-zinc-950 text-zinc-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Sandbox Header with Language Tabs & Copy Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <Terminal className="size-4 text-zinc-400 hidden sm:inline" />
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {snippets.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => setActiveLang(snippet.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeLang === snippet.id
                      ? "bg-wise-green text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  }`}
                >
                  {snippet.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>

        {/* Code View Area */}
        <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-zinc-300">
          <pre className="whitespace-pre">
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        {/* Latency & Response Footer Preview */}
        <div className="border-t border-zinc-800/80 bg-zinc-900/60 px-4 py-2.5 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Response: 200 OK</span>
          </span>
          <span className="text-zinc-500">Latency: ~210ms • VIP Queue</span>
        </div>
      </div>
    </section>
  );
}
