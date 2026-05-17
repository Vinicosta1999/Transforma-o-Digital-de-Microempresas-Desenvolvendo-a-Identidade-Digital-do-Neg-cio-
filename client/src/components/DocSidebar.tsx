/**
 * DocSidebar — Navegação lateral persistente do Developer Portal
 * Design: Developer Portal — sidebar fixa com seções colapsáveis
 */
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

export interface NavSection {
  id: string;
  label: string;
  icon?: string;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  anchor: string;
  badge?: { text: string; type: "done" | "pending" | "secure" | "warn" };
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: "🗺️",
    items: [
      { id: "intro", label: "Introdução", anchor: "#introducao" },
      { id: "stack", label: "Stack Tecnológica", anchor: "#stack" },
      { id: "architecture", label: "Arquitetura", anchor: "#arquitetura" },
      { id: "folder", label: "Estrutura de Pastas", anchor: "#estrutura-pastas" },
    ],
  },
  {
    id: "frontend",
    label: "01. Frontend",
    icon: "⚡",
    items: [
      { id: "angular", label: "Angular 19 + Signals", anchor: "#angular-signals", badge: { text: "Novo", type: "done" } },
      { id: "standalone", label: "Standalone Components", anchor: "#standalone-components" },
      { id: "tailwind", label: "Tailwind CSS v4", anchor: "#tailwind-v4" },
      { id: "accessibility", label: "Acessibilidade WCAG 2.1", anchor: "#acessibilidade", badge: { text: "AA", type: "secure" } },
    ],
  },
  {
    id: "logistics",
    label: "02. Logística",
    icon: "📦",
    items: [
      { id: "freight", label: "FreightService", anchor: "#freight-service", badge: { text: "Core", type: "done" } },
      { id: "melhorenvio", label: "API Melhor Envio v2", anchor: "#melhor-envio" },
      { id: "checkout", label: "Checkout Component", anchor: "#checkout" },
    ],
  },
  {
    id: "backend",
    label: "03. Backend",
    icon: "🗄️",
    items: [
      { id: "supabase", label: "Supabase Setup", anchor: "#supabase" },
      { id: "sql", label: "Script SQL Completo", anchor: "#sql-script", badge: { text: "RLS", type: "secure" } },
      { id: "rls", label: "Políticas de Segurança", anchor: "#rls-policies" },
      { id: "catalog", label: "View public_catalog", anchor: "#public-catalog" },
    ],
  },
  {
    id: "dashboard",
    label: "04. Dashboard",
    icon: "📊",
    items: [
      { id: "apexcharts", label: "ApexCharts + RPC", anchor: "#apexcharts" },
      { id: "analytics", label: "Componente Analytics", anchor: "#analytics-component" },
    ],
  },
  {
    id: "devops",
    label: "05. DevOps",
    icon: "🚀",
    items: [
      { id: "cicd", label: "GitHub Actions CI/CD", anchor: "#github-actions", badge: { text: "YAML", type: "pending" } },
      { id: "jest", label: "Jest + jest-axe", anchor: "#jest-tests" },
      { id: "deploy", label: "Vercel Deploy", anchor: "#vercel-deploy" },
    ],
  },
  {
    id: "deliverables",
    label: "Entregáveis",
    icon: "✅",
    items: [
      { id: "checklist", label: "Checklist de Requisitos", anchor: "#checklist" },
      { id: "team", label: "Equipe do Projeto", anchor: "#equipe" },
    ],
  },
];

interface DocSidebarProps {
  activeSection: string;
}

export default function DocSidebar({ activeSection }: DocSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    overview: true,
    frontend: true,
    logistics: true,
    backend: true,
    dashboard: true,
    devops: true,
    deliverables: true,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const SidebarContent = () => (
    <nav aria-label="Navegação da documentação" className="h-full overflow-y-auto py-6 px-3">
      {/* Logo / Título */}
      <div className="mb-6 px-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
               style={{ background: "oklch(0.42 0.18 255)" }}>
            CP
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "oklch(0.42 0.18 255)" }}>Case Point</p>
            <p className="text-xs" style={{ color: "oklch(0.52 0.02 250)" }}>Docs v2.0</p>
          </div>
        </div>
        <div className="mt-3 px-2 py-1.5 rounded-md text-xs"
             style={{ background: "oklch(0.93 0.04 255)", color: "oklch(0.35 0.12 255)" }}>
          🎓 UNIVESP — Grupo 08 — PI 2026
        </div>
      </div>

      <div className="space-y-0.5">
        {NAV_SECTIONS.map(section => (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-slate-100"
              style={{ color: "oklch(0.45 0.03 250)" }}
              aria-expanded={expanded[section.id]}
            >
              <span className="flex items-center gap-2">
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </span>
              {expanded[section.id]
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {expanded[section.id] && (
              <div className="ml-2 mt-0.5 space-y-0.5">
                {section.items.map(item => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.anchor}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-all duration-150 ${
                        isActive ? "nav-item-active" : "hover:bg-slate-100"
                      }`}
                      style={isActive ? {} : { color: "oklch(0.35 0.02 250)" }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`tech-badge text-xs px-1.5 py-0.5 ${
                          item.badge.type === "done" ? "status-done" :
                          item.badge.type === "secure" ? "status-secure" :
                          item.badge.type === "warn" ? "status-warn" :
                          "status-pending"
                        }`}>
                          {item.badge.text}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r sticky top-0 h-screen"
        style={{ background: "oklch(0.97 0.005 250)", borderColor: "oklch(0.9 0.01 250)" }}
        aria-label="Sidebar de navegação"
      >
        <SidebarContent />
      </aside>

      {/* Botão Mobile */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white"
        style={{ background: "oklch(0.42 0.18 255)" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu de navegação"}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Mobile (drawer) */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 shadow-2xl overflow-y-auto"
            style={{ background: "oklch(0.97 0.005 250)" }}
          >
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
