import Section from "@/components/shared/Section";
import PageTitle from "@/components/shared/titles/PageTitle";
import type { LegalDoc } from "@/data/legal";

/**
 * Renderer for long-form legal documents (Privacy Policy, Public Offer).
 * Reused by both routes — content comes from `data/legal.ts`.
 */
export default function LegalPage({
  title,
  doc,
}: {
  title: string;
  doc: LegalDoc;
}) {
  return (
    <Section background="white" clearFooterWave>
      <article className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <PageTitle className="text-navy">{title}</PageTitle>
          <p className="text-14med text-grey-dark">{doc.updated}</p>
          <p className="text-16reg text-graphite">{doc.intro}</p>
        </header>

        {doc.sections.map((section, index) => (
          <section key={index} className="flex flex-col gap-3">
            <h2 className="font-findsans text-24semi uppercase text-navy">
              {section.heading}
            </h2>
            {section.blocks.map((block, blockIndex) =>
              block.type === "p" ? (
                <p key={blockIndex} className="text-16reg text-graphite">
                  {block.text}
                </p>
              ) : (
                <ul
                  key={blockIndex}
                  className="flex list-disc flex-col gap-2 pl-5 text-16reg text-graphite marker:text-red"
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}
      </article>
    </Section>
  );
}
