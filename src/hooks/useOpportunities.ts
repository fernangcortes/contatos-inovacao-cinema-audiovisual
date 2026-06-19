import { useState, useMemo, useCallback } from 'react';
import type { Opportunity, OpportunityType, OpportunityStatus } from '@/types/opportunity';
import { opportunities as initialOpportunities } from '@/data/opportunities';

const statusOrder: Record<OpportunityStatus, number> = {
  aberto: 0,
  em_breve: 1,
  encerrado: 2,
};

export function useOpportunities() {
  const [opportunities] = useState<Opportunity[]>(initialOpportunities);
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((o) => {
        const matchesType = typeFilter === 'all' || o.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        const matchesSearch =
          search === '' ||
          o.title.toLowerCase().includes(search.toLowerCase()) ||
          o.description.toLowerCase().includes(search.toLowerCase()) ||
          o.source.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;
        if (a.deadline && b.deadline) {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [opportunities, typeFilter, statusFilter, search]);

  const stats = useMemo(() => {
    return {
      total: opportunities.length,
      aberto: opportunities.filter((o) => o.status === 'aberto').length,
      emBreve: opportunities.filter((o) => o.status === 'em_breve').length,
      encerrado: opportunities.filter((o) => o.status === 'encerrado').length,
    };
  }, [opportunities]);

  const formatDate = useCallback((date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  return {
    opportunities: filteredOpportunities,
    stats,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    formatDate,
  };
}
