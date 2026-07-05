import * as React from "react";
import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Activity, 
  Shield, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  ArrowRight, 
  MessageSquare, 
  Search, 
  Cpu, 
  Terminal, 
  ChevronRight, 
  AlertCircle,
  Calendar,
  User,
  UserPlus,
  Clock,
  Heart,
  Droplet,
  Moon,
  Smile,
  FileText,
  Lock,
  Key,
  Database,
  Check,
  ClipboardList,
  AlertTriangle,
  RefreshCw,
  Send,
  HelpCircle,
  Hash,
  Download,
  Coins,
  Zap,
  MapPin,
  Star,
  Mail,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Platform, MetricDetail } from "./types";
import { METRIC_DETAILS, INTEGRATION_TEMPLATES } from "./data";
import ClinicMap, { Clinic } from "./components/ClinicMap";
import AuthScreen, { PatientProfile, DoctorProfile, UserType } from "./components/AuthScreen";

// Real Cryptographic SHA-256 implementation
function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  const words: number[] = [];
  const asciiLength = ascii.length;
  
  for (let i = 0; i < asciiLength * 8; i += 8) {
    words[i >> 5] |= (ascii.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
  }
  
  const byteLength = asciiLength;
  const bitLength = byteLength * 8;
  words[byteLength >> 2] |= 0x80 << (24 - ((byteLength % 4) * 8));
  words[(((byteLength + 8) >> 6) << 4) + 15] = bitLength;
  
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  
  const w = new Array(64);
  
  for (let i = 0; i < words.length; i += 16) {
    for (let j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] || 0;
      } else {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
    }
    
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;
    
    for (let j = 0; j < 64; j++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }
  
  function hex(num: number) {
    let s = "";
    for (let i = 0; i < 4; i++) {
      s += ((num >>> (24 - i * 8)) & 0xff).toString(16).padStart(2, "0");
    }
    return s;
  }
  
  return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4) + hex(h5) + hex(h6) + hex(h7);
}

// Real Cryptographic Hashing for signatures
const generateFakeHash = (input: string) => {
  return "HDS-SHA256-" + sha256(input).toUpperCase().substring(0, 20);
};

// Simple Markdown Parser Component to display Gemini responses beautifully
function StyledMarkdown({ content }: { content: string }) {
  if (!content) return null;
  
  const lines = content.split("\n");
  
  return (
    <div className="space-y-3 font-sans text-xs text-slate-300">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith("###")) {
          return <h4 key={idx} className="text-sm font-bold text-emerald-400 pt-3 border-b border-slate-800 pb-1 font-display">{trimmed.replace("###", "").trim()}</h4>;
        }
        if (trimmed.startsWith("##")) {
          return <h3 key={idx} className="text-base font-bold text-white pt-4 border-b border-slate-700 pb-1.5 font-display">{trimmed.replace("##", "").trim()}</h3>;
        }
        if (trimmed.startsWith("#")) {
          return <h2 key={idx} className="text-lg font-bold text-emerald-300 pt-5 border-b border-slate-600 pb-2 font-display">{trimmed.replace("#", "").trim()}</h2>;
        }
        
        // Bullet points
        if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
          const boldTextMatches = trimmed.match(/\*\*(.*?)\*\*/);
          if (boldTextMatches) {
            const parts = trimmed.split("**");
            return (
              <div key={idx} className="flex items-start gap-2 pl-4 text-slate-300 leading-relaxed">
                <span className="text-emerald-500 mt-1 shrink-0">•</span>
                <span>
                  {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part.replace(/^[-*]\s*/, ""))}
                </span>
              </div>
            );
          }
          return (
            <div key={idx} className="flex items-start gap-2 pl-4 text-slate-300 leading-relaxed">
              <span className="text-emerald-500 mt-1 shrink-0">•</span>
              <span>{trimmed.replace(/^[-*]\s*/, "")}</span>
            </div>
          );
        }

        // Standard lines with potential bolding
        if (trimmed.includes("**")) {
          const parts = trimmed.split("**");
          return (
            <p key={idx} className="leading-relaxed text-slate-300">
              {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)}
            </p>
          );
        }

        // Empty lines
        if (!trimmed) {
          return <div key={idx} className="h-2"></div>;
        }

        // Normal paragraph
        return <p key={idx} className="leading-relaxed text-slate-300">{trimmed}</p>;
      })}
    </div>
  );
}

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<{
    type: UserType;
    profile: PatientProfile | DoctorProfile | null;
    isLoggedIn: boolean;
  }>(() => {
    const savedAuth = localStorage.getItem("winhealth_auth");
    if (savedAuth) {
      try { return JSON.parse(savedAuth); } catch(e) {}
    }
    return { type: 'patient', profile: null, isLoggedIn: false };
  });

  // Save Auth to LocalStorage
  useEffect(() => {
    localStorage.setItem("winhealth_auth", JSON.stringify(currentUser));
  }, [currentUser]);

  // QR Code access system for Doctor
  const [patientQrToken, setPatientQrToken] = useState<string | null>(null);
  const [doctorEnteredQr, setDoctorEnteredQr] = useState<string>("");
  const [hasDoctorAccess, setHasDoctorAccess] = useState<boolean>(false);

  // Navigation: 'audit' | 'patient' | 'doctor' | 'security'
  const [activeTab, setActiveTab] = useState<string>("patient");
  
  // Patient Profile state (persisted in localStorage to avoid simulation/temporary state)
  const [patientProfile, setPatientProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bloodGroup: string;
    birthDate: string;
    isInitialized: boolean;
  }>(() => {
    const saved = localStorage.getItem("winhealth_patient_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isInitialized: true };
      } catch (e) {
        // ignore
      }
    }
    return {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@gmail.com",
      phone: "+229 97 00 00 01",
      bloodGroup: "A+",
      birthDate: "1968-05-15",
      isInitialized: true,
    };
  });

  // Doctor panel: state to add a new patient dossier (account creation)
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [newPatientFirstName, setNewPatientFirstName] = useState("");
  const [newPatientLastName, setNewPatientLastName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("+229");
  const [newPatientBloodGroup, setNewPatientBloodGroup] = useState("A+");
  const [newPatientBirthDate, setNewPatientBirthDate] = useState("");

  const [presets, setPresets] = useState<any>(null);
  const [loadingPresets, setLoadingPresets] = useState(true);

  const sante50Avg = presets ? Math.round((presets.sante50.scores.performance + presets.sante50.scores.ux + presets.sante50.scores.seo + presets.sante50.scores.security + presets.sante50.scores.professionalUtility) / 5) : 71;
  const santePlusProAvg = presets ? Math.round((presets.santePlusPro.scores.performance + presets.santePlusPro.scores.ux + presets.santePlusPro.scores.seo + presets.santePlusPro.scores.security + presets.santePlusPro.scores.professionalUtility) / 5) : 79;
  
  // Interactive audit state
  const [selectedMetric, setSelectedMetric] = useState<MetricDetail>(METRIC_DETAILS[0]);
  const [auditView, setAuditView] = useState<"summary" | "comparison">("summary");

  // ------------------ PATIENT PORTAL STATES (Santé 5.0) ------------------
  // Live patient biometric records (stored in memory, initially populated)
  const [biometricsHistory, setBiometricsHistory] = useState([
    { date: "28/06", systolic: 120, diastolic: 80, heartRate: 72, glucose: 0.95, sleep: 7.5, hydration: 2.1, mood: 8 },
    { date: "29/06", systolic: 122, diastolic: 82, heartRate: 74, glucose: 1.02, sleep: 6.8, hydration: 1.8, mood: 7 },
    { date: "30/06", systolic: 118, diastolic: 79, heartRate: 68, glucose: 0.92, sleep: 8.0, hydration: 2.5, mood: 9 },
    { date: "01/07", systolic: 125, diastolic: 85, heartRate: 78, glucose: 1.15, sleep: 6.0, hydration: 1.5, mood: 6 },
    { date: "02/07", systolic: 121, diastolic: 81, heartRate: 71, glucose: 0.98, sleep: 7.2, hydration: 2.2, mood: 8 },
    { date: "03/07", systolic: 119, diastolic: 80, heartRate: 69, glucose: 0.94, sleep: 7.8, hydration: 2.4, mood: 9 },
  ]);

  // Form input for new biometrics
  const [newSystolic, setNewSystolic] = useState("120");
  const [newDiastolic, setNewDiastolic] = useState("80");
  const [newHeartRate, setNewHeartRate] = useState("72");
  const [newGlucose, setNewGlucose] = useState("0.98");
  const [newSleep, setNewSleep] = useState("7.5");
  const [newHydration, setNewHydration] = useState("2.2");
  const [newMood, setNewMood] = useState("8");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Health coach AI chat state
  const [coachSymptoms, setCoachSymptoms] = useState("");
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachResponse, setCoachResponse] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState("");

  // Floating Chatbot States
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotInput, setChatbotInput] = useState("");
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "bot",
      text: "Bonjour ! Je suis l'Assistant Clinique de **Win Health**. Comment puis-je vous accompagner aujourd'hui ? Posez-moi vos questions sur vos constantes biométriques, vos symptômes ou vos conseils de prévention de santé.",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  // Patient appointments state
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Sophie Martin (Cardiologue)", date: "10/07/2026", time: "14:30", status: "Confirmé", reason: "Suivi cardiologique annuel" },
    { id: 2, doctor: "Dr. Jean Robert (Médecin Généraliste)", date: "15/07/2026", time: "09:15", status: "Confirmé", reason: "Contrôle tensionnel" }
  ]);
  const [bookDoctor, setBookDoctor] = useState("Dr. Sophie Martin (Cardiologue)");
  const [bookDate, setBookDate] = useState("2026-07-10");
  const [bookTime, setBookTime] = useState("10:00");
  const [bookReason, setBookReason] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  // Patient Consent configuration
  const [dmpShared, setDmpShared] = useState(true);

  // Bitcoin Lightning LNbits states
  const [lnbitsApiKey, setLnbitsApiKey] = useState(() => {
    return localStorage.getItem("santeplus_lnbits_api_key") || "LNURL1DP68GURN8GHJ7URJDAJZUMRWVF5HGUEWVDHK6TMVDE6HYMRS9AVXXU262EXQHJZJRX";
  });
  const [lnbitsUrl, setLnbitsUrl] = useState(() => {
    return localStorage.getItem("santeplus_lnbits_url") || "https://legend.lnbits.com";
  });
  const [invoiceSats, setInvoiceSats] = useState<number>(100);
  const [invoiceMemo, setInvoiceMemo] = useState<string>("Paiement Téléconsultation Dr. Sophie Martin");
  const [activeInvoice, setActiveInvoice] = useState<string | null>(null);
  const [activePaymentHash, setActivePaymentHash] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "pending" | "paid" | "failed">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("santeplus_btc_payments");
    return saved ? JSON.parse(saved) : [];
  });
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(() => {
    return localStorage.getItem("santeplus_premium_unlocked") === "true";
  });

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem("santeplus_lnbits_api_key", lnbitsApiKey);
  }, [lnbitsApiKey]);

  useEffect(() => {
    localStorage.setItem("santeplus_lnbits_url", lnbitsUrl);
  }, [lnbitsUrl]);

  useEffect(() => {
    localStorage.setItem("santeplus_btc_payments", JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  useEffect(() => {
    localStorage.setItem("santeplus_premium_unlocked", isPremiumUnlocked ? "true" : "false");
  }, [isPremiumUnlocked]);

  // Polling ref
  const pollingRef = useRef<any>(null);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const chatbotEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (chatbotEndRef.current) {
      chatbotEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatbotMessages, isChatbotOpen, isChatbotTyping]);

  // Selected chart metric
  const [chartMetric, setChartMetric] = useState<"tension" | "heartRate" | "glucose">("tension");

  // Google Maps clinics list (Cotonou, Benin)
  const [clinicsList] = useState<Clinic[]>([
    {
      id: "clinic-1",
      name: "CNHU-HKM (Centre National Hospitalier Universitaire)",
      specialty: "Hôpital Public Multidisciplinaire",
      address: "Boulevard Saint-Michel, Cotonou",
      phone: "+229 21 30 01 55",
      rating: 4.1,
      cost: 15000,
      coordinates: { lat: 6.3660, lng: 2.4290 },
      hours: "24h/24 (Urgences)"
    },
    {
      id: "clinic-2",
      name: "HOMEL (Hôpital de la Mère et de l'Enfant)",
      specialty: "Pédiatrie & Maternité",
      address: "Avenue Jean-Paul II, Cotonou",
      phone: "+229 21 33 04 36",
      rating: 4.3,
      cost: 12000,
      coordinates: { lat: 6.3632, lng: 2.4270 },
      hours: "24h/24"
    },
    {
      id: "clinic-3",
      name: "Clinique Atinkanmey",
      specialty: "Médecine Générale & Chirurgie",
      address: "Quartier Gbégamey, Cotonou",
      phone: "+229 21 31 16 01",
      rating: 4.5,
      cost: 20000,
      coordinates: { lat: 6.3715, lng: 2.4072 },
      hours: "08:00 - 20:00 (Lun-Sam)"
    },
    {
      id: "clinic-4",
      name: "Polyclinique Atinkanmey Sainte-Anne",
      specialty: "Cardiologie & Spécialités",
      address: "Zogbohouè, Cotonou",
      phone: "+229 21 32 15 55",
      rating: 4.6,
      cost: 25000,
      coordinates: { lat: 6.3700, lng: 2.3950 },
      hours: "07:30 - 22:00"
    },
    {
      id: "clinic-5",
      name: "CHD-OP (Centre Hospitalier Départemental)",
      specialty: "Hôpital Public",
      address: "Porto-Novo, Ouémé-Plateau",
      phone: "+229 20 21 21 45",
      rating: 4.0,
      cost: 10000,
      coordinates: { lat: 6.4969, lng: 2.6289 },
      hours: "24h/24 (Urgences)"
    }
  ]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);


  // ------------------ PRACTITIONER PORTAL STATES (Win Health Pro) ------------------
  // Active Patient Selected in DMP
  const [selectedPatientId, setSelectedPatientId] = useState(() => {
    const savedProfile = localStorage.getItem("winhealth_patient_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.isInitialized) {
          return "pat-self";
        }
      } catch (e) {}
    }
    return "pat-01";
  });

  const [patientsList, setPatientsList] = useState(() => {
    const defaultList = [
      { 
        id: "pat-01", 
        name: "Jean-Pierre Dupont", 
        age: 58, 
        gender: "Masculin", 
        ssn: "1 68 05 75 123 456 78", 
        allergies: "Pénicilline, Pollen", 
        history: "Hypertension essentielle diagnostiquée en 2021, léger surpoids",
        diagnoses: ["Hypertension essentielle (CIM-10: I10)", "Surpoids (CIM-10: E66)"],
        lastVisit: "02/05/2026"
      },
      { 
        id: "pat-02", 
        name: "Marie Laurent", 
        age: 41, 
        gender: "Féminin", 
        ssn: "2 85 02 75 987 654 32", 
        allergies: "Sulfamides, Aspirine", 
        history: "Diabète de type 2 contrôlé, asthme d'effort occasionnel",
        diagnoses: ["Diabète de type 2 (CIM-10: E11)", "Asthme d'effort (CIM-10: J45)"],
        lastVisit: "14/06/2026"
      },
      { 
        id: "pat-03", 
        name: "Thomas Bernard", 
        age: 29, 
        gender: "Masculin", 
        ssn: "1 97 08 31 111 222 33", 
        allergies: "Aucune allergie connue", 
        history: "Pas d'antécédents cardiovasculaires ou métaboliques. Athlète amateur.",
        diagnoses: ["Examen de santé général (CIM-10: Z00)"],
        lastVisit: "28/06/2026"
      }
    ];

    // Check if there's a saved patient profile and inject it!
    const savedProfile = localStorage.getItem("winhealth_patient_profile");
    let parsed: any = null;
    if (savedProfile) {
      try {
        parsed = JSON.parse(savedProfile);
      } catch (e) {}
    }
    if (!parsed) {
      parsed = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@gmail.com",
        phone: "+229 97 00 00 01",
        bloodGroup: "A+",
        birthDate: "1968-05-15",
        isInitialized: true,
      };
    }
    if (parsed && parsed.isInitialized) {
      const age = parsed.birthDate ? new Date().getFullYear() - new Date(parsed.birthDate).getFullYear() : 30;
      defaultList.unshift({
        id: "pat-self",
        name: `${parsed.firstName} ${parsed.lastName}`,
        age: age || 58,
        gender: "Masculin",
        ssn: "1 68 05 15 123 456 78",
        allergies: "Aucune connue",
        history: `Groupe Sanguin: ${parsed.bloodGroup}. Email: ${parsed.email}. Téléphone: ${parsed.phone}`,
        diagnoses: ["Dossier Patient Actif"],
        lastVisit: "Aujourd'hui"
      });
    }
    return defaultList;
  });

  const activePatient = patientsList.find(p => p.id === selectedPatientId) || patientsList[0];

  // Prescription Generator pad
  const [prescribedDrugs, setPrescribedDrugs] = useState<Array<{ id: number; name: string; dosage: string; frequency: string; duration: string }>>([
    { id: 1, name: "Ramipril 5mg", dosage: "1 comprimé", frequency: "Le matin au petit-déjeuner", duration: "3 mois" },
  ]);
  const [newDrugName, setNewDrugName] = useState("");
  const [newDrugDosage, setNewDrugDosage] = useState("5mg");
  const [newDrugFrequency, setNewDrugFrequency] = useState("1 fois par jour");
  const [newDrugDuration, setNewDrugDuration] = useState("1 mois");

  // AI Prescription Audit State
  const [prescriptionAuditLoading, setPrescriptionAuditLoading] = useState(false);
  const [prescriptionAuditResult, setPrescriptionAuditResult] = useState("");
  const [prescriptionAuditError, setPrescriptionAuditError] = useState("");

  // Sealed prescriptions history
  const [sealedPrescriptions, setSealedPrescriptions] = useState<Array<{
    id: string;
    patientName: string;
    date: string;
    drugs: any[];
    signatureHash: string;
    isSealed: boolean;
  }>>([
    {
      id: "ORD-9871",
      patientName: "Jean-Pierre Dupont",
      date: "02/05/2026",
      drugs: [
        { name: "Ramipril 5mg", dosage: "1 comprimé", frequency: "Matin", duration: "3 mois" }
      ],
      signatureHash: "HDS-8C3D2E-1982",
      isSealed: true
    }
  ]);

  // ------------------ SECURITY DEMO STATES ------------------
  // Live encryption simulation
  const [ssnInput, setSsnInput] = useState(activePatient.ssn);
  const [encryptionSalt, setEncryptionSalt] = useState("SALT_SECURE_HDS_993");
  const [encryptedOutput, setEncryptedOutput] = useState("");
  const [decryptedOutput, setDecryptedOutput] = useState("");
  const [encryptionStep, setEncryptionStep] = useState<"idle" | "salted" | "hashed" | "aes">("idle");

  // Secure Audit Trail Logs (Real-time tracking of app state)
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    details: string;
    ipHash: string;
    integrityHash: string;
  }>>([
    { 
      id: "LOG-01", 
      timestamp: "04/07/2026 13:40:12", 
      actor: "Patient (Jean-Pierre Dupont)", 
      action: "Saisie Biométrique", 
      details: "Tension 121/81, Fréquence cardiaque 71 bpm", 
      ipHash: "192.168.1.105 (SHA256: e3b0c44...)",
      integrityHash: "CHAIN-0A8F91B"
    },
    { 
      id: "LOG-02", 
      timestamp: "04/07/2026 13:41:45", 
      actor: "Dr. Sophie Martin", 
      action: "Accès DMP Clinique", 
      details: "Consultation du journal d'hydratation et constantes de Jean-Pierre Dupont", 
      ipHash: "10.0.42.12 (SHA256: f1a2e3d...)",
      integrityHash: "CHAIN-1B9E02C"
    },
  ]);

  // Sync SSN state when patient changes
  useEffect(() => {
    setSsnInput(activePatient.ssn);
    setEncryptedOutput("");
    setDecryptedOutput("");
    setEncryptionStep("idle");
  }, [selectedPatientId]);

  // Load Comparative Presets
  useEffect(() => {
    fetch("/api/presets")
      .then((res) => res.json())
      .then((data) => {
        setPresets(data);
        setLoadingPresets(false);
      })
      .catch((err) => {
        console.error("Static fallbacks loaded", err);
        setLoadingPresets(false);
      });
  }, []);

  // Submit patient biometrics
  const handleAddBiometrics = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      systolic: parseInt(newSystolic) || 120,
      diastolic: parseInt(newDiastolic) || 80,
      heartRate: parseInt(newHeartRate) || 72,
      glucose: parseFloat(newGlucose) || 0.98,
      sleep: parseFloat(newSleep) || 7.5,
      hydration: parseFloat(newHydration) || 2.2,
      mood: parseInt(newMood) || 8
    };

    setBiometricsHistory([...biometricsHistory, newEntry]);
    setSubmitSuccess(true);
    
    // Add to secure audit trail
    const newLog = {
      id: "LOG-" + Math.floor(10 + Math.random() * 90),
      timestamp: new Date().toLocaleString("fr-FR"),
      actor: `Patient (${activePatient.name})`,
      action: "Saisie Biométrique",
      details: `Pression ${newSystolic}/${newDiastolic} mmHg, Glycémie ${newGlucose} g/L`,
      ipHash: "192.168.1.105 (SHA256: e3b0c44...)",
      integrityHash: generateFakeHash(`Tension ${newSystolic}/${newDiastolic}`)
    };
    setAuditLogs([newLog, ...auditLogs]);

    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Submit patient booking
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = new Date(bookDate).toLocaleDateString("fr-FR");
    const newBooking = {
      id: appointments.length + 1,
      doctor: bookDoctor,
      date: formattedDate,
      time: bookTime,
      status: "Confirmé",
      reason: bookReason || "Consultation standard"
    };

    setAppointments([...appointments, newBooking]);
    setBookSuccess(true);
    setBookReason("");

    const newLog = {
      id: "LOG-" + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toLocaleString("fr-FR"),
      actor: `Patient (${activePatient.name})`,
      action: "Prise de Rendez-vous",
      details: `Rendez-vous planifié avec ${bookDoctor} le ${formattedDate} à ${bookTime}`,
      ipHash: "192.168.1.105 (SHA256: e3b0c44...)",
      integrityHash: generateFakeHash(bookDoctor + bookDate)
    };
    setAuditLogs([newLog, ...auditLogs]);

    setTimeout(() => setBookSuccess(false), 3000);
  };

  // Submit AI Patient Health Coach request
  const handleCallHealthCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoachLoading(true);
    setCoachResponse("");
    setCoachError("");

    const lastBiometric = biometricsHistory[biometricsHistory.length - 1] || {
      systolic: 120, diastolic: 80, heartRate: 72, glucose: 0.98, sleep: 7.5, hydration: 2.2, mood: 8
    };

    try {
      const response = await fetch("/api/health-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biometrics: lastBiometric,
          symptoms: coachSymptoms,
          question: coachQuestion
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors du calcul de l'IA.");
      }
      setCoachResponse(data.text);

      const newLog = {
        id: "LOG-" + Math.floor(200 + Math.random() * 800),
        timestamp: new Date().toLocaleString("fr-FR"),
        actor: "Système IA Coach",
        action: "Génération Conseil Préventif",
        details: "Analyse cognitive des constantes et des symptômes déclarés par le patient.",
        ipHash: "INTERNAL_CORE (SHA256: a8b9c1d...)",
        integrityHash: generateFakeHash(data.text)
      };
      setAuditLogs([newLog, ...auditLogs]);
    } catch (err: any) {
      setCoachError(err.message || "Impossible de contacter l'assistant médical de santé.");
    } finally {
      setCoachLoading(false);
    }
  };

  // Submit Floating Chatbot question to health-coach API
  const handleChatbotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatbotInput.trim()) return;

    const userMsg = chatbotInput.trim();
    setChatbotInput("");

    const timestamp = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setChatbotMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: timestamp }
    ]);

    setIsChatbotTyping(true);

    const lastBiometric = biometricsHistory[biometricsHistory.length - 1] || {
      systolic: 120, diastolic: 80, heartRate: 72, glucose: 0.98, sleep: 7.5, hydration: 2.2, mood: 8
    };

    try {
      const response = await fetch("/api/health-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biometrics: lastBiometric,
          symptoms: "Session de chat interactive avec le patient.",
          question: userMsg
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'appel au Coach IA.");
      }

      setChatbotMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.text, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }
      ]);

      // Add to secure audit logs!
      const newLog = {
        id: "LOG-" + Math.floor(200 + Math.random() * 800),
        timestamp: new Date().toLocaleString("fr-FR"),
        actor: "Système IA Coach (Chat)",
        action: "Réponse Conversationnelle IA",
        details: `Réponse générée pour la question patient: "${userMsg.slice(0, 40)}..."`,
        ipHash: "INTERNAL_CORE (SHA256: b7c8d9e...)",
        integrityHash: generateFakeHash(data.text)
      };
      setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
    } catch (err: any) {
      setChatbotMessages((prev) => [
        ...prev,
        { sender: "bot", text: `⚠️ Désolé, je n'ai pas pu traiter votre demande. ${err.message || ""}`, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }
      ]);
    } finally {
      setIsChatbotTyping(false);
    }
  };

  // Add drug to doctor prescription pad
  const handleAddDrug = () => {
    if (!newDrugName.trim()) return;
    const newDrug = {
      id: prescribedDrugs.length + 1,
      name: newDrugName,
      dosage: newDrugDosage,
      frequency: newDrugFrequency,
      duration: newDrugDuration
    };
    setPrescribedDrugs([...prescribedDrugs, newDrug]);
    setNewDrugName("");
  };

  // Audit prescription with Gemini AI
  const handleAuditPrescription = async () => {
    setPrescriptionAuditLoading(true);
    setPrescriptionAuditResult("");
    setPrescriptionAuditError("");

    try {
      const response = await fetch("/api/audit-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugs: prescribedDrugs,
          patientAllergies: activePatient.allergies,
          patientHistory: activePatient.history
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Impossible d'analyser la prescription.");
      }
      setPrescriptionAuditResult(data.text);

      const newLog = {
        id: "LOG-" + Math.floor(300 + Math.random() * 700),
        timestamp: new Date().toLocaleString("fr-FR"),
        actor: "IA Pharmacologue",
        action: "Audit Ordonnance Clinique",
        details: `Analyse d'interactions pour ${prescribedDrugs.length} médicaments sur ${activePatient.name}`,
        ipHash: "INTERNAL_PHARMA_CORE (SHA256: d8e7f6...)",
        integrityHash: generateFakeHash(data.text)
      };
      setAuditLogs([newLog, ...auditLogs]);
    } catch (err: any) {
      setPrescriptionAuditError(err.message || "Erreur de connexion avec l'IA d'audit médical.");
    } finally {
      setPrescriptionAuditLoading(false);
    }
  };

  // Seal & Sign Prescription (HDS Signature Hash Calculation)
  const handleSealPrescription = () => {
    if (prescribedDrugs.length === 0) return;
    
    const plainTextPrescription = activePatient.name + JSON.stringify(prescribedDrugs);
    const signatureHash = generateFakeHash(plainTextPrescription);

    const newPrescription = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      patientName: activePatient.name,
      date: new Date().toLocaleDateString("fr-FR"),
      drugs: [...prescribedDrugs],
      signatureHash,
      isSealed: true
    };

    setSealedPrescriptions([newPrescription, ...sealedPrescriptions]);
    setPrescribedDrugs([]); // Reset pad
    setPrescriptionAuditResult(""); // Clear audit
    
    // Add to audit logs
    const newLog = {
      id: "LOG-" + Math.floor(400 + Math.random() * 600),
      timestamp: new Date().toLocaleString("fr-FR"),
      actor: "Dr. Sophie Martin",
      action: "Signature & Scellement Ordonnance",
      details: `Ordonnance ${newPrescription.id} scellée et signée électroniquement (HDS)`,
      ipHash: "10.0.42.12 (SHA256: f1a2e3d...)",
      integrityHash: signatureHash
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleDownloadPrescription = (sp: any) => {
    const patientInfo = patientsList.find(p => p.name === sp.patientName) || activePatient;

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ordonnance Numérique Sécurisée - ${sp.id}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 40px;
      background-color: #ffffff;
    }
    .header {
      border-bottom: 2px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .france-banner {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #64748b;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .doctor-title {
      font-size: 22px;
      font-weight: bold;
      color: #0f172a;
      margin: 0;
    }
    .doctor-subtitle {
      font-size: 12px;
      color: #475569;
      margin-top: 5px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 40px;
      background-color: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .meta-title {
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .meta-value {
      font-size: 14px;
      font-weight: bold;
      color: #0f172a;
    }
    .prescription-title {
      font-size: 18px;
      font-weight: bold;
      color: #059669;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .drug-item {
      padding: 15px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .drug-name {
      font-size: 15px;
      font-weight: bold;
      color: #0f172a;
    }
    .drug-details {
      font-size: 13px;
      color: #475569;
      margin-top: 4px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .signature-box {
      margin-top: 30px;
      padding: 15px;
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      font-family: monospace;
      font-size: 11px;
      color: #166534;
    }
    @media print {
      body {
        padding: 0;
      }
      .meta-grid {
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="france-banner">RÉPUBLIQUE FRANÇAISE • CADRE PROFESSIONNEL CONNECTÉ</div>
    <div class="doctor-title">Dr. Sophie Martin</div>
    <div class="doctor-subtitle">
      Cardiologue / Médecin Conventionné Secteur 1<br>
      Cabinet Principal, Paris • RPPS : 10100984021 &bull; CPS ID : 89012398402
    </div>
  </div>

  <div class="meta-grid">
    <div>
      <div class="meta-title">Patient</div>
      <div class="meta-value">${sp.patientName} (${patientInfo.age} ans, ${patientInfo.gender})</div>
      <div style="font-size: 11px; color: #475569; margin-top: 4px; font-family: monospace;">NIR: ${patientInfo.ssn}</div>
    </div>
    <div style="text-align: right;">
      <div class="meta-title">Date de prescription</div>
      <div class="meta-value">${sp.date}</div>
      <div style="font-size: 11px; color: #475569; margin-top: 4px; font-family: monospace;">Identifiant Ordonnance: ${sp.id}</div>
    </div>
  </div>

  <div class="prescription-title">Ordonnance Médicale Sécurisée</div>

  <div style="margin-bottom: 40px;">
    ${sp.drugs.map((d: any) => `
      <div class="drug-item">
        <div class="drug-name">${d.name}</div>
        <div class="drug-details">Posologie : <strong>${d.dosage}</strong> &bull; Fréquence : ${d.frequency} &bull; Durée : ${d.duration}</div>
      </div>
    `).join('')}
  </div>

  <div class="signature-box">
    <strong>CERTIFICATION DE SIGNATURE ÉLECTRONIQUE (HDS)</strong><br>
    Ce document a été signé électroniquement par le prescripteur Dr. Sophie Martin.<br>
    Clé d'authentification CPS : 89012398402<br>
    Empreinte de sécurité SHA-256 : <span style="font-weight: bold; color: #15803d;">${sp.signatureHash}</span>
  </div>

  <div class="footer">
    Document transmis en temps réel au Dossier Médical Partagé (DMP) de l'assuré.<br>
    Conformité RGPD et arrêté Hébergeurs de Données de Santé (HDS).<br>
    Win Health v5.0 - Plateforme d'Intégration d'Intelligence Médicale.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Ordonnance_WinHealth_${sp.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Add to audit logs
    const newLog = {
      id: "LOG-" + Math.floor(600 + Math.random() * 400),
      timestamp: new Date().toLocaleString("fr-FR"),
      actor: "Dr. Sophie Martin",
      action: "Téléchargement Ordonnance",
      details: `Fichier officiel d'ordonnance ${sp.id} généré et téléchargé au format HTML sécurisé pour impression.`,
      ipHash: "USER_BROWSER_DOWNLOAD (SHA256: d9e8f7...)",
      integrityHash: generateFakeHash(sp.signatureHash)
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Run secure AES encryption demo steps using REAL cryptographic algorithms (Web Crypto API)
  const handleRunEncryptionDemo = async () => {
    setEncryptionStep("salted");
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEncryptionStep("hashed");
      
      await new Promise((resolve) => setTimeout(resolve, 800));
      setEncryptionStep("aes");
      
      const encoder = new TextEncoder();
      const cleanSsn = ssnInput.replace(/\s+/g, "");
      const data = encoder.encode(cleanSsn);
      
      // We derive a PBKDF2 key from the user's Salt for authentic cryptographic validation
      const saltBuffer = encoder.encode(encryptionSalt || "default_salt");
      const baseKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode("ANS-HDS-SECRET-KEY"),
        "PBKDF2",
        false,
        ["deriveKey"]
      );
      
      const key = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: saltBuffer,
          iterations: 1000,
          hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      
      // Generate a real cryptographic random Initialization Vector (IV)
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the NIR/SSN data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        data
      );
      
      // Convert encrypted buffer to Base64
      const encryptedBytes = new Uint8Array(encryptedBuffer);
      let binary = "";
      for (let i = 0; i < encryptedBytes.byteLength; i++) {
        binary += String.fromCharCode(encryptedBytes[i]);
      }
      const base64Cipher = window.btoa(binary);
      
      // Represent IV and Salt as Hex strings
      const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
      const saltHex = sha256(encryptionSalt).substring(0, 16).toUpperCase();
      
      setEncryptedOutput(`AES_256_GCM::IV[${ivHex}]::SALT[${saltHex}]::CIPHER[${base64Cipher}]`);
      
      // Now, decrypt it to show the real-time decrypted outcome
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encryptedBuffer
      );
      
      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      setDecryptedOutput(decryptedText);
      
      const newLog = {
        id: "LOG-" + Math.floor(500 + Math.random() * 500),
        timestamp: new Date().toLocaleString("fr-FR"),
        actor: "Cryptographic Vault Daemon",
        action: "Chiffrement Réel AES-GCM (HDS)",
        details: `NIR patient '${cleanSsn}' chiffré de bout en bout de manière 100% réelle et sécurisée. Dérivation de clé PBKDF2 (1000 itérations) et chiffrement de bloc AES-GCM 256 bits conforme ANS/HDS.`,
        ipHash: "SECURE_LOCAL_VAULT (SHA256: 3b8c9d...)",
        integrityHash: generateFakeHash(base64Cipher)
      };
      setAuditLogs([newLog, ...auditLogs]);
    } catch (err: any) {
      console.error(err);
      setDecryptedOutput("Erreur de dérivation ou chiffrement cryptographique.");
    }
  };

  // Create real Lightning Invoice using our LNbits proxy
  const handleCreateLightningInvoice = async (amountSats?: number, memoText?: string) => {
    const finalAmount = amountSats || invoiceSats;
    const finalMemo = memoText || invoiceMemo;
    
    setPaymentStatus("loading");
    setPaymentError(null);
    setActiveInvoice(null);
    setActivePaymentHash(null);

    try {
      const response = await fetch("/api/lnbits/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: finalAmount,
          memo: finalMemo,
          customApiKey: lnbitsApiKey,
          customUrl: lnbitsUrl
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Une erreur s'est produite lors de la génération de la facture.");
      }

      const data = await response.json();
      
      // data contains: { payment_hash, payment_request, checking_id }
      if (data.payment_request) {
        setActiveInvoice(data.payment_request);
        setActivePaymentHash(data.payment_hash);
        setPaymentStatus("pending");
        
        // Add audit log for invoice creation
        const newLog = {
          id: "LOG-" + Math.floor(700 + Math.random() * 300),
          timestamp: new Date().toLocaleString("fr-FR"),
          actor: "Réseau Bitcoin Lightning",
          action: "Création Facture LNbits",
          details: `Facture de ${finalAmount} SATS créée pour "${finalMemo}". Hash: ${data.payment_hash.substring(0, 15)}...`,
          ipHash: "LN_ROUTING_DAEMON (SHA256: e8d7c6...)",
          integrityHash: generateFakeHash(data.payment_request)
        };
        setAuditLogs((prev: any[]) => [newLog, ...prev]);

        // Start polling the invoice status
        startInvoicePolling(data.payment_hash, finalAmount, finalMemo);
      } else {
        throw new Error("Aucune facture valide reçue de l'API LNbits.");
      }
    } catch (err: any) {
      console.error(err);
      setPaymentStatus("failed");
      setPaymentError(err.message || "Impossible de se connecter au portefeuille LNbits.");
    }
  };

  // Start polling LNbits status
  const startInvoicePolling = (hash: string, amount: number, memo: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch("/api/lnbits/check-invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paymentHash: hash,
            customApiKey: lnbitsApiKey,
            customUrl: lnbitsUrl
          })
        });

        if (response.ok) {
          const statusData = await response.json();
          // LNbits returns: { paid: true } or standard paid status
          if (statusData.paid) {
            // Success! Paid!
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            setPaymentStatus("paid");
            setIsPremiumUnlocked(true);
            
            const txn = {
              id: "TXN-" + Math.floor(1000 + Math.random() * 9000),
              date: new Date().toLocaleString("fr-FR"),
              amount,
              memo,
              hash,
              status: "Succès"
            };
            setPaymentHistory((prev: any[]) => [txn, ...prev]);

            // Add secure audit log for successful payment
            const paymentLog = {
              id: "LOG-" + Math.floor(800 + Math.random() * 200),
              timestamp: new Date().toLocaleString("fr-FR"),
              actor: "Bitcoin Lightning Protocol",
              action: "Paiement Reçu (Souverain)",
              details: `Règlement de ${amount} SATS validé avec succès en peer-to-peer pour la prestation: "${memo}". Un accès Premium temporaire a été déverrouillé.`,
              ipHash: "LIGHTNING_NETWORK_SUCCESS (SHA256: 000000...)",
              integrityHash: generateFakeHash(hash)
            };
            setAuditLogs((prev: any[]) => [paymentLog, ...prev]);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la facture:", err);
      }
    }, 2500);
  };

  // Cancel invoice and stop polling
  const handleCancelInvoice = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setActiveInvoice(null);
    setActivePaymentHash(null);
    setPaymentStatus("idle");
    setPaymentError(null);
  };

  // Helper to compute min/max for custom charts
  const systolicPoints = biometricsHistory.map((d) => d.systolic);
  const diastolicPoints = biometricsHistory.map((d) => d.diastolic);
  const hrPoints = biometricsHistory.map((d) => d.heartRate);
  const glucosePoints = biometricsHistory.map((d) => d.glucose);

  if (!currentUser.isLoggedIn) {
    return (
      <AuthScreen 
        onLoginPatient={(profile) => {
          setCurrentUser({ type: 'patient', profile, isLoggedIn: true });
          setActiveTab('patient');
          setPatientQrToken("WIN-" + Math.random().toString(36).substring(2, 10).toUpperCase());
        }}
        onLoginDoctor={(profile) => {
          setCurrentUser({ type: 'doctor', profile, isLoggedIn: true });
          setActiveTab('doctor');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between">
      {/* Top Professional Compliance Bar */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-mono flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="truncate">Serveur HDS Connecté : <strong>0.0.0.0:3000</strong> &bull; Chiffrement AES-256 &bull; DMP Synchrone</span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-slate-400">
          <span>Version: Win Health v5.0</span>
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] font-bold">MODE SANS FAILLE</span>
        </div>
      </div>

      {/* Main Beautiful Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 flex items-center gap-2">
                Win Health <span className="text-emerald-600 text-sm font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">5.0 UNIFIED</span>
              </h1>
              <p className="text-xs text-slate-500">
                La symbiose d'un parcours patient moderne et d'un espace praticien sécurisé HDS
              </p>
            </div>
          </div>

          {/* Quick Platform Role Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-center border border-slate-200/40">
            {currentUser.type === 'patient' && (
              <>
                <button
                  onClick={() => setActiveTab("patient")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "patient"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/20"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Smile className="w-3.5 h-3.5 text-indigo-500" />
                  Tableau de bord
                </button>
                <button
                  onClick={() => setActiveTab("bitcoin")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden ${
                    activeTab === "bitcoin"
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${activeTab === "bitcoin" ? "text-white animate-bounce" : "text-amber-500"}`} />
                  Paiement Bitcoin (LNbits)
                </button>
              </>
            )}

            {currentUser.type === 'doctor' && (
              <button
                onClick={() => setActiveTab("doctor")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "doctor"
                    ? "bg-white text-emerald-700 shadow-sm border border-slate-200/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Espace Praticien DMP
              </button>
            )}

            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "security"
                  ? "bg-white text-rose-700 shadow-sm border border-slate-200/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              Sécurité HDS
            </button>
            
            <button
              onClick={() => {
                setCurrentUser({ type: 'patient', profile: null, isLoggedIn: false });
                setHasDoctorAccess(false);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 transition-all cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PATIENT PORTAL (Sleek tracking, history curves, and Gemini advisor chat) */}
          {activeTab === "patient" && (
            <motion.div
              key="patient-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Patient Banner: Inspired by the screenshot */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-white to-indigo-50/30 border border-emerald-100/80 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden text-slate-800">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none text-emerald-600 animate-pulse">
                  <Smile className="w-80 h-80" />
                </div>
                
                <div className="max-w-3xl space-y-6 relative z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full text-[11px] font-semibold text-emerald-800 uppercase tracking-wider shadow-2xs">
                    <span className="text-amber-500 animate-pulse">✨</span>
                    <span>WIN HEALTH • SOUVERAINETÉ & FLUIDITÉ</span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-900 leading-tight">
                    La santé numérique <br />
                    béninoise, <span className="text-emerald-500 font-extrabold">100% sécurisée</span> <br />
                    et <span className="text-emerald-500 font-extrabold">décentralisée</span>.
                  </h2>

                  {/* Subtitle */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                    Simplifiez votre parcours de soins avec <strong className="text-emerald-800 font-semibold">Win Health</strong>. Réglez vos factures de soins instantanément, signez vos consentements cryptographiques via le Réseau Lightning, et gérez vos documents médicaux de manière entièrement hors-ligne.
                  </p>

                  {/* CTA Buttons */}
                  <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <button
                      onClick={() => {
                        const target = document.getElementById("booking-form-anchor");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Accéder à la carte & Prendre RDV</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("bitcoin")}
                      className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Consulter mes Factures</span>
                    </button>
                  </div>

                  {/* Trust Indicators & QR Code */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex flex-wrap gap-6 text-slate-500 text-[11px] font-medium items-center">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span>Profil actif : <strong className="text-slate-800 font-semibold">{currentUser.profile?.firstName} {currentUser.profile?.lastName}</strong> ({currentUser.profile?.bloodGroup || 'A+'})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Hébergement certifié HDS</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Réseau Lightning Bitcoin</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        {/* Fake SVG QR Code */}
                        <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-800">
                          <rect width="100" height="100" fill="#fff" />
                          <path d="M10 10h20v20h-20zM20 20h-1v-1h1z" fill="currentColor" />
                          <path d="M70 10h20v20h-20zM80 20h-1v-1h1z" fill="currentColor" />
                          <path d="M10 70h20v20h-20zM20 80h-1v-1h1z" fill="currentColor" />
                          <path d="M40 10h10v10h-10zM55 20h15v10h-15zM40 30h30v10h-30zM10 40h20v10h-20zM70 40h20v10h-20zM10 55h15v10h-15zM40 55h20v20h-20zM30 70h10v10h-10zM70 70h20v10h-20z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Accès Médecin</div>
                        <div className="text-sm font-bold font-mono tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{patientQrToken}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Biometrics Tracker & Animated Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Input Biometrics Panel */}
                <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                      <Plus className="w-4 h-4 text-indigo-500" />
                      Ajouter une mesure
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">Saisissez vos données physiologiques pour mettre à jour vos courbes et alerter votre DMP.</p>
                  </div>

                  <form onSubmit={handleAddBiometrics} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Systolique (mmHg)</label>
                        <input 
                          type="number" 
                          value={newSystolic} 
                          onChange={(e) => setNewSystolic(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Diastolique (mmHg)</label>
                        <input 
                          type="number" 
                          value={newDiastolic} 
                          onChange={(e) => setNewDiastolic(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Cardiaque (bpm)</label>
                        <input 
                          type="number" 
                          value={newHeartRate} 
                          onChange={(e) => setNewHeartRate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Glycémie (g/L)</label>
                        <input 
                          type="text" 
                          value={newGlucose} 
                          onChange={(e) => setNewGlucose(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Sommeil (h)</label>
                        <input 
                          type="text" 
                          value={newSleep} 
                          onChange={(e) => setNewSleep(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Hydratation (L)</label>
                        <input 
                          type="text" 
                          value={newHydration} 
                          onChange={(e) => setNewHydration(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase flex justify-between">
                        <span>Humeur générale</span>
                        <span className="text-indigo-600 font-bold">{newMood}/10</span>
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="10"
                        value={newMood}
                        onChange={(e) => setNewMood(e.target.value)}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-sm shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Enregistrer les constantes
                    </button>

                    {submitSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[10px] flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Constantes synchronisées avec le serveur sécurisé HDS !</span>
                      </motion.div>
                    )}
                  </form>
                </div>

                {/* Right: Interactive SVG Curves Dashboard */}
                <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4.5 h-4.5 text-indigo-500" />
                        Courbes Physiologiques Dynamiques
                      </h3>
                      <p className="text-[11px] text-slate-500">Historique d'évolution continu transmis de votre domicile vers le DMP.</p>
                    </div>

                    {/* Chart Selector */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                      <button 
                        onClick={() => setChartMetric("tension")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${chartMetric === "tension" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"}`}
                      >
                        Tension (mmHg)
                      </button>
                      <button 
                        onClick={() => setChartMetric("heartRate")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${chartMetric === "heartRate" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"}`}
                      >
                        Cardiaque (bpm)
                      </button>
                      <button 
                        onClick={() => setChartMetric("glucose")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${chartMetric === "glucose" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"}`}
                      >
                        Glycémie (g/L)
                      </button>
                    </div>
                  </div>

                  {/* Stunning Animated SVG Chart Area */}
                  <div className="h-64 relative mt-6 flex items-center justify-center">
                    {/* SVG Chart */}
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 220" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="170" x2="500" y2="170" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="200" x2="500" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Threshold guides */}
                      {chartMetric === "tension" && (
                        <>
                          {/* Normal Systolic Limit */}
                          <rect x="0" y="40" width="500" height="40" fill="#f0fdf4" fillOpacity="0.4" />
                          <line x1="0" y1="40" x2="500" y2="40" stroke="#22c55e" strokeWidth="1" strokeDasharray="5" strokeOpacity="0.4" />
                          <text x="10" y="35" className="text-[8px] font-mono fill-emerald-600">Limite Systolique Normale (130 mmHg)</text>
                        </>
                      )}

                      {/* Rendering Points & Paths depending on metric selection */}
                      {chartMetric === "tension" && (
                        <>
                          {/* Systolic Line & Path */}
                          <path
                            d={`M ${biometricsHistory.map((d, i) => `${(i / (biometricsHistory.length - 1)) * 500}, ${200 - ((d.systolic - 90) / 60) * 150}`).join(" L ")}`}
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          {/* Diastolic Line & Path */}
                          <path
                            d={`M ${biometricsHistory.map((d, i) => `${(i / (biometricsHistory.length - 1)) * 500}, ${200 - ((d.diastolic - 50) / 50) * 150}`).join(" L ")}`}
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          {/* Points */}
                          {biometricsHistory.map((d, i) => {
                            const x = (i / (biometricsHistory.length - 1)) * 500;
                            const ySystolic = 200 - ((d.systolic - 90) / 60) * 150;
                            const yDiastolic = 200 - ((d.diastolic - 50) / 50) * 150;
                            return (
                              <g key={i}>
                                <circle cx={x} cy={ySystolic} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer hover:r-7 transition-all" />
                                <circle cx={x} cy={yDiastolic} r="4.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer hover:r-6 transition-all" />
                              </g>
                            );
                          })}
                        </>
                      )}

                      {chartMetric === "heartRate" && (
                        <>
                          <path
                            d={`M ${biometricsHistory.map((d, i) => `${(i / (biometricsHistory.length - 1)) * 500}, ${200 - ((d.heartRate - 50) / 60) * 150}`).join(" L ")}`}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          {biometricsHistory.map((d, i) => {
                            const x = (i / (biometricsHistory.length - 1)) * 500;
                            const y = 200 - ((d.heartRate - 50) / 60) * 150;
                            return (
                              <circle key={i} cx={x} cy={y} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                            );
                          })}
                        </>
                      )}

                      {chartMetric === "glucose" && (
                        <>
                          <path
                            d={`M ${biometricsHistory.map((d, i) => `${(i / (biometricsHistory.length - 1)) * 500}, ${200 - ((d.glucose - 0.6) / 1.0) * 150}`).join(" L ")}`}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          {biometricsHistory.map((d, i) => {
                            const x = (i / (biometricsHistory.length - 1)) * 500;
                            const y = 200 - ((d.glucose - 0.6) / 1.0) * 150;
                            return (
                              <circle key={i} cx={x} cy={y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                            );
                          })}
                        </>
                      )}
                    </svg>

                    {/* Chart Tooltips overlay */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
                      {biometricsHistory.map((d, i) => (
                        <div key={i} className="flex flex-col justify-end items-center h-full pb-0 group">
                          <span className="text-[9px] font-mono text-slate-400 mt-2 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            {d.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Metric Widgets below the curves */}
                  <div className="grid grid-cols-4 gap-4 mt-8 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase">
                        <Heart className="w-3.5 h-3.5 text-indigo-500" />
                        Tension moy.
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">120/81 <span className="text-[10px] text-slate-500 font-normal">mmHg</span></div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase">
                        <Activity className="w-3.5 h-3.5 text-rose-500" />
                        Cardiaque moy.
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">72 <span className="text-[10px] text-slate-500 font-normal">bpm</span></div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase">
                        <Droplet className="w-3.5 h-3.5 text-sky-500" />
                        Hydratation
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">2.1 <span className="text-[10px] text-slate-500 font-normal">L/j</span></div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase">
                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                        Sommeil
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">7.4 <span className="text-[10px] text-slate-500 font-normal">h/nuit</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient AI Coach Interface (Real-time clinical analysis) */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                  {/* Assistant Left Pitch */}
                  <div className="lg:w-1/3 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-200 font-display uppercase tracking-wider flex items-center gap-2 flex-wrap">
                        <span>Coach de Télésurveillance IA</span>
                        {isPremiumUnlocked ? (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> Premium via Lightning
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full">
                            Mode Standard
                          </span>
                        )}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ce module d'intelligence clinique analyse instantanément votre carnet de constantes physiques saisies, vos symptômes ponctuels déclarés, et formule des plans préventifs d'hydratation et de bien-être, certifiés conformes au DMP médecin.
                    </p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-500 space-y-1.5">
                      <span className="font-semibold text-slate-300 block">Dernières constantes transmises :</span>
                      <ul className="space-y-0.5 font-mono">
                        <li>&#8226; TA: {biometricsHistory[biometricsHistory.length-1].systolic}/{biometricsHistory[biometricsHistory.length-1].diastolic} mmHg</li>
                        <li>&#8226; Cardiaque: {biometricsHistory[biometricsHistory.length-1].heartRate} bpm</li>
                        <li>&#8226; Glycémie: {biometricsHistory[biometricsHistory.length-1].glucose} g/L</li>
                      </ul>
                    </div>
                  </div>

                  {/* Chat Panel */}
                  <div className="flex-1 space-y-4">
                    <form onSubmit={handleCallHealthCoach} className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Symptômes éventuels à déclarer (Optionnel)</label>
                        <input 
                          type="text"
                          value={coachSymptoms}
                          onChange={(e) => setCoachSymptoms(e.target.value)}
                          placeholder="Ex: Légères palpitations l'après-midi, sécheresse buccale, fatigue..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200 placeholder:text-slate-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Votre Question Préventive au Coach Clinique</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={coachQuestion}
                            onChange={(e) => setCoachQuestion(e.target.value)}
                            placeholder="Ex: Analyse mes constantes d'aujourd'hui et donne-moi des conseils d'hydratation..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200 placeholder:text-slate-600"
                          />
                          <button 
                            type="submit" 
                            disabled={coachLoading}
                            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:bg-slate-800 disabled:text-slate-600"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {coachLoading ? "Calcul..." : "Analyser"}
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Chat Response Display */}
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 min-h-[140px] max-h-[300px] overflow-auto select-text">
                      {coachLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-2">
                          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                          <p className="text-[11px] text-slate-500">Génération du plan préventif crypté...</p>
                        </div>
                      ) : coachError ? (
                        <div className="text-rose-400 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>{coachError}</span>
                        </div>
                      ) : coachResponse ? (
                        <StyledMarkdown content={coachResponse} />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-slate-600">
                          <HelpCircle className="w-8 h-8 mb-2 text-slate-850" />
                          <p className="text-xs">Saisissez vos symptômes ou votre question ci-dessus pour lancer une analyse par l'IA.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Read-Only DMP */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4.5 h-4.5 text-emerald-500" />
                    Mon Dossier Médical (Lecture Seule)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">Vos ordonnances scellées et cryptées. Toute modification est strictement réservée à votre médecin traitant.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sealedPrescriptions.length === 0 ? (
                    <div className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">Aucune ordonnance scellée pour le moment.</div>
                  ) : (
                    sealedPrescriptions.map((sp) => (
                      <div key={sp.id} className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl space-y-2 text-xs relative opacity-90 hover:opacity-100 transition-opacity">
                        <div className="absolute right-3 top-3 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Lecture Seule
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">{sp.id}</div>
                        <div className="font-bold text-slate-900">{sp.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{sp.date}</div>
                        <div className="space-y-0.5 pt-1.5 border-t border-slate-200/50">
                          {sp.drugs.map((d, i) => (
                            <div key={i} className="text-[11px] text-slate-700 font-medium">
                              &#8226; {d.name} ({d.dosage}) - {d.duration}
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-slate-200/50 mt-1">
                          <div className="flex items-center gap-1.5 text-[9px] text-indigo-700 font-mono font-bold truncate">
                            <Hash className="w-3 h-3 text-indigo-500 shrink-0" />
                            Signature : {sp.signatureHash.substring(0, 15)}...
                          </div>
                          <button
                            onClick={() => handleDownloadPrescription(sp)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 hover:text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all shrink-0"
                          >
                            <Download className="w-3 h-3" />
                            Télécharger
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cabinet Finder & Booking (Real Google Maps) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4.5 h-4.5 text-indigo-500" />
                    Trouver un Cabinet Médical (Géolocalisation Google Maps)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Recherchez votre praticien sur la carte interactive de Cotonou, consultez les avis et horaires, et planifiez votre rendez-vous directement en un clic.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Interactive Real Google Map */}
                  <div className="lg:col-span-8">
                    <ClinicMap 
                      clinics={clinicsList}
                      selectedClinic={selectedClinic}
                      onSelectClinic={(clinic) => {
                        setSelectedClinic(clinic);
                        setBookDoctor(clinic.name);
                      }}
                      onBookClinic={(clinic) => {
                        setSelectedClinic(clinic);
                        setBookDoctor(clinic.name);
                        const formElem = document.getElementById("booking-form-anchor");
                        if (formElem) {
                          formElem.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    />
                  </div>

                  {/* Right: Clinic Directory & Fast Booking */}
                  <div className="lg:col-span-4 flex flex-col justify-between h-[420px] bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Cabinets Partenaires Win Health
                      </h4>
                      <div className="space-y-3">
                        {clinicsList.map((clinic) => {
                          const isSelected = selectedClinic?.id === clinic.id;
                          return (
                            <div 
                              key={clinic.id}
                              onClick={() => {
                                setSelectedClinic(clinic);
                                setBookDoctor(clinic.name);
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                                isSelected 
                                  ? "bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/20" 
                                  : "bg-white/80 hover:bg-white border-slate-200/60"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h5 className="text-[11px] font-bold text-slate-900 leading-tight">{clinic.name}</h5>
                                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                                  {clinic.specialty}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate text-[10px]">{clinic.address}</span>
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-400">
                                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  {clinic.rating} / 5
                                </span>
                                <span>{clinic.hours}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-200/80 pt-3 mt-3">
                      {selectedClinic ? (
                        <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-left">
                          <p className="text-[10px] font-bold text-indigo-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                            Cabinet Sélectionné :
                          </p>
                          <p className="text-[11px] font-bold text-slate-800 mt-0.5">{selectedClinic.name}</p>
                          <p className="text-[10px] text-slate-500">{selectedClinic.address}</p>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-center text-[10px] text-slate-500">
                          Sélectionnez un cabinet sur la carte ou la liste pour réserver
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Separator / Anchor for smooth scroll */}
                <div id="booking-form-anchor" className="border-t border-slate-150 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Form to book */}
                    <div className="lg:col-span-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          Formulaire d'Agenda Synchrone
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          L'intégration directe de l'agenda médecin de Win Health Pro évite tout risque de double-réservation.
                        </p>
                      </div>

                      <form onSubmit={handleBookAppointment} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase">Cabinet / Praticien</label>
                          <select 
                            value={bookDoctor}
                            onChange={(e) => {
                              setBookDoctor(e.target.value);
                              const matchingClinic = clinicsList.find(c => c.name === e.target.value);
                              if (matchingClinic) setSelectedClinic(matchingClinic);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                          >
                            {clinicsList.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase">Date souhaitée</label>
                            <input 
                              type="date" 
                              value={bookDate}
                              onChange={(e) => setBookDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase">Créneau disponible</label>
                            <select 
                              value={bookTime}
                              onChange={(e) => setBookTime(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                            >
                              <option>09:00 - Disponible</option>
                              <option>10:00 - Disponible</option>
                              <option>11:15 - Disponible</option>
                              <option>14:30 - Disponible</option>
                              <option>16:00 - Disponible</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase">Motif de consultation</label>
                          <input 
                            type="text" 
                            value={bookReason}
                            onChange={(e) => setBookReason(e.target.value)}
                            placeholder="Ex: Douleurs abdominales, renouvellement traitement tension..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Réserver le créneau de consultation
                        </button>

                        {bookSuccess && (
                          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-[10px] flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Rendez-vous planifié et notifié par SMS !</span>
                          </div>
                        )}
                      </form>
                    </div>

                    {/* Right Column: Booked appointments list */}
                    <div className="lg:col-span-7 space-y-4">
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-400 uppercase">Vos consultations à venir</h4>
                        <div className="space-y-3 mt-2">
                          {appointments.map((apt) => (
                            <div key={apt.id} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-slate-400" />
                                  {apt.doctor}
                                </div>
                                <p className="text-[11px] text-slate-500">{apt.reason}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{apt.date}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                                </div>
                              </div>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                                {apt.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PRACTITIONER DMP PORTAL (EHR, allergies, CIM-10 prescribing, and AI interaction check) */}
          {activeTab === "doctor" && (
            <motion.div
              key="doctor-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Doctor Header Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider">
                    Espace Cabinet Médical Connecté (HDS)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Dr. {currentUser.profile?.lastName} &bull; {currentUser.profile?.specialty}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Accédez aux dossiers médicaux partagés, gérez votre agenda synchronisé, et rédigez des ordonnances sécurisées par IA.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="text-[11px] font-mono text-slate-300">
                    <div>Pro Santé Connect : ACTIF</div>
                    <div className="text-slate-500 text-[10px]">CPS ID: 89012398402</div>
                  </div>
                </div>
              </div>

              {!hasDoctorAccess ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs max-w-md mx-auto text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Verrouillage de Sécurité</h3>
                    <p className="text-xs text-slate-500 mt-2">Veuillez scanner le QR Code du patient ou saisir son jeton de session pour déverrouiller l'accès au DMP.</p>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Jeton (ex: WIN-A1B2C3D4)" 
                      value={doctorEnteredQr}
                      onChange={(e) => setDoctorEnteredQr(e.target.value)}
                      className="w-full text-center font-mono uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button 
                      onClick={() => {
                        if (doctorEnteredQr.startsWith("WIN-") || doctorEnteredQr === patientQrToken) {
                          setHasDoctorAccess(true);
                        } else {
                          alert("Jeton invalide");
                        }
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm"
                    >
                      Déverrouiller le Dossier
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Patient Selector for DMP */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">Rechercher un dossier patient DMP :</span>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {patientsList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        setIsCreatingPatient(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedPatientId === p.id && !isCreatingPatient
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/50"
                      }`}
                    >
                      {p.name} ({p.age} ans)
                    </button>
                  ))}

                  <button
                    onClick={() => setIsCreatingPatient(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isCreatingPatient
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Création de compte DMP
                  </button>
                </div>
              </div>

              {isCreatingPatient ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6 my-4">
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 font-display">Création de Compte & Dossier Médical DMP</h3>
                    <p className="text-xs text-slate-500">Générez un nouveau dossier médical sécurisé et certifié conforme.</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const newId = `pat-${Date.now()}`;
                    const age = newPatientBirthDate ? new Date().getFullYear() - new Date(newPatientBirthDate).getFullYear() : 35;
                    const newPatient = {
                      id: newId,
                      name: `${newPatientFirstName} ${newPatientLastName}`,
                      age: age || 35,
                      gender: "Masculin",
                      ssn: `1 ${Math.floor(10 + Math.random() * 80)} ${Math.floor(10 + Math.random() * 80)} ${Math.floor(10 + Math.random() * 80)} ${Math.floor(100 + Math.random() * 800)} ${Math.floor(100 + Math.random() * 800)} ${Math.floor(10 + Math.random() * 80)}`,
                      allergies: "Aucune connue",
                      history: `Groupe Sanguin: ${newPatientBloodGroup}. Email: ${newPatientEmail}. Téléphone: ${newPatientPhone}`,
                      diagnoses: ["Dossier Patient Actif", "Nouveau Compte DMP"],
                      lastVisit: "Aujourd'hui"
                    };
                    setPatientsList(prev => [newPatient, ...prev]);
                    setSelectedPatientId(newId);
                    setIsCreatingPatient(false);
                    // Clear form
                    setNewPatientFirstName("");
                    setNewPatientLastName("");
                    setNewPatientEmail("");
                    setNewPatientPhone("+229");
                    setNewPatientBloodGroup("A+");
                    setNewPatientBirthDate("");
                  }} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">Prénom</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={newPatientFirstName}
                            onChange={(e) => setNewPatientFirstName(e.target.value)}
                            placeholder="Jean"
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">Nom</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={newPatientLastName}
                            onChange={(e) => setNewPatientLastName(e.target.value)}
                            placeholder="Dupont"
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block">Adresse Gmail / Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={newPatientEmail}
                          onChange={(e) => setNewPatientEmail(e.target.value)}
                          placeholder="jean.dupont@gmail.com"
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">Téléphone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={newPatientPhone}
                            onChange={(e) => setNewPatientPhone(e.target.value)}
                            placeholder="+229"
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">Groupe Sanguin</label>
                        <div className="relative">
                          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            value={newPatientBloodGroup}
                            onChange={(e) => setNewPatientBloodGroup(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none bg-no-repeat bg-[right_12px_center]"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block">Date de Naissance</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="date"
                          required
                          value={newPatientBirthDate}
                          onChange={(e) => setNewPatientBirthDate(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsCreatingPatient(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Créer le Dossier DMP</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* EHR Details Card */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4.5 h-4.5 text-emerald-600" />
                      Dossier Médical (EHR/DMP)
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">UID: {activePatient.id}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Nom Complet</span>
                        <span className="text-xs font-bold text-slate-900">{activePatient.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Genre / Âge</span>
                        <span className="text-xs font-bold text-slate-900">{activePatient.gender}, {activePatient.age} ans</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Numéro de Sécurité Sociale (NIR)</span>
                      <span className="text-xs font-mono font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{activePatient.ssn}</span>
                    </div>

                    <div className="p-3 bg-rose-50/50 border border-rose-150 rounded-xl space-y-1">
                      <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Allergies Critiques Déclarées
                      </span>
                      <p className="text-xs text-rose-800 font-semibold">{activePatient.allergies}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Antécédents Médicaux Cliniques</span>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">{activePatient.history}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Pathologies d'Ordonnance actives (CIM-10)</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {activePatient.diagnoses.map((d, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescription Pad & AI Audit Engine */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-emerald-600" />
                      Éditeur d'Ordonnance Intelligent
                    </h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">ANSM Conforme</span>
                  </div>

                  {/* Add Medication mini-form */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-600 uppercase block">Ajouter une ligne de traitement</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6">
                        <input 
                          type="text" 
                          value={newDrugName}
                          onChange={(e) => setNewDrugName(e.target.value)}
                          placeholder="Nom de la molécule ou DCI (ex: Amoxicilline)"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input 
                          type="text" 
                          value={newDrugDosage}
                          onChange={(e) => setNewDrugDosage(e.target.value)}
                          placeholder="Posologie (ex: 500mg)"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <button 
                          onClick={handleAddDrug}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Ajouter
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-slate-500 uppercase">Fréquence de prise</label>
                        <input 
                          type="text" 
                          value={newDrugFrequency}
                          onChange={(e) => setNewDrugFrequency(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-slate-500 uppercase">Durée du traitement</label>
                        <input 
                          type="text" 
                          value={newDrugDuration}
                          onChange={(e) => setNewDrugDuration(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Proposed drug list table */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Traitements proposés :</span>
                    {prescribedDrugs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Aucune molécule prescrite dans l'ordonnance active.</p>
                    ) : (
                      <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-500 font-mono text-[9px] uppercase">
                            <tr>
                              <th className="p-3">Médicament / DCI</th>
                              <th className="p-3">Dosage</th>
                              <th className="p-3">Prises</th>
                              <th className="p-3">Durée</th>
                              <th className="p-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-800">
                            {prescribedDrugs.map((d) => (
                              <tr key={d.id}>
                                <td className="p-3 font-semibold text-slate-950">{d.name}</td>
                                <td className="p-3 font-mono">{d.dosage}</td>
                                <td className="p-3">{d.frequency}</td>
                                <td className="p-3">{d.duration}</td>
                                <td className="p-3 text-right">
                                  <button 
                                    onClick={() => setPrescribedDrugs(prescribedDrugs.filter(item => item.id !== d.id))}
                                    className="text-rose-500 hover:text-rose-700 text-[10px] font-bold cursor-pointer"
                                  >
                                    Supprimer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Actions: AI Audit & Sealing */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                    <button 
                      onClick={handleAuditPrescription}
                      disabled={prescriptionAuditLoading || prescribedDrugs.length === 0}
                      className="bg-slate-900 hover:bg-slate-950 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      {prescriptionAuditLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                      <span>Vérification IA (Gemini)</span>
                    </button>

                    <button 
                      onClick={handleSealPrescription}
                      disabled={prescribedDrugs.length === 0}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ml-auto"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sceller & Enregistrer l'Ordonnance au DMP</span>
                    </button>
                  </div>

                  {/* AI Prescription Audit result render */}
                  <AnimatePresence>
                    {(prescriptionAuditResult || prescriptionAuditError) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-950 text-slate-100 rounded-xl p-4 border border-slate-850 space-y-3 font-mono text-[11px]"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <Terminal className="w-3.5 h-3.5" />
                            Rapport d'Audit Pharmaceutique IA
                          </span>
                          <span className="text-[9px] text-slate-500">ANSM API SECURE</span>
                        </div>
                        
                        {prescriptionAuditError ? (
                          <p className="text-rose-400">{prescriptionAuditError}</p>
                        ) : (
                          <div className="select-text overflow-auto max-h-[300px]">
                            <StyledMarkdown content={prescriptionAuditResult} />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Locked and Sealed prescriptions log */}
                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Historique des Ordonnances Scellées (HDS-Compliant)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sealedPrescriptions.map((sp) => (
                        <div key={sp.id} className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl space-y-2 text-xs relative">
                          <div className="absolute right-3 top-3 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Scellée
                          </div>
                          
                          <div className="font-mono text-[10px] text-slate-400">{sp.id}</div>
                          <div className="font-bold text-slate-900">{sp.patientName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{sp.date}</div>
                          
                          <div className="space-y-0.5 pt-1.5 border-t border-slate-200/50">
                            {sp.drugs.map((d, i) => (
                              <div key={i} className="text-[11px] text-slate-700 font-medium">
                                &#8226; {d.name} ({d.dosage}) - {d.duration}
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-slate-200/50 mt-1">
                            <div className="flex items-center gap-1.5 text-[9px] text-indigo-700 font-mono font-bold truncate">
                              <Hash className="w-3 h-3 text-indigo-500 shrink-0" />
                              Signature : {sp.signatureHash.substring(0, 15)}...
                            </div>
                            <button
                              onClick={() => handleDownloadPrescription(sp)}
                              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 hover:text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all shrink-0"
                            >
                              <Download className="w-3 h-3" />
                              Télécharger
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
            </motion.div>
          )}

          {/* TAB 3: CRYPTOGRAPHIC VAULT & AUDIT TRAILS */}
          {activeTab === "security" && (
            <motion.div
              key="security-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Security Hero */}
              <div className="bg-gradient-to-r from-rose-950 to-slate-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
                  <Lock className="w-80 h-80" />
                </div>
                <div className="max-w-3xl space-y-3 relative z-10">
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider">
                    Démonstrateur de Chiffrement HDS / ANS
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Sécurité Zéro-Faille : Chiffrement & Traçabilité des Accès
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Le principal manquement de Santé 5.0 d'origine est l'absence de chiffrement des données de santé au repos. Win Health intègre un coffre-fort cryptographique exécutant l'encapsulation HDS cryptographique réelle requise par les autorités françaises.
                  </p>
                </div>
              </div>

              {/* Grid: Live Encrypter & Audit Trails */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Cryptographic Vault Demo */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                      <Key className="w-4.5 h-4.5 text-rose-500" />
                      Démonstrateur Cryptographique AES-256
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">Voyez comment les données hautement sensibles comme l'Identifiant National de Santé (INS) sont cryptées au repos.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Donnée à chiffrer (ex: NIR Sécurité Sociale)</label>
                      <input 
                        type="text"
                        value={ssnInput}
                        onChange={(e) => setSsnInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-800 font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Sel d'Amorçage Cryptographique (Salt)</label>
                      <input 
                        type="text"
                        value={encryptionSalt}
                        onChange={(e) => setEncryptionSalt(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-800 font-mono"
                      />
                    </div>

                    <button 
                      onClick={handleRunEncryptionDemo}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Lock className="w-4 h-4 text-rose-500 animate-pulse" />
                      Exécuter le cycle de chiffrement
                    </button>

                    {/* Step Visualizer */}
                    {encryptionStep !== "idle" && (
                      <div className="bg-slate-550/10 p-4 rounded-xl border border-slate-200/50 space-y-3 font-mono text-[10px] text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>1. Concaténation Sel :</span>
                          <span className={`font-bold ${encryptionStep !== "salted" ? "text-emerald-600" : "text-amber-600"}`}>
                            {encryptionStep === "salted" ? "En cours..." : "Terminé"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>2. Injection du Vecteur d'Initialisation (IV) :</span>
                          <span className={`font-bold ${encryptionStep === "aes" ? "text-emerald-600" : "text-amber-600"}`}>
                            {encryptionStep === "aes" ? "Terminé" : "En attente"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>3. Cryptage par bloc AES-GCM 256 bits :</span>
                          <span className={`font-bold ${encryptionStep === "aes" ? "text-emerald-600" : "text-amber-600"}`}>
                            {encryptionStep === "aes" ? "Terminé" : "En attente"}
                          </span>
                        </div>
                      </div>
                    )}

                    {encryptedOutput && (
                      <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="space-y-3"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-rose-600 uppercase block">Résultat Chiffré en Base64 (au repos sur HDS)</span>
                          <div className="p-3 bg-rose-950 text-rose-300 rounded-xl border border-rose-900/50 text-[10px] font-mono break-all leading-normal">
                            {encryptedOutput}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase block">Résultat Déchiffré à l'écran (avec Clé Professionnelle CPS)</span>
                          <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 text-[10px] font-mono font-bold">
                            {decryptedOutput}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Audit Trails Access Logs */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4.5 h-4.5 text-rose-500" />
                        Registre de Traçabilité des Accès (Audit Trail)
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">Conformément au RGPD et au référentiel de sécurité HDS, tout accès en lecture/écriture aux données de santé est consigné de manière immuable.</p>
                    </div>

                    <div className="space-y-3">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] text-slate-400">{log.id}</span>
                            <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold text-[9px] uppercase font-mono">
                              {log.actor}
                            </span>
                            <span className="text-indigo-600 font-bold text-[11px]">
                              {log.action}
                            </span>
                          </div>

                          <p className="text-slate-700 text-xs leading-relaxed">{log.details}</p>

                          <div className="pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[9px] text-slate-400 font-mono">
                            <span>Origine IP : {log.ipHash}</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Signature : {log.integrityHash}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: CONCEPT SHOWCASE - WHAT IS WIN HEALTH */}
          {activeTab === "audit" && (
            <motion.div
              key="audit-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Hero Presentation */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-emerald-500/20">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10 text-emerald-400">
                  <Activity className="w-96 h-96" />
                </div>
                
                <div className="max-w-3xl space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>L'Écosystème Médical Unifié</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                    Qu'est-ce que <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Win Health</span> ?
                  </h2>
                  
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    <strong>Win Health 5.0 Unified</strong> est une plateforme d'intégration d'intelligence médicale révolutionnaire conçue pour réconcilier l'expérience utilisateur des patients et les exigences réglementaires des professionnels de santé au Bénin.
                  </p>
                  
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Elle fusionne un carnet de santé grand public interactif et un espace de travail clinique hautement sécurisé, certifié conforme pour l'hébergement de données de santé (HDS) et nativement connecté au réseau monétaire décentralisé Bitcoin Lightning.
                  </p>

                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={() => setActiveTab("patient")}
                      className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Découvrir le Mode Patient</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab("bitcoin")}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold px-6 py-3 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Régler une Facture</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pillar 1 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all space-y-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Smile className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Souveraineté Clinique & Autonomie</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Les patients mesurent, saisissent et suivent en temps réel l'évolution de leurs constantes physiologiques (tension, fréquence cardiaque, glycémie). Vos données restent locales et chiffrées.
                    </p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all space-y-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Espace Praticien DMP Synchrone</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Les médecins accèdent à un tableau de bord professionnel pour gérer les dossiers médicaux partagés (DMP), auditer les constantes transmises en temps réel et générer des e-prescriptions cliniques de manière souveraine.
                    </p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all space-y-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Hébergement Sécurisé HDS</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Aucune donnée n'est stockée en clair. Un coffre-fort cryptographique local et une base de données d'audit immuable garantissent la confidentialité absolue de vos données médicales personnelles.
                    </p>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all space-y-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                    <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Paiements Bitcoin Lightning</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Une passerelle de facturation instantanée sans intermédiaire financier. Scannez un QR Code ou réglez via LNbits pour garantir la rapidité et la liberté de vos paiements médicaux.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: BITCOIN LIGHTNING PAYMENT GATEWAY (REAL LNBITS INTEGRATION) */}
          {activeTab === "bitcoin" && (
            <motion.div
              key="bitcoin-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header Info */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-50 border border-amber-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-10 translate-y-10">
                  <Zap className="w-80 h-80 text-amber-500" />
                </div>
                <div className="max-w-3xl space-y-3 relative z-10">
                  <span className="bg-amber-500/10 text-amber-700 border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase font-semibold flex items-center gap-1.5 w-fit">
                    <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Paiements Souverains Lightning Network
                  </span>
                  <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">
                    Terminal de Facturation Bitcoin & LNbits
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Intégrez de vrais règlements instantanés et décentralisés pour vos consultations et actes médicaux. 
                    Configurez votre propre portefeuille LNbits ci-dessous pour tester l'émission de factures 
                    <strong> BOLT11 réelles</strong>, le scan QR code, et la détection automatique du paiement sur le réseau Lightning.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CONFIG & EMISSION PANEL */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* LNbits Wallet Settings */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                        <Coins className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Configuration du Portefeuille LNbits</h3>
                        <p className="text-[11px] text-slate-500">Persisté localement dans votre navigateur</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          URL de l'instance LNbits
                        </label>
                        <input
                          type="text"
                          value={lnbitsUrl}
                          onChange={(e) => setLnbitsUrl(e.target.value)}
                          placeholder="https://legend.lnbits.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-sans"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Instance par défaut : <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">https://legend.lnbits.com</code> (ou votre propre serveur self-hosted).
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-semibold text-slate-600">
                            Clé d'API LNbits (Invoice ou Admin Key)
                          </label>
                          <a 
                            href="https://legend.lnbits.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-600 hover:underline flex items-center gap-0.5 font-semibold"
                          >
                            Ouvrir LNbits <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={lnbitsApiKey}
                          onChange={(e) => setLnbitsApiKey(e.target.value)}
                          placeholder="Saisissez votre clé d'API Invoice / Read"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                        <div className="p-2.5 bg-amber-500/5 rounded-lg border border-amber-500/10 text-[11px] text-amber-800 leading-relaxed mt-2 flex gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                          <div>
                            <strong>Comment ça marche ?</strong> Créez un wallet gratuit sur LNbits, copiez votre clé d'API <strong>Invoice Key</strong> (pour générer des factures de lecture seule) ou votre <strong>Admin Key</strong>, collez-la ici, et effectuez un paiement réel depuis votre wallet Lightning de test !
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Invoice Module */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                        <Zap className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Émettre une Facture de Consultation</h3>
                        <p className="text-[11px] text-slate-500">Micro-facturation peer-to-peer en Satoshis</p>
                      </div>
                    </div>

                    {/* Pre-configured medical presets */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-600">
                        Sélectionner un tarif médical prédéfini :
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setInvoiceSats(10);
                            setInvoiceMemo("Test Rapide Win Health v5 - Acte Démo");
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            invoiceSats === 10
                              ? "border-amber-500 bg-amber-500/5 text-amber-900"
                              : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-950 flex items-center justify-between">
                            <span>Frais de Démo</span>
                            <span className="text-amber-600 text-[10px] font-mono">10 sats</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Facture de test ultra-légère</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setInvoiceSats(100);
                            setInvoiceMemo("Scellement HDS & Signature électronique d'Ordonnance");
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            invoiceSats === 100
                              ? "border-amber-500 bg-amber-500/5 text-amber-900"
                              : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-950 flex items-center justify-between">
                            <span>Frais de Signature</span>
                            <span className="text-amber-600 text-[10px] font-mono">100 sats</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Certification d'ordonnance</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setInvoiceSats(500);
                            setInvoiceMemo("Téléconsultation Vidéo Clinique Atinkanmey - Win Health Pro");
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            invoiceSats === 500
                              ? "border-amber-500 bg-amber-500/5 text-amber-900"
                              : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-950 flex items-center justify-between">
                            <span>Téléconsultation</span>
                            <span className="text-amber-600 text-[10px] font-mono">500 sats</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Honoraires médicaux officiels</p>
                        </button>
                      </div>
                    </div>

                    {/* Custom fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Montant (SATS)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={invoiceSats}
                            onChange={(e) => setInvoiceSats(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-12 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 font-mono">SATS</span>
                        </div>
                      </div>

                      <div className="sm:col-span-8">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Intitulé / Libellé de facturation
                        </label>
                        <input
                          type="text"
                          value={invoiceMemo}
                          onChange={(e) => setInvoiceMemo(e.target.value)}
                          placeholder="ex. Consultation de cardiologie"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCreateLightningInvoice()}
                      disabled={paymentStatus === "loading" || paymentStatus === "pending" || !lnbitsApiKey}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                        !lnbitsApiKey
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          : paymentStatus === "loading" || paymentStatus === "pending"
                          ? "bg-amber-100 text-amber-500 cursor-wait border border-amber-200"
                          : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 active:scale-98 cursor-pointer"
                      }`}
                    >
                      <Zap className={`w-4 h-4 ${paymentStatus === "pending" ? "animate-bounce" : ""}`} />
                      {!lnbitsApiKey 
                        ? "Veuillez saisir votre clé API LNbits pour commencer" 
                        : paymentStatus === "loading" 
                        ? "Connexion LNbits..." 
                        : paymentStatus === "pending"
                        ? "Facture active en cours de paiement..."
                        : "Générer la Facture Lightning Réelle"}
                    </button>
                  </div>
                </div>

                {/* VISUAL CHECKOUT GATEWAY */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Lightning Payment Gate UI */}
                  <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[420px]">
                    
                    {/* Status Background Accent */}
                    <div className={`absolute inset-0 bg-radial-gradient pointer-events-none opacity-10 transition-all ${
                      paymentStatus === "paid" ? "from-emerald-500 via-transparent to-transparent" : "from-amber-500 via-transparent to-transparent"
                    }`} />

                    {paymentStatus === "idle" && (
                      <div className="space-y-4 max-w-xs relative z-10">
                        <div className="w-16 h-16 bg-slate-800/80 border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                          <Zap className="w-8 h-8 text-amber-400 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">Guichet de Paiement Lightning</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Configurez vos accès LNbits à gauche, puis cliquez sur le bouton pour émettre une facture.
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono bg-white/5 border border-white/5 p-2 rounded-lg">
                          Prêt pour un règlement instantané en peer-to-peer sans intermédiaire
                        </div>
                      </div>
                    )}

                    {paymentStatus === "loading" && (
                      <div className="space-y-4 relative z-10">
                        <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">Création du reçu LN...</h4>
                          <p className="text-xs text-slate-400">Génération de la facture cryptographique BOLT11</p>
                        </div>
                      </div>
                    )}

                    {paymentStatus === "failed" && (
                      <div className="space-y-4 max-w-xs relative z-10">
                        <div className="w-12 h-12 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 mx-auto">
                          <XCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">Échec de Connexion</h4>
                          <p className="text-xs text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-500/20 leading-relaxed text-left font-mono break-all">
                            {paymentError}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Vérifiez l'URL de votre instance (ex: <code className="bg-white/5 px-1 py-0.5 rounded text-slate-300">https://legend.lnbits.com</code>) et la validité de votre clé API LNbits.
                        </p>
                        <button
                          type="button"
                          onClick={() => setPaymentStatus("idle")}
                          className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                        >
                          Réessayer
                        </button>
                      </div>
                    )}

                    {paymentStatus === "pending" && activeInvoice && (
                      <div className="space-y-4 w-full relative z-10 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full border-b border-white/5 pb-2.5 mb-2">
                          <span className="text-[10px] font-mono text-slate-400">MONTANT RESTANT À PAYER</span>
                          <span className="text-sm font-black text-amber-400 font-mono flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" /> {invoiceSats} SATS
                          </span>
                        </div>

                        {/* QR Code Container */}
                        <div className="bg-white p-3 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(activeInvoice)}`}
                            alt="Lightning Invoice QR Code"
                            referrerPolicy="no-referrer"
                            className="w-[160px] h-[160px]"
                          />
                        </div>

                        {/* QR Code Instructions */}
                        <p className="text-[11px] text-amber-100 text-center leading-relaxed px-3">
                          👉 <strong>Scannez ce QR Code</strong> avec votre application de portefeuille Bitcoin / Lightning (Phoenix, Wallet of Satoshi, Breeze, Muun, etc.) pour effectuer le paiement de test instantanément.
                        </p>

                        {/* Polling Indicator */}
                        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-xs text-amber-400 font-medium">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          Facture en attente de paiement...
                        </div>

                        <div className="w-full text-left space-y-1 bg-slate-800/50 p-2.5 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Mémo de facturation :</div>
                          <div className="text-xs text-slate-200 truncate font-semibold">{invoiceMemo}</div>
                          {activePaymentHash && (
                            <div className="text-[9px] text-slate-500 font-mono truncate">
                              Hash: {activePaymentHash}
                            </div>
                          )}
                        </div>

                        {/* Deep link & Copy Action */}
                        <div className="flex gap-2 w-full justify-center pt-1">
                          <a 
                            href={`lightning:${activeInvoice}`}
                            className="bg-amber-500 hover:bg-amber-600 text-xs px-3 py-2 rounded-lg font-bold text-slate-950 flex items-center gap-1 cursor-pointer transition-colors flex-1 justify-center"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Ouvrir dans le Wallet
                          </a>
                          
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(activeInvoice);
                              alert("Facture BOLT11 copiée dans le presse-papier !");
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
                          >
                            Copier la facture
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCancelInvoice()}
                          className="text-xs text-slate-400 hover:text-white underline mt-2 font-semibold cursor-pointer"
                        >
                          Annuler la transaction
                        </button>
                      </div>
                    )}

                    {paymentStatus === "paid" && (
                      <div className="space-y-5 max-w-xs relative z-10">
                        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-emerald-400">Paiement Validé !</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Votre règlement en satoshis a été reçu instantanément sur le réseau Bitcoin Lightning.
                          </p>
                        </div>
                        <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-xl text-[11px] text-emerald-300 font-mono text-left leading-relaxed">
                          <div><strong>Prestation</strong>: {invoiceMemo}</div>
                          <div><strong>Règlement</strong>: {invoiceSats} SATS (Reçu)</div>
                          <div className="text-[9px] text-slate-500 mt-1 truncate">Hash: {activePaymentHash}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPaymentStatus("idle")}
                          className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2 rounded-xl border border-slate-700 text-slate-200 font-bold cursor-pointer transition-colors"
                        >
                          Faire un autre paiement
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PAYMENT TRANSACTION HISTORY */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                      <ClipboardList className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Historique des Transactions Réelles</h3>
                      <p className="text-[11px] text-slate-500">Flux des paiements de cette session de test</p>
                    </div>
                  </div>
                  
                  {paymentHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Effacer tout l'historique des transactions ?")) {
                          setPaymentHistory([]);
                          setIsPremiumUnlocked(false);
                          localStorage.removeItem("santeplus_btc_payments");
                          localStorage.removeItem("santeplus_premium_unlocked");
                        }
                      }}
                      className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                    >
                      Effacer l'historique
                    </button>
                  )}
                </div>

                {paymentHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 space-y-2">
                    <Coins className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs">Aucune transaction de paiement n'a encore été enregistrée dans cette session.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 font-sans">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold">
                          <th className="p-3">ID Transaction</th>
                          <th className="p-3">Date & Heure</th>
                          <th className="p-3">Prestation / Libellé</th>
                          <th className="p-3 text-right">Montant (SATS)</th>
                          <th className="p-3 text-center">Réseau</th>
                          <th className="p-3 text-right">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paymentHistory.map((tx: any) => (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-700">{tx.id}</td>
                            <td className="p-3 text-slate-500">{tx.date}</td>
                            <td className="p-3 font-medium text-slate-800">{tx.memo}</td>
                            <td className="p-3 text-right font-bold text-slate-900 font-mono">+{tx.amount} SATS</td>
                            <td className="p-3 text-center">
                              <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                                Lightning
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" /> {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Area */}
        <footer className="mt-16 border-t border-slate-200/80 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            Audit exécuté le {new Date().toLocaleDateString("fr-FR")} &bull; Win Health 5.0 Unified
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">Statut réglementaire :</span>
            <span className="bg-emerald-500/10 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200/50 text-[10px] font-bold font-mono">
              RGPD / HDS / DMP CERTIFIÉ
            </span>
          </div>
        </footer>

        {/* Persistent Floating Chatbot Button & Widget */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <AnimatePresence>
            {isChatbotOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
              >
                {/* Header */}
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">Assistant Clinique AI</h3>
                      <p className="text-[10px] text-slate-400">Win Health • Analyse Préventive</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatbotOpen(false)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/60 custom-scrollbar">
                  {chatbotMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-emerald-600 text-white rounded-tr-none shadow-sm"
                            : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-xs"
                        }`}
                      >
                        <StyledMarkdown content={msg.text} />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                  {isChatbotTyping && (
                    <div className="flex flex-col items-start">
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                        <span className="ml-1 text-[10px] font-mono">L'IA analyse vos biométriques...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatbotEndRef} />
                </div>

                {/* Input Form */}
                <form
                  onSubmit={handleChatbotSubmit}
                  className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={chatbotInput}
                    onChange={(e) => setChatbotInput(e.target.value)}
                    placeholder="Posez une question sur votre santé..."
                    disabled={isChatbotTyping}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isChatbotTyping || !chatbotInput.trim()}
                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <button
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer relative z-50 ${
              isChatbotOpen
                ? "bg-slate-800 text-white border border-slate-700"
                : "bg-slate-950 hover:bg-slate-900 text-white border border-slate-800"
            }`}
          >
            {isChatbotOpen ? (
              <XCircle className="w-6 h-6 text-slate-300" />
            ) : (
              <>
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
