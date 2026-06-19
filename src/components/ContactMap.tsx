import { useEffect, useMemo } from 'react';
import { useMap, MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import type { LatLngBoundsExpression } from 'leaflet';
import type { Contact } from '@/types/contact';
import { MapPin } from 'lucide-react';

interface ContactMapProps {
  contacts: Contact[];
  onOpenContact: (contact: Contact) => void;
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

export function ContactMap({ contacts, onOpenContact }: ContactMapProps) {
  const contactsWithLocation = useMemo(
    () => contacts.filter((c): c is Contact & { location: NonNullable<Contact['location']> } => !!c.location),
    [contacts]
  );

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (contactsWithLocation.length === 0) return null;
    return contactsWithLocation.map((c) => [c.location.lat, c.location.lng] as [number, number]);
  }, [contactsWithLocation]);

  if (contactsWithLocation.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">Nenhuma localização disponível</h3>
        <p className="text-sm text-slate-500 mt-1">
          Os contatos ainda não possuem coordenadas geográficas cadastradas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
      <div className="h-[400px] sm:h-[500px] rounded-lg overflow-hidden isolate">
        <MapContainer
          center={[-14.235, -51.925]}
          zoom={4}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
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
            {contactsWithLocation.map((contact) => (
              <CircleMarker
                key={contact.id}
                center={[contact.location.lat, contact.location.lng]}
                radius={8}
                pathOptions={{
                  fillColor: priorityColors[contact.priority],
                  color: '#fff',
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.85,
                }}
                eventHandlers={{
                  click: () => onOpenContact(contact),
                }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <div className="space-y-1 min-w-[180px]">
                    <h3 className="font-semibold text-sm text-slate-900">{contact.name}</h3>
                    <p className="text-xs text-slate-600">{contact.institution}</p>
                    {contact.location.city && (
                      <p className="text-xs text-slate-500">
                        {contact.location.city}
                        {contact.location.state && `, ${contact.location.state}`}
                        {contact.location.country && ` — ${contact.location.country}`}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">Clique para ver detalhes</p>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
          <BoundsFitter bounds={bounds} />
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 mt-3 text-center">
        {contactsWithLocation.length} de {contacts.length} contatos possuem localização cadastrada.
      </p>
    </div>
  );
}
