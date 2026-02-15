import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export default function FAQSection({ faqs, intro }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section" data-testid="faq-section">
      {intro && (
        <p className="faq-intro" data-testid="category-intro">
          {intro}
        </p>
      )}
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="faq-accordion">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="faq-item">
            <AccordionTrigger className="faq-question" data-testid={`faq-question-${i}`}>
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="faq-answer" data-testid={`faq-answer-${i}`}>
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
