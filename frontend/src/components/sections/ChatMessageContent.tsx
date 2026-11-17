"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ChatMessageContentProps {
  content: string;
  role: "user" | "assistant";
}

function parseBriefingSections(content: string) {
  const sections = content.split(/\n(?=###\s)/).filter(Boolean);
  if (sections.length <= 1 && !content.trimStart().startsWith("###")) {
    return null;
  }
  return sections;
}

export function ChatMessageContent({ content, role }: ChatMessageContentProps) {
  if (role === "user") {
    return <p className="text-sm leading-relaxed">{content}</p>;
  }

  const sections = parseBriefingSections(content);

  if (sections) {
    return (
      <div className="space-y-2.5 min-w-0">
        {sections.map((section, index) => (
          <BriefingSection key={index} markdown={section.trim()} />
        ))}
      </div>
    );
  }

  return (
    <div className="chat-markdown min-w-0">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-slate-700 mb-2 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-0 list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2 pl-4 list-decimal text-sm text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-slate-700 flex gap-2 leading-relaxed">
              <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
              <span className="min-w-0">{children}</span>
            </li>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-2">
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function BriefingSection({ markdown }: { markdown: string }) {
  const titleMatch = markdown.match(/^###\s+\*?\*?(.+?)\*?\*?\s*$/m);
  const title = titleMatch?.[1]?.replace(/\*\*/g, "").trim() ?? "Update";
  const body = markdown.replace(/^###\s+.+\n?/m, "").trim();

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-2">
        {title}
      </h4>
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-xs leading-relaxed text-slate-600 mb-1.5 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-800">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className={cn("space-y-1.5", "list-none pl-0")}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 pl-4 list-decimal text-xs text-slate-600">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs text-slate-600 flex gap-2 leading-relaxed">
              <span className="text-emerald-400 shrink-0">•</span>
              <span className="min-w-0 [&>p]:inline [&>p]:mb-0">{children}</span>
            </li>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
