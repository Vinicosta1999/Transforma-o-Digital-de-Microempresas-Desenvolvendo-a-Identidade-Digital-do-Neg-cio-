/**
 * PageToc — Índice da página (Table of Contents)
 * Design: Developer Portal — coluna direita com links âncora
 */

interface TocItem {
  id: string;
  label: string;
  level: 1 | 2;
}

const TOC_ITEMS: TocItem[] = [
  { id: "introducao", label: "Introdução", level: 1 },
  { id: "stack", label: "Stack Tecnológica", level: 1 },
  { id: "arquitetura", label: "Arquitetura", level: 1 },
  { id: "estrutura-pastas", label: "Estrutura de Pastas", level: 1 },
  { id: "angular-signals", label: "Angular 19 + Signals", level: 1 },
  { id: "standalone-components", label: "Standalone Components", level: 2 },
  { id: "tailwind-v4", label: "Tailwind CSS v4", level: 2 },
  { id: "acessibilidade", label: "Acessibilidade WCAG 2.1", level: 1 },
  { id: "freight-service", label: "FreightService", level: 1 },
  { id: "melhor-envio", label: "API Melhor Envio v2", level: 2 },
  { id: "checkout", label: "Checkout Component", level: 2 },
  { id: "supabase", label: "Supabase Setup", level: 1 },
  { id: "sql-script", label: "Script SQL Completo", level: 2 },
  { id: "rls-policies", label: "Políticas RLS", level: 2 },
  { id: "public-catalog", label: "View public_catalog", level: 2 },
  { id: "apexcharts", label: "ApexCharts + RPC", level: 1 },
  { id: "github-actions", label: "GitHub Actions CI/CD", level: 1 },
  { id: "jest-tests", label: "Jest + jest-axe", level: 2 },
  { id: "vercel-deploy", label: "Vercel Deploy", level: 2 },
  { id: "checklist", label: "Checklist de Requisitos", level: 1 },
  { id: "equipe", label: "Equipe do Projeto", level: 1 },
];

interface PageTocProps {
  activeSection: string;
}

export default function PageToc({ activeSection }: PageTocProps) {
  return (
    <aside
      className="hidden xl:block w-52 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pl-4 pr-2"
      aria-label="Índice desta página"
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-3"
         style={{ color: "oklch(0.52 0.02 250)" }}>
        Nesta página
      </p>
      <nav>
        <ul className="space-y-1" role="list">
          {TOC_ITEMS.map(item => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block text-xs py-1 transition-colors duration-150 border-l-2 ${
                    item.level === 2 ? "pl-4" : "pl-3"
                  } ${
                    isActive
                      ? "font-semibold border-blue-600"
                      : "border-transparent hover:border-slate-300"
                  }`}
                  style={{
                    color: isActive
                      ? "oklch(0.42 0.18 255)"
                      : "oklch(0.52 0.02 250)",
                  }}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
