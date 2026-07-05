import * as React from "react";
import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { MapPin, Phone, Star, Shield, AlertCircle, Clock, Calendar } from "lucide-react";

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  rating: number;
  coordinates: { lat: number; lng: number };
  hours: string;
}

interface ClinicMapProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onSelectClinic: (clinic: Clinic) => void;
  onBookClinic: (clinic: Clinic) => void;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY.length > 10;

export default function ClinicMap({
  clinics,
  selectedClinic,
  onSelectClinic,
  onBookClinic
}: ClinicMapProps) {
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 6.3703, lng: 2.3912 }); // Cotonou Center
  const [mapZoom, setMapZoom] = useState(12);

  // Sync active clinic from props
  useEffect(() => {
    if (selectedClinic) {
      setActiveClinic(selectedClinic);
      setMapCenter(selectedClinic.coordinates);
      setMapZoom(14.5);
    }
  }, [selectedClinic]);

  if (!hasValidKey) {
    return (
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between h-[420px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display uppercase tracking-wider text-amber-400">
                Clé API Google Maps Requise
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                GOOGLE_MAPS_PLATFORM_KEY non détectée
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Pour afficher la <strong>carte réelle de géolocalisation des cliniques MTN Win Health</strong>, veuillez configurer votre clé d'API Google Maps :
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Comment ajouter votre clé :</p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-400">
              <li>
                <a
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  Obtenir une clé API Google Maps
                </a>
              </li>
              <li>
                Cliquez sur le bouton <strong>Settings (⚙️)</strong> dans le coin supérieur droit d'AI Studio.
              </li>
              <li>
                Allez dans l'onglet <strong>Secrets</strong>, puis ajoutez une variable nommée{" "}
                <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                  GOOGLE_MAPS_PLATFORM_KEY
                </code>
                .
              </li>
              <li>Collez votre clé API réelle comme valeur et appuyez sur Entrée.</li>
            </ol>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono text-center border-t border-slate-800 pt-3">
          L'application se reconstruira automatiquement pour activer la carte sans rafraîchir.
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[420px] bg-slate-100">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          center={mapCenter}
          zoom={mapZoom}
          mapId="DEMO_MAP_ID"
          onCenterChanged={(e) => {
            if (e.detail?.center) {
              setMapCenter(e.detail.center);
            }
          }}
          onZoomChanged={(e) => {
            if (typeof e.detail?.zoom === "number") {
              setMapZoom(e.detail.zoom);
            }
          }}
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: "100%", height: "100%" }}
          disableDefaultUI={false}
        >
          {clinics.map((clinic) => (
            <AdvancedMarker
              key={clinic.id}
              position={clinic.coordinates}
              onClick={() => {
                setActiveClinic(clinic);
                onSelectClinic(clinic);
              }}
            >
              <Pin
                background={activeClinic?.id === clinic.id ? "#059669" : "#4f46e5"}
                borderColor={activeClinic?.id === clinic.id ? "#047857" : "#3730a3"}
                glyphColor="#fff"
              />
            </AdvancedMarker>
          ))}

          {activeClinic && (
            <InfoWindow
              position={activeClinic.coordinates}
              onCloseClick={() => setActiveClinic(null)}
            >
              <div className="p-1 min-w-[200px] text-slate-900 font-sans">
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold w-fit mb-1.5">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>Cabinet Certifié</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{activeClinic.name}</h4>
                <p className="text-[10px] text-indigo-600 font-medium">{activeClinic.specialty}</p>

                <div className="mt-2 space-y-1 text-[10px] text-slate-600 border-t border-slate-100 pt-1.5">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                    <span>{activeClinic.address}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                    <span>{activeClinic.phone}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0 text-slate-400" />
                    <span>{activeClinic.hours}</span>
                  </p>
                  <p className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-3 h-3 shrink-0 text-amber-500 fill-amber-500" />
                    <span>{activeClinic.rating} / 5</span>
                  </p>
                </div>

                <button
                  onClick={() => onBookClinic(activeClinic)}
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  Réserver ici
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
