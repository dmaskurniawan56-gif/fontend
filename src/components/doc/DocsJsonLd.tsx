import React from "react";
import { DocItem } from "./types";
import { generateDocJsonLd } from "./data";

interface DocsJsonLdProps {
  doc: DocItem;
  baseUrl: string;
}

export function DocsJsonLd({ doc, baseUrl }: DocsJsonLdProps) {
  const schemas = generateDocJsonLd(doc, baseUrl);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
