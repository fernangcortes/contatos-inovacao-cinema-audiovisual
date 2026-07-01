export type EventType = 'presencial' | 'online' | 'hibrido';

export type EventStatus = 'confirmado' | 'em_definicao' | 'cancelado' | 'encerrado';

export type EventScope = 'brasil' | 'global' | 'regional';

export interface EventLocation {
  lat: number;
  lng: number;
  city: string;
  state?: string;
  country: string;
  venue?: string;
  address?: string;
}

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  type: EventType;
  status: EventStatus;
  scope: EventScope;
  description: string;
  startDate: string;
  endDate?: string;
  location: EventLocation;
  institutionId?: string;
  opportunityIds?: string[];
  website?: string;
  registrationUrl?: string;
  source: string;
  sourceUrl?: string;
  tags: string[];
  publishedAt?: string;
  lastVerifiedAt?: string;
  verificationNotes?: string;
}
