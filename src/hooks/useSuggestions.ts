import { useMemo } from 'react';
import type { SuggestionContact } from '@/components/SuggestContactForm';
import { useLocalStorage } from './useLocalStorage';

export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export interface Suggestion {
  id: string;
  contact: SuggestionContact;
  status: SuggestionStatus;
  submittedAt: string;
}

export function useSuggestions() {
  const [suggestions, setSuggestions] = useLocalStorage<Suggestion[]>('contact-suggestions', []);

  const pendingSuggestions = useMemo(
    () => suggestions.filter((s) => s.status === 'pending'),
    [suggestions]
  );

  const addSuggestion = (contact: SuggestionContact) => {
    const newSuggestion: Suggestion = {
      id: `suggestion-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      contact,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setSuggestions((prev) => [newSuggestion, ...prev]);
    return newSuggestion.id;
  };

  const approveSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' as const } : s))
    );
  };

  const rejectSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s))
    );
  };

  const deleteSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    suggestions,
    pendingSuggestions,
    addSuggestion,
    approveSuggestion,
    rejectSuggestion,
    deleteSuggestion,
  };
}
