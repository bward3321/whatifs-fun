import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    q: 'How fast are average reflexes?',
    a: 'The average human visual reaction time is about 250 milliseconds. In Too Fast To Click, most players survive around 27 seconds before the speed becomes overwhelming. Training regularly can improve your reaction time by 10-20%.',
  },
  {
    q: 'How can I improve my reaction time?',
    a: "Practice is key! Play regularly to build pattern recognition. Get enough sleep, stay hydrated, and minimize distractions. Start with Classic mode to build fundamentals, then progress to Rule Switch and Chaos modes for cognitive flexibility.",
  },
  {
    q: 'Is this a reflex or memory game?',
    a: 'It\'s both! The core mechanic tests visual reflexes \u2014 how fast you can identify and click targets. But Rule Switch and Chaos modes add a cognitive component, requiring you to constantly update your mental model of what\'s "correct."',
  },
  {
    q: 'What are the different game modes?',
    a: 'Classic Mode keeps one rule throughout with increasing speed. Rule Switch Mode changes the rule every 10-15 seconds, forcing you to adapt quickly. Chaos Mode is the ultimate challenge \u2014 fast pace, frequent rule changes, and tricky decoys.',
  },
  {
    q: 'How is the score calculated?',
    a: 'You earn 1 point for each correct click. You start with 3 lives and lose one for clicking wrong objects or missing correct ones when a wave expires. The game ends when all lives are lost. Your final score, survival time, and best streak are tracked.',
  },
];

export const FAQ = () => {
  return (
    <section className="faq-section" data-testid="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="faq-accordion">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="faq-item">
            <AccordionTrigger
              className="faq-trigger"
              data-testid={`faq-trigger-${i}`}
            >
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="faq-content">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
