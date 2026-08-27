import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/data/services";

export default function FAQ({ items }: { items: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((f, i) => (
        <AccordionItem key={i} value={`i${i}`} className="border-border">
          <AccordionTrigger className="text-left font-head text-base uppercase hover:text-gold hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
