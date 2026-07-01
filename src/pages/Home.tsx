import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useContacts } from '@/hooks/useContacts';
import { StatsHeader } from '@/components/StatsHeader';
import { FilterBar } from '@/components/FilterBar';
import { ContactCard } from '@/components/ContactCard';
import { ContactListItem } from '@/components/ContactListItem';
import { ContactModal } from '@/components/ContactModal';
import { UserProfileForm } from '@/components/UserProfileForm';
import { StepsGuide } from '@/components/StepsGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { Film, Users, ListChecks, MapPin, Megaphone, Shield, PlusCircle, UserCircle, CalendarDays, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_TEMPLATE_VALUES, type TemplateValues } from '@/lib/utils';
import { SuggestContactForm } from '@/components/SuggestContactForm';
import { useSuggestions } from '@/hooks/useSuggestions';
import { LayeredMap } from '@/components/LayeredMap';
import { OpportunitiesList } from '@/components/OpportunitiesList';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useEvents } from '@/hooks/useEvents';
import { useResearchSources } from '@/hooks/useResearchSources';
import { EventsList } from '@/components/EventsList';
import { ResearchSourcesList } from '@/components/ResearchSourcesList';
import type { Contact } from '@/types/contact';

export function Home() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const {
    contacts,
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
    openModalById,
    closeModal,
    toggleCompleted,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
  } = useContacts();

  const {
    opportunities,
    search: opportunitySearch,
    setSearch: setOpportunitySearch,
    typeFilter: opportunityTypeFilter,
    setTypeFilter: setOpportunityTypeFilter,
    statusFilter: opportunityStatusFilter,
    setStatusFilter: setOpportunityStatusFilter,
    formatDate,
  } = useOpportunities();

  const {
    events,
    search: eventSearch,
    setSearch: setEventSearch,
    typeFilter: eventTypeFilter,
    setTypeFilter: setEventTypeFilter,
    statusFilter: eventStatusFilter,
    setStatusFilter: setEventStatusFilter,
    scopeFilter: eventScopeFilter,
    setScopeFilter: setEventScopeFilter,
    formatDate: formatEventDate,
  } = useEvents();

  const {
    sources,
    search: sourceSearch,
    setSearch: setSourceSearch,
    typeFilter: sourceTypeFilter,
    setTypeFilter: setSourceTypeFilter,
    scopeFilter: sourceScopeFilter,
    setScopeFilter: setSourceScopeFilter,
    relevanceFilter: sourceRelevanceFilter,
    setRelevanceFilter: setSourceRelevanceFilter,
  } = useResearchSources();

  const { addSuggestion } = useSuggestions();
  const [suggestOpen, setSuggestOpen] = useState(false);

  const [templateValues, setTemplateValues] = useState<TemplateValues>(() => {
    if (typeof window === 'undefined') return DEFAULT_TEMPLATE_VALUES;
    try {
      return { ...DEFAULT_TEMPLATE_VALUES, ...JSON.parse(localStorage.getItem('contact-template-values') || '{}') };
    } catch {
      return DEFAULT_TEMPLATE_VALUES;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('contact-template-values', JSON.stringify(templateValues));
  }, [templateValues]);

  useEffect(() => {
    if (id) {
      openModalById(id);
    }
  }, [id, openModalById]);

  const handleCloseModal = () => {
    closeModal();
    if (id) {
      navigate('/', { replace: true });
    }
  };

  const handleOpenContact = useCallback(
    (contact: Contact) => navigate(`/contato/${contact.id}`),
    [navigate]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-rose-500" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Contatos — Inovação em Cinema e Audiovisual
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700"
                onClick={() => setSuggestOpen(true)}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Sugerir contato
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => navigate('/admin')}
                title="Painel administrativo"
              >
                <Shield className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            40+ instituições e profissionais estratégicos para apresentar seus aplicativos e projetos tecnológicos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsHeader
          stats={stats}
          activeStatusFilter={
            baseStatusFilter === 'all' ? 'total' :
            baseStatusFilter === 'completed' ? 'completed' :
            baseStatusFilter === 'pending' ? 'pending' : undefined
          }
          activeDetailFilter={
            priorityFilter !== 'all' ? `priority-${priorityFilter}` as const :
            typeFilter === 'instituicao' ? 'institutions' :
            typeFilter === 'pessoa' ? 'people' : null
          }
          onFilterTotal={() => {
            setSearch('');
            setPriorityFilter('all');
            setCategoryFilter('all');
            setTypeFilter('all');
            setBaseStatusFilter('all');
          }}
          onFilterCompleted={() => {
            setSearch('');
            setPriorityFilter('all');
            setCategoryFilter('all');
            setTypeFilter('all');
            setBaseStatusFilter('completed');
          }}
          onFilterPriority={(priority) => {
            setPriorityFilter(priority);
            setCategoryFilter('all');
            setTypeFilter('all');
          }}
          onFilterInstitutions={() => {
            setPriorityFilter('all');
            setCategoryFilter('all');
            setTypeFilter('instituicao');
          }}
          onFilterPeople={() => {
            setPriorityFilter('all');
            setCategoryFilter('all');
            setTypeFilter('pessoa');
          }}
          onFilterPending={() => {
            setSearch('');
            setPriorityFilter('all');
            setCategoryFilter('all');
            setTypeFilter('all');
            setBaseStatusFilter('pending');
          }}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'meus-dados' | 'contacts' | 'steps' | 'map' | 'opportunities' | 'events' | 'research')} className="space-y-4">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger
              value="meus-dados"
              className="text-sm data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700"
            >
              <UserCircle className="w-4 h-4 mr-1" />
              Meus dados
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-700"
            >
              <Users className="w-4 h-4 mr-1" />
              Contatos ({contacts.length})
            </TabsTrigger>
            <TabsTrigger
              value="steps"
              className="text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <ListChecks className="w-4 h-4 mr-1" />
              Passo a Passo
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="text-sm data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Mapa
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className="text-sm data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700"
            >
              <Megaphone className="w-4 h-4 mr-1" />
              Editais e Chamadas
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="text-sm data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700"
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              Eventos
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Fontes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meus-dados" className="space-y-4">
            <UserProfileForm
              templateValues={templateValues}
              setTemplateValues={setTemplateValues}
            />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            {/* Filters */}
            <FilterBar
              search={search}
              setSearch={setSearch}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              statusFilter={baseStatusFilter}
              setStatusFilter={setBaseStatusFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Contact List */}
            {contacts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onOpen={(c) => navigate(`/contato/${c.id}`)}
                      onToggle={toggleCompleted}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <ContactListItem
                      key={contact.id}
                      contact={contact}
                      onOpen={(c) => navigate(`/contato/${c.id}`)}
                      onToggle={toggleCompleted}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-700">Nenhum contato encontrado</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Tente ajustar os filtros ou buscar por outro termo.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="steps">
            <StepsGuide />
          </TabsContent>

          <TabsContent value="map">
            <LayeredMap contacts={contacts} events={events} onOpenContact={handleOpenContact} />
          </TabsContent>

          <TabsContent value="opportunities">
            <OpportunitiesList
              opportunities={opportunities}
              search={opportunitySearch}
              setSearch={setOpportunitySearch}
              typeFilter={opportunityTypeFilter}
              setTypeFilter={setOpportunityTypeFilter}
              statusFilter={opportunityStatusFilter}
              setStatusFilter={setOpportunityStatusFilter}
              formatDate={formatDate}
              onOpenContact={(id) => navigate(`/contato/${id}`)}
            />
          </TabsContent>

          <TabsContent value="events">
            <EventsList
              events={events}
              search={eventSearch}
              setSearch={setEventSearch}
              typeFilter={eventTypeFilter}
              setTypeFilter={setEventTypeFilter}
              statusFilter={eventStatusFilter}
              setStatusFilter={setEventStatusFilter}
              scopeFilter={eventScopeFilter}
              setScopeFilter={setEventScopeFilter}
              formatDate={formatEventDate}
              onOpenContact={(id) => id && navigate(`/contato/${id}`)}
            />
          </TabsContent>

          <TabsContent value="research">
            <ResearchSourcesList
              sources={sources}
              search={sourceSearch}
              setSearch={setSourceSearch}
              typeFilter={sourceTypeFilter}
              setTypeFilter={setSourceTypeFilter}
              scopeFilter={sourceScopeFilter}
              setScopeFilter={setSourceScopeFilter}
              relevanceFilter={sourceRelevanceFilter}
              setRelevanceFilter={setSourceRelevanceFilter}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 text-xs text-center py-4 mt-8">
        Documento compilado em junho de 2026. Verifique sites oficiais para dados atualizados antes de contatar.
      </footer>

      {/* Modal */}
      <ContactModal
        contact={selectedContact}
        onClose={handleCloseModal}
        onToggle={toggleCompleted}
        templateValues={templateValues}
      />

      {/* Suggest Form */}
      <SuggestContactForm
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        onSubmit={addSuggestion}
      />
    </div>
  );
}
