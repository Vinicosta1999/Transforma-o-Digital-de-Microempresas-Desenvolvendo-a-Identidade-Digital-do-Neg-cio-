/**
 * DocHeader — Cabeçalho fixo do Developer Portal
 * Design: Developer Portal — barra superior com breadcrumb e links
 */
import { ExternalLink, Github, BookOpen } from "lucide-react";

export default function DocHeader() {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{
        background: "oklch(0.99 0 0 / 0.92)",
        borderColor: "oklch(0.9 0.01 250)",
      }}
      role="banner"
    >
      {/* Barra de progresso de leitura */}
      <div id="reading-progress" style={{ width: "0%" }} aria-hidden="true" />

      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Breadcrumb / Título */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "oklch(0.42 0.18 255)" }} />
            <span className="font-semibold text-sm" style={{ color: "oklch(0.15 0.02 250)" }}>
              Case Point
            </span>
          </div>
          <span style={{ color: "oklch(0.7 0.01 250)" }}>/</span>
          <span className="text-sm" style={{ color: "oklch(0.45 0.03 250)" }}>
            Documentação Técnica v2.0
          </span>
        </div>

        {/* Links externos */}
        <div className="flex items-center gap-2">
          <a
            href="https://univesp-pi-03.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors hover:bg-slate-50"
            style={{ color: "oklch(0.35 0.03 250)", borderColor: "oklch(0.88 0.01 250)" }}
            aria-label="Ver protótipo atual (abre em nova aba)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver MVP</span>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors hover:bg-slate-50"
            style={{ color: "oklch(0.35 0.03 250)", borderColor: "oklch(0.88 0.01 250)" }}
            aria-label="GitHub do projeto (abre em nova aba)"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <div
            className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md"
            style={{ background: "oklch(0.93 0.04 255)", color: "oklch(0.35 0.12 255)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Angular 19 + Supabase</span>
          </div>
        </div>
      </div>
    </header>
  );
}
