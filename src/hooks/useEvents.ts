import { useState, useMemo } from 'react';
import type { Event, EventType, EventStatus, EventScope } from '@/types/event';
import { events as initialEvents } from '@/data/events';

const statusOrder: Record<EventStatus, number> = {
  confirmado: 0,
  em_definicao: 1,
  encerrado: 2,
  cancelado: 3,
};

export function useEvents() {
  const [events] = useState<Event[]>(initialEvents);
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [scopeFilter, setScopeFilter] = useState<EventScope | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        const matchesType = typeFilter === 'all' || e.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        const matchesScope = scopeFilter === 'all' || e.scope === scopeFilter;
        const matchesSearch =
          search === '' ||
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase()) ||
          e.location.city.toLowerCase().includes(search.toLowerCase()) ||
          e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchesType && matchesStatus && matchesScope && matchesSearch;
      })
      .sort((a, b) => {
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [events, typeFilter, statusFilter, scopeFilter, search]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      confirmado: events.filter((e) => e.status === 'confirmado').length,
      emDefinicao: events.filter((e) => e.status === 'em_definicao').length,
      encerrado: events.filter((e) => e.status === 'encerrado').length,
      presencial: events.filter((e) => e.type === 'presencial').length,
      online: events.filter((e) => e.type === 'online').length,
      hibrido: events.filter((e) => e.type === 'hibrido').length,
    };
  }, [events]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return {
    events: filteredEvents,
    stats,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    scopeFilter,
    setScopeFilter,
    formatDate,
  };
}
