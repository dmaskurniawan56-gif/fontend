import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getDocBySlug,
  getAllDocSlugs,
  getDocSeoMetadata,
} from "@/components/doc/data";
import { DocsEndpointView } from "@/components/doc/DocsEndpointView";
import { DocsGuideView } from "@/components/doc/DocsGuideView";
import { DocsTableOfContents } from "@/components/doc/DocsTableOfContents";
import { DocsJsonLd } from "@/components/doc/DocsJsonLd";

interface DocsPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://wahide.id";

/**
 * Generate static params for all documentation pages at build time
 */
export async function generateStaticParams() {
  return getAllDocSlugs();
}

/**
 * Generate dynamic SEO metadata per endpoint / guide adhering to Google Page 1 standards
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

  const seo = getDocSeoMetadata(doc.slug, doc.title, doc.description);
  const canonicalUrl = `${BASE_URL}/docs/${doc.slug}`;

  return {
    title: seo.seoTitle,
    description: seo.seoDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${seo.seoTitle} | Wahide API`,
      description: seo.seoDescription,
      url: canonicalUrl,
      type: "article",
      siteName: "Wahide API Docs",
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.seoTitle} | Wahide API`,
      description: seo.seoDescription,
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
    <>
      {/* Schema.org Structured Data (BreadcrumbList & TechArticle) */}
      <DocsJsonLd doc={doc} baseUrl={BASE_URL} />

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
    </>
  );
}
