import { z } from 'zod';

export const intentEnum = z.enum([
  'informational',
  'commercial',
  'transactional',
  'navigational'
]);

export const toneEnum = z.enum([
  'professional',
  'friendly',
  'conversational',
  'authoritative',
  'persuasive',
  'educational'
]);

export const languageEnum = z.enum([
  'English',
  'Tamil',
  'Hindi',
  'Spanish',
  'French',
  'German'
]);

// Normalizes whitespace and strips control characters
const cleanString = (val: string) =>
  val
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const seoInputSchema = z.object({
  topic: z
    .string()
    .transform(cleanString)
    .pipe(z.string().min(3, 'Topic must be at least 3 characters').max(150, 'Topic must be at most 150 characters')),
  audience: z
    .string()
    .transform(cleanString)
    .pipe(z.string().min(3, 'Audience must be at least 3 characters').max(100, 'Audience must be at most 100 characters')),
  industry: z
    .string()
    .transform(cleanString)
    .pipe(z.string().min(2, 'Industry must be at least 2 characters').max(80, 'Industry must be at most 80 characters')),
  market: z
    .string()
    .transform(cleanString)
    .pipe(z.string().min(2, 'Market must be at least 2 characters').max(80, 'Market must be at most 80 characters')),
  primaryKeyword: z
    .string()
    .transform(cleanString)
    .pipe(
      z
        .string()
        .min(2, 'Primary keyword must be at least 2 characters')
        .max(60, 'Primary keyword must be at most 60 characters')
        .refine(
          (val) => val.split(' ').filter(Boolean).length <= 6,
          'Primary keyword must be at most 6 words'
        )
    ),
  intent: intentEnum,
  tone: toneEnum,
  language: languageEnum,
  wordCount: z
    .number({ invalid_type_error: 'Word count must be a number' })
    .int('Word count must be an integer')
    .min(300, 'Word count must be at least 300')
    .max(2000, 'Word count must be at most 2000')
});

export type SeoInput = z.infer<typeof seoInputSchema>;
export type Intent = z.infer<typeof intentEnum>;
export type Tone = z.infer<typeof toneEnum>;
export type Language = z.infer<typeof languageEnum>;
