import * as React from "react";
import { useState, useEffect } from "react";
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

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[420px] bg-slate-100">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${activeClinic ? encodeURIComponent(activeClinic.name + ', ' + activeClinic.address + ', Cotonou') : mapCenter.lat + ',' + mapCenter.lng}&t=m&z=${mapZoom}&output=embed&iwloc=near`}
      ></iframe>
      
      {/* Petit badge superposé pour faire "pro" */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-slate-200/50 flex items-center gap-2 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-xs font-bold text-slate-700">Explorateur des Cliniques</span>
      </div>
    </div>
  );
}
