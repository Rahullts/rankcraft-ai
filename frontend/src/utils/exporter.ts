/**
 * Export and Clipboard Utilities for RankCraft AI.
 * Generates downloadable Markdown, JSON, and standalone HTML files with full SEO assets.
 */

import { SeoContentResult, GenerationInput, ContentEvaluation } from '../types';

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

function triggerDownload(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(content: SeoContentResult, inputs: GenerationInput, evaluation?: ContentEvaluation) {
  const sanitizedTopic = (inputs.topic || 'seo-content').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${sanitizedTopic}-rankcraft-seo.md`;

  const md = `---
title: "${content.recommended_title.title.replace(/"/g, '\\"')}"
meta_description: "${content.meta_description.replace(/"/g, '\\"')}"
primary_keyword: "${inputs.primary_keyword}"
target_intent: "${inputs.search_intent}"
target_audience: "${inputs.target_audience}"
generated_by: "RankCraft AI Assistant"
date: "${new Date().toISOString()}"
heuristic_score: "${evaluation ? evaluation.overall_score + '% (' + evaluation.letter_grade + ')' : 'N/A'}"
---

# ${content.recommended_title.title}

> **Meta Description (${content.meta_description.length} chars)**:
> ${content.meta_description}

---

## 🎯 Strategic SEO Metadata

- **Primary Target Keyword**: ${content.primary_keyword_analysis.keyword}
- **Placement Strategy**: ${content.primary_keyword_analysis.placement_strategy}
- **Target Density**: ${content.primary_keyword_analysis.density_target}
- **Search Intent**: ${content.search_intent_analysis.detected_intent} (${content.search_intent_analysis.content_angle})

### Alternative Title Ideas
${content.title_suggestions.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### Keyword Semantic Clusters
- **Secondary Keywords**: ${content.secondary_keywords.join(', ')}
- **Long-Tail Variations**:
${content.long_tail_keywords.map((k) => `  - ${k}`).join('\n')}

---

## 📋 Content Outline Hierarchy
${content.article_outline
  .map(
    (item) =>
      `### [${item.level}] ${item.heading}\n${item.key_points.map((p) => `- ${p}`).join('\n')}`
  )
  .join('\n\n')}

---

## 📝 Complete Article Draft

${content.article_draft}

---

## ❓ Frequently Asked Questions (FAQ Schema Ready)

${content.faqs
  .map(
    (faq, i) =>
      `### Q${i + 1}: ${faq.question}\n\n**Answer**: ${faq.answer}`
  )
  .join('\n\n')}

---

## 🔗 Internal Linking Recommendations

| Anchor Text | Target Concept / Guide | Natural Context |
| :--- | :--- | :--- |
${content.internal_linking
  .map(
    (link) =>
      `| \`${link.anchor_text}\` | ${link.target_concept} | "${link.context_sentence}" |`
  )
  .join('\n')}

---

## ✅ Quality Checklist & Optimization Notes

${content.quality_checklist
  .map(
    (c) =>
      `- [${c.status === 'passed' ? 'x' : ' '}] **${c.item}**: ${c.note}`
  )
  .join('\n')}

### Recommended Next Steps
${content.improvement_suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;

  triggerDownload(filename, md, 'text/markdown;charset=utf-8');
}

export function downloadJson(content: SeoContentResult, inputs: GenerationInput, evaluation?: ContentEvaluation) {
  const sanitizedTopic = (inputs.topic || 'seo-content').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${sanitizedTopic}-rankcraft-data.json`;

  const payload = {
    metadata: {
      generated_by: 'RankCraft AI',
      timestamp: new Date().toISOString(),
      inputs,
      evaluation
    },
    seo_content: content
  };

  triggerDownload(filename, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
}

export function downloadHtml(content: SeoContentResult, inputs: GenerationInput, evaluation?: ContentEvaluation) {
  const sanitizedTopic = (inputs.topic || 'seo-content').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${sanitizedTopic}-rankcraft-preview.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${content.recommended_title.title}</title>
  <meta name="description" content="${content.meta_description}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #0f172a; font-size: 2.2rem; margin-bottom: 0.5rem; }
    h2 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 32px; }
    .meta-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 24px 0; }
    .faq-card { background: #f1f5f9; padding: 14px 18px; border-radius: 8px; margin-bottom: 12px; }
    .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-right: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
    th { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="meta-box">
    <strong>SERP Preview:</strong><br>
    <h3 style="color:#1d4ed8;margin:4px 0;">${content.recommended_title.title}</h3>
    <span style="color:#15803d;font-size:0.9rem;">https://example.com/${sanitizedTopic}</span>
    <p style="margin:6px 0 0;color:#475569;">${content.meta_description} (<em>${content.meta_description.length} characters</em>)</p>
  </div>

  <article>
    ${content.article_draft.replace(/\n\n/g, '</p><p>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>')}
  </article>

  <h2>Frequently Asked Questions</h2>
  ${content.faqs.map(faq => `
    <div class="faq-card">
      <strong>Q: ${faq.question}</strong>
      <p style="margin:6px 0 0;">${faq.answer}</p>
    </div>
  `).join('')}
</body>
</html>`;

  triggerDownload(filename, html, 'text/html;charset=utf-8');
}
