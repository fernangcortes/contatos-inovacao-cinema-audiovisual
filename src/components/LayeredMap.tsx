import { useEffect, useMemo, useState } from 'react';
import { useMap, MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import type { LatLngBoundsExpression } from 'leaflet';
import type { Contact } from '@/types/contact';
import type { Event, EventType } from '@/types/event';
import { MapPin, Layers } from 'lucide-react';

type Layer = 'contacts' | 'events';

interface LayeredMapProps {
  contacts: Contact[];
  events: Event[];
  onOpenContact: (contact: Contact) => void;
}

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  city?: string;
  state?: string;
  country?: string;
  color: string;
  layer: Layer;
  contact?: Contact;
}

function BoundsFitter({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [bounds, map]);

  return null;
}

const priorityColors = {
  '1': '#e11d48', // rose-600
  '2': '#f59e0b', // amber-500
  '3': '#0284c7', // sky-600
};

const eventTypeColors: Record<EventType, string> = {
  presencial: '#4f46e5', // indigo-600
  online: '#0ea5e9', // sky-500
  hibrido: '#7c3aed', // violet-600
};

export function LayeredMap({ contacts, events, onOpenContact }: LayeredMapProps) {
  const [activeLayer, setActiveLayer] = useState<Layer>('contacts');

  const contactPoints: MapPoint[] = useMemo(
    () =>
      contacts
        .filter((c): c is Contact & { location: NonNullable<Contact['location']> } => !!c.location)
        .map((c) => ({
          id: c.id,
          lat: c.location.lat,
          lng: c.location.lng,
          title: c.name,
          subtitle: c.institution,
          city: c.location.city,
          state: c.location.state,
          country: c.location.country,
          color: priorityColors[c.priority],
          layer: 'contacts',
          contact: c,
        })),
    [contacts]
  );

  const eventPoints: MapPoint[] = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        lat: e.location.lat,
        lng: e.location.lng,
        title: e.title,
        subtitle: e.subtitle,
        city: e.location.city,
        state: e.location.state,
        country: e.location.country,
        color: eventTypeColors[e.type],
        layer: 'events',
      })),
    [events]
  );

  const points = activeLayer === 'contacts' ? contactPoints : eventPoints;

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (points.length === 0) return null;
    return points.map((p) => [p.lat, p.lng] as [number, number]);
  }, [points]);

  if (contactPoints.length === 0 && eventPoints.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">Nenhuma localização disponível</h3>
        <p className="text-sm text-slate-500 mt-1">
          Os contatos e eventos ainda não possuem coordenadas geográficas cadastradas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
      {/* Layer controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Camada:</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveLayer('contacts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeLayer === 'contacts' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Contatos ({contactPoints.length})
          </button>
          <button
            onClick={() => setActiveLayer('events')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeLayer === 'events' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Eventos ({eventPoints.length})
          </button>
        </div>
      </div>

      <div className="h-[400px] sm:h-[500px] rounded-lg overflow-hidden isolate">
        <MapContainer center={[-14.235, -51.925]} zoom={4} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            zoomToBoundsOnClick={true}
          >
            {points.map((point) => (
              <CircleMarker
                key={point.id}
                center={[point.lat, point.lng]}
                radius={activeLayer === 'contacts' ? 8 : 9}
                pathOptions={{
                  fillColor: point.color,
                  color: '#fff',
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.85,
                }}
                eventHandlers={{
                  click: () => {
                    if (point.contact) {
                      onOpenContact(point.contact);
                    }
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <div className="space-y-1 min-w-[180px]">
                    <h3 className="font-semibold text-sm text-slate-900">{point.title}</h3>
                    {point.subtitle && <p className="text-xs text-slate-600">{point.subtitle}</p>}
                    {point.city && (
                      <p className="text-xs text-slate-500">
                        {point.city}
                        {point.state && `, ${point.state}`}
                        {point.country && ` — ${point.country}`}
                      </p>
                    )}
                    {point.contact && <p className="text-[10px] text-slate-400 mt-1">Clique para ver detalhes</p>}
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
          <BoundsFitter bounds={bounds} />
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 mt-3 text-center">
        {activeLayer === 'contacts'
          ? `${contactPoints.length} de ${contacts.length} contatos possuem localização cadastrada.`
          : `${eventPoints.length} eventos mapeados.`}
      </p>
    </div>
  );
}
