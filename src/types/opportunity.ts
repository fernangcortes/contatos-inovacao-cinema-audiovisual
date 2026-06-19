export type OpportunityType = 'edital' | 'chamada' | 'evento' | 'noticia';
export type OpportunityStatus = 'aberto' | 'encerrado' | 'em_breve';

export interface Opportunity {
  id: string;
  title: string;
  institutionId: string;
  type: OpportunityType;
  status: OpportunityStatus;
  description: string;
  deadline?: string; // ISO date (YYYY-MM-DD)
  url?: string;
  source: string;
  publishedAt: string; // ISO date (YYYY-MM-DD)
}
