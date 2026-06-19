import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface TemplateValues {
  'SEU NOME': string;
  'NOME DA STARTUP': string;
  'BREVE DESCRIÇÃO DO APP': string;
  'LINK DO APP': string;
  'LINK DEMO': string;
  LINKEDIN: string;
  TELEFONE: string;
}

export const DEFAULT_TEMPLATE_VALUES: TemplateValues = {
  'SEU NOME': '',
  'NOME DA STARTUP': '',
  'BREVE DESCRIÇÃO DO APP': '',
  'LINK DO APP': '',
  'LINK DEMO': '',
  LINKEDIN: '',
  TELEFONE: '',
};

const TEMPLATE_VALUE_ALIASES: Record<keyof TemplateValues, string[]> = {
  'SEU NOME': ['SEU NOME', 'YOUR NAME', 'NOME'],
  'NOME DA STARTUP': ['NOME DA STARTUP', 'APP NAME'],
  'BREVE DESCRIÇÃO DO APP': [
    'BREVE DESCRIÇÃO DO APP',
    'BREVE DESCRIÇÃO',
    'DESCRIÇÃO BREVE',
    'DESCRIÇÃO',
    'BRIEF DESCRIPTION',
    'TECNOLOGIA',
    'PROBLEMA',
    'distribuição/acessibilidade/workflow',
    'animation/documentary/interactive storytelling',
    'AI/VR/AR/emerging tech',
    'AI/VR/interactive media',
  ],
  'LINK DO APP': ['LINK DO APP', 'APP LINK', 'LINK DO APP/DEMO', 'LINK'],
  'LINK DEMO': ['LINK DEMO'],
  LINKEDIN: ['LINKEDIN'],
  TELEFONE: ['TELEFONE'],
};

export function applyTemplateValues(text: string, values: Partial<TemplateValues>): string {
  let result = text;
  (Object.keys(TEMPLATE_VALUE_ALIASES) as Array<keyof TemplateValues>).forEach((key) => {
    const value = values[key]?.trim();
    if (!value) return;
    TEMPLATE_VALUE_ALIASES[key].forEach((alias) => {
      result = result.replaceAll(`[${alias}]`, value);
    });
  });
  return result;
}

export interface ContactLink {
  label: string;
  url: string;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getLinkPatterns(label: string): RegExp[] {
  const escaped = escapeRegExp(label);
  // Labels com espaços também podem ser encontrados como substring;
  // labels de uma palavra usam word boundary para evitar matches parciais.
  if (label.includes(' ')) {
    return [
      new RegExp(escaped, 'i'),
      new RegExp(`\\b${escapeRegExp(label.split(' ')[0])}\\b`, 'i'),
    ];
  }
  return [new RegExp(`\\b${escaped}\\b`, 'i')];
}

export function linkifyText(
  text: string,
  links: ContactLink[]
): Array<{ type: 'text' | 'link'; content: string; url?: string }> {
  const sorted = [...links].sort((a, b) => b.label.length - a.label.length);
  const parts: Array<{ type: 'text' | 'link'; content: string; url?: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matchIndex = -1;
    let matchedLength = 0;
    let matchedLink: ContactLink | null = null;

    for (const link of sorted) {
      const patterns = getLinkPatterns(link.label);
      for (const regex of patterns) {
        const match = remaining.match(regex);
        if (match && (matchIndex === -1 || (match.index ?? Infinity) < matchIndex)) {
          matchIndex = match.index ?? 0;
          matchedLength = match[0].length;
          matchedLink = link;
        }
      }
    }

    if (matchedLink && matchIndex !== -1) {
      if (matchIndex > 0) {
        parts.push({ type: 'text', content: remaining.slice(0, matchIndex) });
      }
      parts.push({ type: 'link', content: matchedLink.label, url: matchedLink.url });
      remaining = remaining.slice(matchIndex + matchedLength);
    } else {
      parts.push({ type: 'text', content: remaining });
      break;
    }
  }

  return parts;
}
