import React from "react";

/**
 * Minimal markdown renderer for concierge replies — bold, italics, bullets,
 * numbered lists and headings. Avoids a heavy dependency for a chat bubble.
 */

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // **bold** | _italic_ | *italic*
  const re = /(\*\*[^*]+\*\*|_[^_]+_|\*[^*\n]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <em key={key++} className="text-mist-300">
          {tok.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderTable(rows: string[][], key: number): React.ReactNode {
  const [head, ...body] = rows;
  return (
    <div key={key} className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((c, i) => (
              <th key={i} className="border-b border-ink-600/60 px-2 py-1.5 text-left font-semibold text-white">
                {renderInline(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri} className="border-b border-ink-700/40 last:border-b-0">
              {r.map((c, ci) => (
                <td key={ci} className="px-2 py-1.5 align-top">
                  {renderInline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: { marker: "ul" | "ol"; items: string[] } | null = null;
  let tableBuf: string[][] | null = null;
  let key = 0;

  const flushList = () => {
    if (!listBuf) return;
    const Tag = listBuf.marker;
    out.push(
      <Tag
        key={key++}
        className={`my-1.5 space-y-1 pl-5 ${Tag === "ul" ? "list-disc" : "list-decimal"}`}
      >
        {listBuf.items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Tag>,
    );
    listBuf = null;
  };

  const flushTable = () => {
    if (!tableBuf) return;
    if (tableBuf.length > 0) out.push(renderTable(tableBuf, key++));
    tableBuf = null;
  };

  for (const line of lines) {
    const isTableRow = /^\s*\|.*\|\s*$/.test(line);
    if (isTableRow) {
      flushList();
      const isSeparator = /^\s*\|[\s:|-]+\|\s*$/.test(line);
      if (!tableBuf) tableBuf = [];
      if (!isSeparator) tableBuf.push(splitRow(line));
      continue;
    }
    flushTable();
    const ul = line.match(/^\s*[-•]\s+(.*)/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)/);
    const h = line.match(/^\s*#{1,4}\s+(.*)/);
    if (ul) {
      if (!listBuf || listBuf.marker !== "ul") {
        flushList();
        listBuf = { marker: "ul", items: [] };
      }
      listBuf.items.push(ul[1]);
    } else if (ol) {
      if (!listBuf || listBuf.marker !== "ol") {
        flushList();
        listBuf = { marker: "ol", items: [] };
      }
      listBuf.items.push(ol[1]);
    } else {
      flushList();
      if (h) {
        out.push(
          <p key={key++} className="mt-2 font-semibold text-white">
            {renderInline(h[1])}
          </p>,
        );
      } else if (line.trim() === "") {
        out.push(<div key={key++} className="h-2" />);
      } else {
        out.push(<p key={key++}>{renderInline(line)}</p>);
      }
    }
  }
  flushList();
  flushTable();
  return <div className="space-y-0.5 text-[0.925rem] leading-relaxed">{out}</div>;
}
