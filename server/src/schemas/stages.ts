import { z } from 'zod';

export const titleItemSchema = z.object({
  text: z.string().min(1, 'Title text cannot be empty'),
  angle: z.string().min(1, 'Title angle cannot be empty')
});

export const strategySchema = z.object({
  titles: z
    .array(titleItemSchema)
    .length(5, 'Strategy must have exactly 5 title suggestions'),
  metaDescription: z
    .string()
    .min(10, 'Meta description is too short'),
  keywords: z.object({
    primary: z.string().min(1, 'Primary keyword cannot be empty'),
    secondary: z
      .array(z.string().min(1))
      .min(3, 'At least 3 secondary keywords required')
      .max(12),
    longTail: z
      .array(z.string().min(1))
      .min(3, 'At least 3 long-tail keywords required')
      .max(12)
  })
});

export const outlineSectionSchema = z.object({
  h2: z.string().min(1, 'H2 heading cannot be empty'),
  h3: z.array(z.string()).default([]),
  purpose: z.string().min(1, 'Section purpose cannot be empty'),
  targetWords: z.number().int().positive('Target words must be positive')
});

export const outlineSchema = z.object({
  intro: z.string().min(1, 'Intro plan cannot be empty'),
  sections: z
    .array(outlineSectionSchema)
    .min(3, 'Outline must have at least 3 sections')
    .max(10, 'Outline must have at most 10 sections')
});

export const faqItemSchema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters')
});

export const faqsSchema = z.object({
  faqs: z.array(faqItemSchema).length(5, 'Must provide exactly 5 FAQs')
});

export type Strategy = z.infer<typeof strategySchema>;
export type Outline = z.infer<typeof outlineSchema>;
export type Faq = z.infer<typeof faqItemSchema>;
