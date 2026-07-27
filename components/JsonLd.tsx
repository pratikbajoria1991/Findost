/** Renders a schema.org JSON-LD block. Server component — no client JS. */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (our own structured data, no user input)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
