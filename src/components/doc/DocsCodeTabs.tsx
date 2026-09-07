"use client";

import React, { useState } from "react";
import { CodeSnippetDoc } from "./types";
import { getApiHost } from "./data";
import { Copy, Check, Terminal } from "lucide-react";

interface DocsCodeTabsProps {
  snippets: CodeSnippetDoc;
  title?: string;
}

type SupportedLanguage = "curl" | "nodejs" | "php" | "python" | "go";

const LANGUAGES: { id: SupportedLanguage; label: string; file: string }[] = [
  { id: "curl", label: "cURL", file: "request.sh" },
  { id: "nodejs", label: "Node.js", file: "send.js" },
  { id: "php", label: "PHP", file: "send.php" },
  { id: "python", label: "Python", file: "send.py" },
  { id: "go", label: "Go", file: "main.go" },
];

export function DocsCodeTabs({
  snippets,
  title = "Code Examples",
}: DocsCodeTabsProps) {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("curl");
  const [copied, setCopied] = useState(false);
  const apiHost = getApiHost();

  const rawSnippet = snippets[activeLang] || snippets.curl || "";
  const activeSnippet = rawSnippet.replaceAll("https://api.wahide.com", apiHost);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            {title}
          </h3>
        </div>
      )}

      <div className="rounded-xl border border-border bg-[#0d1117] text-[#e6edf3] shadow-md overflow-hidden dark:border-border/80">
        {/* Tab Switcher Bar */}
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 py-1">
            {LANGUAGES.map((lang) => {
              const isActive = activeLang === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setActiveLang(lang.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? "bg-wise-green text-black shadow-xs font-bold"
                      : "text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors shrink-0 ml-2"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* File Indicator */}
        <div className="flex items-center gap-2 px-4 py-1.5 border-b border-[#30363d]/60 bg-[#0d1117]/80 text-[11px] font-mono text-[#8b949e]">
          <Terminal className="size-3 text-[#58a6ff]" />
          <span>{LANGUAGES.find((l) => l.id === activeLang)?.file}</span>
        </div>

        {/* Code Viewport */}
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-xs leading-relaxed text-[#c9d1d9] selection:bg-wise-green/30 selection:text-white">
            <code>{activeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
