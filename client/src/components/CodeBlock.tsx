/**
 * CodeBlock — Componente de exibição de código com syntax highlighting e cópia
 * Design: Developer Portal — JetBrains Mono, fundo escuro, botão de cópia
 */
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

// Colorização simples de tokens TypeScript/SQL/YAML
function highlightCode(code: string, lang: string): string {
  if (lang === "sql") {
    return code
      .replace(/\b(CREATE|TABLE|VIEW|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|ALTER|DROP|INDEX|ON|AS|WITH|POLICY|ENABLE|ROW|LEVEL|SECURITY|FORCE|USING|CHECK|GRANT|TO|PUBLIC|AUTHENTICATED|ALL|REFERENCES|PRIMARY|KEY|FOREIGN|NOT|NULL|DEFAULT|UNIQUE|SERIAL|BIGINT|TEXT|VARCHAR|BOOLEAN|TIMESTAMP|NUMERIC|INTEGER|JSONB|UUID|RETURNS|LANGUAGE|PLPGSQL|BEGIN|END|DECLARE|IF|THEN|ELSE|RETURN|RAISE|EXCEPTION|FUNCTION|REPLACE|OR|AND|IN|EXISTS|JOIN|LEFT|INNER|OUTER|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|COALESCE|COUNT|SUM|AVG|MAX|MIN|NOW|CURRENT_TIMESTAMP|auth\.uid|gen_random_uuid)\b/gi,
        '<span class="token-keyword">$1</span>')
      .replace(/'([^']*)'/g, '<span class="token-string">\'$1\'</span>')
      .replace(/--[^\n]*/g, '<span class="token-comment">$&</span>');
  }

  if (lang === "yaml") {
    return code
      .replace(/^(\s*)([\w-]+):/gm, '$1<span class="token-type">$2</span>:')
      .replace(/#[^\n]*/g, '<span class="token-comment">$&</span>')
      .replace(/:\s*'([^']*)'/g, ': <span class="token-string">\'$1\'</span>')
      .replace(/:\s*"([^"]*)"/g, ': <span class="token-string">"$1"</span>');
  }

  // TypeScript / JavaScript
  return code
    .replace(/\/\/[^\n]*/g, '<span class="token-comment">$&</span>')
    .replace(/\/\*[\s\S]*?\*\//g, '<span class="token-comment">$&</span>')
    .replace(/\b(import|export|from|const|let|var|function|class|interface|type|enum|extends|implements|return|if|else|for|while|switch|case|break|continue|new|this|super|async|await|try|catch|finally|throw|of|in|default|public|private|protected|readonly|static|abstract|override|declare|namespace|module|require|true|false|null|undefined|void|never|any|unknown|inject|signal|computed|effect|input|output|viewChild|contentChild|NgModule|Component|Injectable|Directive|Pipe|OnInit|OnDestroy|ChangeDetectionStrategy|OnPush)\b/g,
      '<span class="token-keyword">$1</span>')
    .replace(/@[\w]+/g, '<span class="token-decorator">$&</span>')
    .replace(/`([^`]*)`/g, '<span class="token-string">`$1`</span>')
    .replace(/'([^']*)'/g, '<span class="token-string">\'$1\'</span>')
    .replace(/"([^"]*)"/g, '<span class="token-string">"$1"</span>')
    .replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="token-type">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>');
}

const LANG_LABELS: Record<string, string> = {
  ts: "TypeScript",
  typescript: "TypeScript",
  sql: "SQL",
  yaml: "YAML",
  yml: "YAML",
  json: "JSON",
  bash: "Bash",
  sh: "Shell",
  html: "HTML",
  css: "CSS",
};

export default function CodeBlock({ code, language = "ts", filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = highlightCode(code.trim(), language);
  const lines = highlighted.split("\n");
  const langLabel = LANG_LABELS[language] || language.toUpperCase();

  return (
    <div className="code-block my-4 group">
      {/* Cabeçalho do bloco */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10"
           style={{ background: "oklch(0.09 0.02 250)" }}>
        <div className="flex items-center gap-3">
          {/* Dots decorativos */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          {filename && (
            <span className="text-xs font-mono text-slate-400">{filename}</span>
          )}
          {!filename && (
            <span className="text-xs font-mono text-slate-500">{langLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs px-2 py-0.5 rounded text-slate-400"
                  style={{ background: "oklch(0.2 0.03 250)" }}>
              {langLabel}
            </span>
          )}
          <button
            onClick={handleCopy}
            aria-label="Copiar código"
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-all duration-200 text-slate-400 hover:text-white"
            style={{ background: copied ? "oklch(0.35 0.1 145)" : "oklch(0.2 0.03 250)" }}
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5" /><span>Copiado!</span></>
            ) : (
              <><Copy className="w-3.5 h-3.5" /><span>Copiar</span></>
            )}
          </button>
        </div>
      </div>

      {/* Corpo do código */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ background: "oklch(0.12 0.02 250)" }}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                {showLineNumbers && (
                  <td className="select-none text-right pr-4 pl-4 text-xs font-mono w-10"
                      style={{ color: "oklch(0.4 0.02 250)", userSelect: "none" }}>
                    {i + 1}
                  </td>
                )}
                <td className="pr-6 pl-2 py-0">
                  <pre className="text-sm font-mono leading-relaxed m-0 p-0 whitespace-pre"
                       style={{ color: "oklch(0.88 0.02 250)" }}
                       dangerouslySetInnerHTML={{ __html: line || " " }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
