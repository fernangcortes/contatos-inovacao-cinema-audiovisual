import { useState, useMemo, useCallback } from 'react';
import type { Contact, Priority, Category, ContactType } from '@/types/contact';
import { contacts as initialContacts } from '@/data/contacts';
import { useLocalStorage } from './useLocalStorage';

export function useContacts() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts-data', initialContacts);
  const [search, setSearch] = useState('');

  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContactType | 'all'>('all');
  const [baseStatusFilter, setBaseStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedContact = useMemo(
    () => (selectedId ? contacts.find((c) => c.id === selectedId) ?? null : null),
    [contacts, selectedId]
  );

  const [activeTab, setActiveTab] = useState<'meus-dados' | 'contacts' | 'steps' | 'map' | 'opportunities' | 'events' | 'research'>('contacts');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.institution.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchesType = typeFilter === 'all' || c.type === typeFilter;
      const matchesStatus =
        baseStatusFilter === 'all'
          ? true
          : baseStatusFilter === 'completed'
          ? c.completed
          : !c.completed;

      return matchesSearch && matchesPriority && matchesCategory && matchesType && matchesStatus;
    });
  }, [contacts, search, priorityFilter, categoryFilter, typeFilter, baseStatusFilter]);

  const stats = useMemo(() => {
    const total = contacts.length;
    const completed = contacts.filter((c) => c.completed).length;
    const byPriority = {
      '1': contacts.filter((c) => c.priority === '1').length,
      '2': contacts.filter((c) => c.priority === '2').length,
      '3': contacts.filter((c) => c.priority === '3').length,
    };
    const institutions = contacts.filter((c) => c.type === 'instituicao').length;
    const people = contacts.filter((c) => c.type === 'pessoa').length;
    return { total, completed, byPriority, institutions, people };
  }, [contacts]);

  const toggleCompleted = useCallback((id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  }, [setContacts]);

  const openModal = useCallback((contact: Contact) => {
    setSelectedId(contact.id);
  }, []);

  const openModalById = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    contacts: filteredContacts,
    allContacts: contacts,
    stats,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    baseStatusFilter,
    setBaseStatusFilter,
    selectedContact,
    openModal,
    openModalById,
    closeModal,
    toggleCompleted,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    setContacts,
  };
}
