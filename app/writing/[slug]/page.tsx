import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectionalTransition } from "@/components/view-transitions";
import { WritingArticle } from "@/components/writing-article";
import { writings } from "@/data/writing";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getEntry(slug: string) {
  return writings.find((w) => w.slug === slug);
}

export async function generateStaticParams() {
  return writings.filter((w) => w.body).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);

  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.body?.[0] ?? entry.title,
  };
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getEntry(slug);

  if (!entry || !entry.body) {
    notFound();
  }

  return (
    <DirectionalTransition>
      <WritingArticle entry={entry} />
    </DirectionalTransition>
  );
}
