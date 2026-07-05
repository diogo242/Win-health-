import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Heart, Shield, Hash, FileText, AlertTriangle,
  Stethoscope, MapPin, Star, Phone, Clock, ChevronRight,
  CheckCircle2, Loader2, Activity, Droplet, Calendar,
  Lock, Download, Eye, EyeOff, Zap
} from "lucide-react";
import {
  APIProvider, Map, AdvancedMarker, Pin, InfoWindow
} from "@vis.gl/react-google-maps";

// ---- Types ----
export interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  birthDate: string;
}

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  rating: number;
  cost: number;
  coordinates: { lat: number; lng: number };
  hours: string;
  matchScore?: number;
}

interface MedicalRecordProps {
  patient: PatientData;
  sha256: (input: string) => string;
  clinics: Clinic[];
  onBookClinic?: (clinic: Clinic) => void;
}

const MAPS_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasMapKey = Boolean(MAPS_KEY) && MAPS_KEY.length > 10;

// Symptom keyword → specialty matching
const SYMPTOM_MAP: Record<string, string[]> = {
  "coeur":      ["Cardiologie", "Cardiologue"],
  "cardiaque":  ["Cardiologie", "Cardiologue"],
  "palpitation":["Cardiologie", "Cardiologue"],
  "tension":    ["Cardiologie", "Cardiologue"],
  "enfant":     ["Pédiatrie", "Maternité"],
  "bébé":       ["Pédiatrie", "Maternité"],
  "grossesse":  ["Pédiatrie", "Maternité"],
  "fièvre":     ["Médecine Générale"],
  "douleur":    ["Médecine Générale", "Chirurgie"],
  "fatigue":    ["Médecine Générale"],
  "toux":       ["Médecine Générale"],
  "urgence":    ["Urgences", "Hôpital Public Multidisciplinaire"],
  "accident":   ["Urgences", "Hôpital Public Multidisciplinaire"],
};

function matchClinics(symptoms: string, clinics: Clinic[]): Clinic[] {
  const lower = symptoms.toLowerCase();
  const matched = new Map<string, number>();

  Object.entries(SYMPTOM_MAP).forEach(([keyword, specialties]) => {
    if (lower.includes(keyword)) {
      clinics.forEach((c) => {
        const matches = specialties.some(
          (s) => c.specialty.toLowerCase().includes(s.toLowerCase())
        );
        if (matches) {
          matched.set(c.id, (matched.get(c.id) || 0) + 2);
        }
      });
    }
  });

  return clinics
    .map((c) => ({ ...c, matchScore: matched.get(c.id) || 0 }))
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}

function HashBadge({ label, value }: { label: string; value: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 bg-slate-950 rounded-xl px-4 py-2.5 border border-slate-800">
      <div className="flex items-center gap-2 min-w-0">
        <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="text-[11px] text-slate-400 font-mono shrink-0">{label}</span>
        <span
          className="text-[10px] font-mono text-emerald-300 truncate"
          title={value}
        >
          {visible ? value : value.substring(0, 16) + "…"}
        </span>
      </div>
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 cursor-pointer"
        title={visible ? "Masquer" : "Afficher le hash complet"}
      >
        {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function MedicalRecord({
  patient,
  sha256,
  clinics,
  onBookClinic,
}: MedicalRecordProps) {
  const [symptoms, setSymptoms] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Clinic[] | null>(null);
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 6.3703, lng: 2.3912 });
  const [mapZoom, setMapZoom] = useState(12);
  const [aiSummary, setAiSummary] = useState("");

  const age = patient.birthDate
    ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
    : "—";

  // SHA-256 hashes of sensitive data
  const hashEmail   = sha256(patient.email);
  const hashPhone   = sha256(patient.phone);
  const hashBlood   = sha256(patient.bloodGroup + patient.birthDate);
  const hashProfile = sha256(patient.firstName + patient.lastName + patient.email);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setAnalyzing(true);
    setRecommendations(null);
    setAiSummary("");
    setActiveClinic(null);

    // Simulate a brief AI analysis delay then match clinics
    await new Promise((r) => setTimeout(r, 1400));

    const ranked = matchClinics(symptoms, clinics);
    setRecommendations(ranked);

    // Generate a brief summary
    const top = ranked.filter((c) => (c.matchScore ?? 0) > 0);
    if (top.length > 0) {
      setAiSummary(
        `Sur la base de vos symptômes, ${top.length} établissement${top.length > 1 ? "s" : ""} vous sont recommandé${top.length > 1 ? "s" : ""}. **${top[0].name}** (${top[0].specialty}) est le plus adapté à votre situation.`
      );
      setMapCenter(top[0].coordinates);
      setMapZoom(13);
      setActiveClinic(top[0]);
    } else {
      setAiSummary(
        "Aucun symptôme spécifique détecté. Voici tous les établissements disponibles à Cotonou."
      );
    }

    setAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ── Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 text-white shadow-xl border border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.12),_transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                Dossier Médical Sécurisé
              </span>
              <span className="text-[10px] text-slate-400 font-mono">HDS-SHA256</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {age} ans · Groupe sanguin{" "}
              <span className="text-emerald-400 font-bold">{patient.bloodGroup}</span> ·{" "}
              {patient.email}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 shrink-0">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Données certifiées</span>
          </div>
        </div>
      </div>

      {/* ── Two columns: Identity + Hashes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Identity Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Informations Patient
          </h3>
          {[
            { label: "Prénom & Nom", value: `${patient.firstName} ${patient.lastName}`, icon: <User className="w-3.5 h-3.5 text-slate-400" /> },
            { label: "Date de naissance", value: patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("fr-FR") : "—", icon: <Calendar className="w-3.5 h-3.5 text-slate-400" /> },
            { label: "Téléphone", value: patient.phone, icon: <Phone className="w-3.5 h-3.5 text-slate-400" /> },
            { label: "Email", value: patient.email, icon: <Heart className="w-3.5 h-3.5 text-slate-400" /> },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
              {row.icon}
              <span className="text-xs text-slate-500 w-32 shrink-0">{row.label}</span>
              <span className="text-xs font-semibold text-slate-800 truncate">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 py-2">
            <Droplet className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs text-slate-500 w-32 shrink-0">Groupe sanguin</span>
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
              {patient.bloodGroup}
            </span>
          </div>
        </div>

        {/* SHA-256 Hashes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Données Hashées SHA-256 (HDS)
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Toutes les données sensibles sont chiffrées en SHA-256 avant stockage. Aucune donnée en clair n'est conservée sur nos serveurs.
          </p>
          <div className="space-y-2">
            <HashBadge label="Email" value={hashEmail} />
            <HashBadge label="Téléphone" value={hashPhone} />
            <HashBadge label="Groupe/DOB" value={hashBlood} />
            <HashBadge label="Profil" value={hashProfile} />
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[10px] text-emerald-300 font-mono">
              Conforme RGPD & Hébergement Données de Santé (HDS)
            </span>
          </div>
        </div>
      </div>

      {/* ── Symptom Form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-rose-500" />
          Décrire vos symptômes — Recommandation d'établissements
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Ex: douleur thoracique, palpitations, fièvre depuis 2 jours, urgence, mal de ventre enfant..."
            rows={3}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-400 transition-all"
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !symptoms.trim()}
            className="sm:w-48 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyser & Recommander
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      <AnimatePresence>
        {recommendations && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* AI Summary */}
            {aiSummary && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-800 mb-1">Recommandation IA — Coach Clinique Win Health</p>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    {aiSummary.split("**").map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Map + List side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

              {/* Clinic List */}
              <div className="xl:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Établissements recommandés
                </h4>
                {recommendations.map((clinic, idx) => (
                  <motion.div
                    key={clinic.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => {
                      setActiveClinic(clinic);
                      setMapCenter(clinic.coordinates);
                      setMapZoom(15);
                    }}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      activeClinic?.id === clinic.id
                        ? "bg-emerald-50 border-emerald-300 shadow-md shadow-emerald-100"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {(clinic.matchScore ?? 0) > 0 && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-200">
                              Recommandé
                            </span>
                          )}
                          {idx === 0 && (clinic.matchScore ?? 0) > 0 && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                              ★ Premier choix
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{clinic.name}</p>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">{clinic.specialty}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {clinic.address.split(",")[0]}
                          </span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {clinic.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {clinic.hours}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {clinic.phone}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 mt-1 shrink-0 transition-colors ${activeClinic?.id === clinic.id ? "text-emerald-500" : "text-slate-300"}`} />
                    </div>
                    {onBookClinic && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookClinic(clinic);
                        }}
                        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        Réserver une consultation
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Map */}
              <div className="xl:col-span-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Géolocalisation — Cotonou, Bénin
                </h4>
                {hasMapKey ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[480px]">
                    <APIProvider apiKey={MAPS_KEY} version="weekly">
                      <Map
                        center={mapCenter}
                        zoom={mapZoom}
                        mapId="WIN_HEALTH_DOSSIER"
                        onCenterChanged={(e) => e.detail?.center && setMapCenter(e.detail.center)}
                        onZoomChanged={(e) => typeof e.detail?.zoom === "number" && setMapZoom(e.detail.zoom)}
                        style={{ width: "100%", height: "100%" }}
                        internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                      >
                        {recommendations.map((clinic) => (
                          <AdvancedMarker
                            key={clinic.id}
                            position={clinic.coordinates}
                            onClick={() => {
                              setActiveClinic(clinic);
                              setMapCenter(clinic.coordinates);
                              setMapZoom(15);
                            }}
                          >
                            <Pin
                              background={
                                activeClinic?.id === clinic.id
                                  ? "#059669"
                                  : (clinic.matchScore ?? 0) > 0
                                  ? "#f59e0b"
                                  : "#6366f1"
                              }
                              borderColor={
                                activeClinic?.id === clinic.id ? "#047857"
                                  : (clinic.matchScore ?? 0) > 0 ? "#d97706"
                                  : "#4338ca"
                              }
                              glyphColor="#fff"
                            />
                          </AdvancedMarker>
                        ))}

                        {activeClinic && (
                          <InfoWindow
                            position={activeClinic.coordinates}
                            onCloseClick={() => setActiveClinic(null)}
                          >
                            <div className="p-1.5 min-w-[220px] font-sans text-slate-900">
                              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold w-fit mb-1.5 border border-emerald-200">
                                <Shield className="w-3 h-3" />
                                Cabinet Certifié Win Health
                              </div>
                              <p className="text-xs font-bold">{activeClinic.name}</p>
                              <p className="text-[10px] text-indigo-600 font-medium">{activeClinic.specialty}</p>
                              <div className="mt-2 space-y-1 text-[10px] text-slate-500 border-t border-slate-100 pt-1.5">
                                <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activeClinic.address}</p>
                                <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{activeClinic.phone}</p>
                                <p className="flex items-center gap-1"><Clock className="w-3 h-3" />{activeClinic.hours}</p>
                                <p className="flex items-center gap-1 text-amber-600 font-semibold">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />{activeClinic.rating} / 5
                                </p>
                              </div>
                              {onBookClinic && (
                                <button
                                  onClick={() => onBookClinic(activeClinic)}
                                  className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Calendar className="w-3 h-3" />
                                  Réserver ici
                                </button>
                              )}
                            </div>
                          </InfoWindow>
                        )}
                      </Map>
                    </APIProvider>
                  </div>
                ) : (
                  /* Fallback without API key — static beautiful card */
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 h-[480px] flex flex-col items-center justify-center gap-4 text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                      <MapPin className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 mb-1">Carte Google Maps</p>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                        Ajoutez la variable <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">GOOGLE_MAPS_PLATFORM_KEY</code> dans vos secrets pour afficher la carte réelle des cliniques.
                      </p>
                    </div>
                    <div className="space-y-2 w-full max-w-xs">
                      {recommendations.slice(0, 3).map((c) => (
                        <div key={c.id} className="bg-white rounded-xl border border-slate-200 px-4 py-2 text-left">
                          <p className="text-xs font-bold text-slate-800">{c.name}</p>
                          <p className="text-[11px] text-slate-500">{c.address}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{c.rating} · {c.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
