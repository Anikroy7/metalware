import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategory } from "@/data/categories";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ProductDetail } from "./product-detail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: `${product.name} — ${product.band}`, description: product.description };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        {category && (
          <>
            <ChevronRight className="size-3" />
            <Link href={`/shop?category=${category.slug}`} className="hover:text-ink">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      <section className="pt-24">
        <Reveal>
          <SectionHeading eyebrow="Up next" title="You Might Also Like" href="/shop" />
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((p) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </div>
  );
}
