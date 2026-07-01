export type ResearchSourceType =
  | 'documento'
  | 'plataforma'
  | 'site-oficial'
  | 'publicacao'
  | 'dados'
  | 'rede-social'
  | 'outro';

export type ResearchSourceScope = 'brasil' | 'global' | 'regional';

export type ResearchSourceRelevance = 'alta' | 'media' | 'baixa';

export interface ResearchSource {
  id: string;
  title: string;
  description: string;
  type: ResearchSourceType;
  scope: ResearchSourceScope;
  url: string;
  tags: string[];
  relevance: ResearchSourceRelevance;
  lastVerifiedAt?: string;
  notes?: string;
}
