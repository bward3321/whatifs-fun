import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is average memory span?',
    a: "The average human short-term memory span holds about 7 items (plus or minus 2), a concept known as Miller's Law. Most people reliably recall 5-9 items in sequence. In this game, reaching round 6-7 puts you right at the human average.",
  },
  {
    q: 'How many items can humans remember?',
    a: 'Short-term memory typically holds 4-7 chunks of information at once. With practice and techniques like chunking, some people can remember much longer sequences. Elite memory athletes have been known to recall 50+ items in order.',
  },
  {
    q: 'How to improve short-term memory?',
    a: 'Regular practice with sequence-based memory games like this one helps strengthen working memory. Other evidence-backed techniques include: getting adequate sleep, regular physical exercise, reducing stress, practicing mindfulness meditation, and learning mnemonic strategies.',
  },
  {
    q: 'What is working memory?',
    a: "Working memory is the cognitive system responsible for temporarily holding and manipulating information. Think of it as your brain's mental workspace where you process information in real-time. It's exactly the system you exercise when playing sequence memory games like Remember the Order.",
  },
];

export function FAQSection() {
  return (
    <section className="w-full max-w-2xl mx-auto px-6 py-16 relative z-10" data-testid="faq-section">
      <h2 className="text-base md:text-lg font-semibold text-slate-300 mb-6 font-heading tracking-tight">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border-white/[0.06] bg-white/[0.02] rounded-xl px-4 border"
          >
            <AccordionTrigger
              className="text-sm text-slate-300 hover:text-slate-100 hover:no-underline py-4"
              data-testid={`faq-trigger-${i}`}
            >
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-slate-500 leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
