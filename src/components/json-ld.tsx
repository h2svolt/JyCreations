/** Renders a structured-data script tag. Google explicitly supports JSON-LD
 * anywhere in the document — head or body — so this is safe to drop straight
 * into a page's JSX rather than fighting the router's head-scripts API. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
