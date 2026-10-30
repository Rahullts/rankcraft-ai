import { PackageRun } from '../state/types';
import { countWords } from './text';

export function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'seo-content';
}

export function formatPackageMarkdown(run: PackageRun): string {
  const { input, strategy, outline, articleMarkdown, faqs, evaluation } = run;
  const dateStr = new Date(run.timestamp).toISOString().split('T')[0];

  let md = `# SEO Content Package: ${input.primaryKeyword}

Generated on ${dateStr} by AI SEO Content Assistant
Model: ${run.meta.isMock ? 'Mock Provider' : 'Live LLM Provider'}
Target Market: ${input.market} | Intent: ${input.intent} | Language: ${input.language}
Target Word Count: ${input.wordCount} words | Actual Word Count: ${countWords(articleMarkdown || '')} words

---

## 1. SEO Title Suggestions
`;

  if (strategy?.titles) {
    strategy.titles.forEach((t, i) => {
      md += `${i + 1}. **${t.text}** (${t.angle} angle - ${t.text.length} chars)\n`;
    });
  }

  md += `\n## 2. Meta Description\n\n`;
  if (strategy?.metaDescription) {
    md += `> ${strategy.metaDescription}\n\n*(Length: ${strategy.metaDescription.length} characters - Target: 155-160)*\n`;
  }

  md += `\n## 3. Targeted Keywords\n\n`;
  if (strategy?.keywords) {
    md += `- **Primary:** ${strategy.keywords.primary}\n`;
    md += `- **Secondary:** ${strategy.keywords.secondary.join(', ')}\n`;
    md += `- **Long-tail:** ${strategy.keywords.longTail.join(', ')}\n`;
    md += `\n*(Note: Keywords generated without fabricated volume or difficulty metrics per academic guidelines)*\n`;
  }

  md += `\n## 4. Content Outline\n\n`;
  if (outline?.sections) {
    outline.sections.forEach((sec) => {
      md += `### ${sec.h2}\n`;
      sec.h3.forEach((sub) => {
        md += `- ${sub}\n`;
      });
      md += `\n`;
    });
  }

  md += `\n## 5. Full Article Draft\n\n`;
  if (articleMarkdown) {
    md += `${articleMarkdown}\n\n`;
  }

  md += `\n## 6. Frequently Asked Questions\n\n`;
  if (faqs) {
    faqs.forEach((faq, i) => {
      md += `### Q${i + 1}: ${faq.question}\n\n${faq.answer}\n\n`;
    });
  }

  if (evaluation) {
    md += `\n## 7. SEO Quality & Prompt Engineering Audit\n\n`;
    md += `Automated Score: ${evaluation.automatedPoints}/${evaluation.applicableAutomatedMax}\n`;
    md += `Manual Score: ${evaluation.manualPoints}/10\n`;
    md += `Total Score: ${evaluation.totalPoints}/${evaluation.applicableAutomatedMax + 10}\n\n`;
    evaluation.rules.forEach((r) => {
      md += `- [${r.status.toUpperCase()}] **${r.id}: ${r.criterion}** (${r.points}/${r.maxPoints} pts): ${r.evidence}\n`;
    });
  }

  return md;
}

export function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportPackageMarkdown(run: PackageRun) {
  const md = formatPackageMarkdown(run);
  const slug = sanitizeSlug(run.input.primaryKeyword);
  const dateStr = new Date(run.timestamp).toISOString().split('T')[0];
  downloadBlob(md, `seo-package-${slug}-${dateStr}.md`, 'text/markdown;charset=utf-8');
}

export function exportPackageJson(run: PackageRun) {
  const json = JSON.stringify(run, null, 2);
  const slug = sanitizeSlug(run.input.primaryKeyword);
  const dateStr = new Date(run.timestamp).toISOString().split('T')[0];
  downloadBlob(json, `seo-package-${slug}-${dateStr}.json`, 'application/json;charset=utf-8');
}

export function exportArticleMarkdown(run: PackageRun) {
  const content = run.articleMarkdown || '';
  const slug = sanitizeSlug(run.input.primaryKeyword);
  const dateStr = new Date(run.timestamp).toISOString().split('T')[0];
  downloadBlob(content, `article-${slug}-${dateStr}.md`, 'text/markdown;charset=utf-8');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    return false;
  }
}
