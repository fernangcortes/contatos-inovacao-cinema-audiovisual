import { useState, useMemo } from 'react';
import type { ResearchSource, ResearchSourceType, ResearchSourceScope, ResearchSourceRelevance } from '@/types/researchSource';
import { researchSources as initialSources } from '@/data/researchSources';

export function useResearchSources() {
  const [sources] = useState<ResearchSource[]>(initialSources);
  const [typeFilter, setTypeFilter] = useState<ResearchSourceType | 'all'>('all');
  const [scopeFilter, setScopeFilter] = useState<ResearchSourceScope | 'all'>('all');
  const [relevanceFilter, setRelevanceFilter] = useState<ResearchSourceRelevance | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      const matchesType = typeFilter === 'all' || s.type === typeFilter;
      const matchesScope = scopeFilter === 'all' || s.scope === scopeFilter;
      const matchesRelevance = relevanceFilter === 'all' || s.relevance === relevanceFilter;
      const matchesSearch =
        search === '' ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesType && matchesScope && matchesRelevance && matchesSearch;
    });
  }, [sources, typeFilter, scopeFilter, relevanceFilter, search]);

  const stats = useMemo(() => {
    return {
      total: sources.length,
      alta: sources.filter((s) => s.relevance === 'alta').length,
      media: sources.filter((s) => s.relevance === 'media').length,
      baixa: sources.filter((s) => s.relevance === 'baixa').length,
    };
  }, [sources]);

  return {
    sources: filteredSources,
    stats,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    scopeFilter,
    setScopeFilter,
    relevanceFilter,
    setRelevanceFilter,
  };
}
