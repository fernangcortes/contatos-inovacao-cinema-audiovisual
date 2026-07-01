export type Priority = '1' | '2' | '3';

export type Category =
  | 'hub-coworking'
  | 'laboratorio-publico'
  | 'laboratorio-universidade'
  | 'universidade-ensino'
  | 'espaco-cultural'
  | 'festival'
  | 'associacao'
  | 'produtora'
  | 'plataforma-pesquisa'
  | 'aceleracao'
  | 'evento-mercado'
  | 'fomento'
  | 'internacional'
  | 'corporativo'
  | 'pessoa'
  | 'outro';

export type ContactType = 'instituicao' | 'pessoa';

export type Channel = 'email' | 'whatsapp' | 'linkedin' | 'social' | 'site';

export interface Suggestion {
  channel: Channel;
  label: string;
  text: string;
}

export interface ContactLocation {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  country: string;
}

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  category: Category;
  priority: Priority;
  institution: string;
  role?: string;
  description: string;
  relevance: string;
  strategy: string;
  suggestions: Suggestion[];
  links: { label: string; url: string }[];
  tags: string[];
  images?: string[];
  avatarPosition?: string;
  avatarScale?: number;
  completed: boolean;
  location?: ContactLocation;
  source?: string;
  sourceUrl?: string;
  lastVerifiedAt?: string;
  verificationNotes?: string;
  mapSearchUrls?: { label: string; url: string }[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
  action: string;
}
