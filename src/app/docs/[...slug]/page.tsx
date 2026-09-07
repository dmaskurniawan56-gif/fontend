import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getDocBySlug,
  getAllDocSlugs,
} from "@/components/doc/data";
import { DocsEndpointView } from "@/components/doc/DocsEndpointView";
import { DocsGuideView } from "@/components/doc/DocsGuideView";
import { DocsTableOfContents } from "@/components/doc/DocsTableOfContents";

interface DocsPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * Generate static params for all documentation pages at build time
 */
export async function generateStaticParams() {
  return getAllDocSlugs();
}

/**
 * Generate dynamic SEO metadata per endpoint / guide
 */
export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: "Page Not Found",
    };
  }

  const title = `${doc.title} - Wahide WhatsApp API Documentation`;
  const description = doc.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Wahide WhatsApp API Docs",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DocsDynamicPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  // Derive TOC items for guides
  const guideTocItems =
    doc.type === "guide"
      ? [
          { id: "overview", title: "Overview" },
          ...doc.sections
            .filter((s) => s.id !== "overview")
            .map((s) => ({ id: s.id, title: s.title })),
        ]
      : undefined;

  return (
    <div className="flex items-start gap-8">
      {/* Center Main Documentation Body */}
      <div className="flex-1 min-w-0">
        {doc.type === "endpoint" ? (
          <DocsEndpointView doc={doc} />
        ) : (
          <DocsGuideView doc={doc} />
        )}
      </div>

      {/* Right Sidebar: On this page (TOC) - Desktop >= 1280px (xl) */}
      <div className="hidden xl:block w-56 shrink-0">
        <DocsTableOfContents items={guideTocItems} />
      </div>
    </div>
  );
}
