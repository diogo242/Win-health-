import React, { useState } from 'react';
import { User, Shield, Activity, Calendar, Phone, Mail, ArrowRight, Stethoscope, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { UserType, PatientProfile, DoctorProfile } from '../types';

interface AuthScreenProps {
  onLoginPatient: (profile: PatientProfile) => void;
  onLoginDoctor: (profile: DoctorProfile) => void;
}

export default function AuthScreen({ onLoginPatient, onLoginDoctor }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<UserType>('patient');
  
  // Patient fields
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('+229 ');
  const [patientBloodGroup, setPatientBloodGroup] = useState('A+');
  const [patientBirthDate, setPatientBirthDate] = useState('');

  // Doctor fields
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorRpps, setDoctorRpps] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginPatient({
      firstName: patientFirstName || 'Jean',
      lastName: patientLastName || 'Dupont',
      email: patientEmail || 'jean.dupont@gmail.com',
      phone: patientPhone || '+229 97 00 00 01',
      bloodGroup: patientBloodGroup || 'A+',
      birthDate: patientBirthDate || '1980-01-01'
    });
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginDoctor({
      fullName: doctorName || 'Dr. Sophie Martin',
      specialty: doctorSpecialty || 'Cardiologue',
      email: doctorEmail || 'dr.martin@winhealth.pro',
      rpps: doctorRpps || '10100984021'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Left Side: Branding / Concept */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 opacity-10">
            <Shield className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold font-display tracking-tight">Win Health <span className="opacity-80 font-mono text-sm">5.0</span></h1>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black font-display leading-tight mt-8">
              La plateforme santé<br/>qui respecte votre<br/>souveraineté.
            </h2>
            
            <p className="text-emerald-50 text-sm leading-relaxed mt-4">
              Un dossier médical décentralisé, protégé par cryptographie HDS, et accessible uniquement avec votre consentement explicite via QR code.
            </p>
          </div>

          <div className="relative z-10 mt-12 space-y-4">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <Lock className="w-5 h-5 text-emerald-300" />
              <div className="text-sm">
                <p className="font-semibold text-white">Chiffrement de bout en bout</p>
                <p className="text-emerald-100 text-xs">Vos données vous appartiennent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="p-8 sm:p-12 bg-white">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8 border border-slate-200/50">
            <button
              onClick={() => setActiveTab('patient')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'patient'
                  ? "bg-white text-emerald-700 shadow-sm border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <User className="w-4 h-4" /> Patient
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'doctor'
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Stethoscope className="w-4 h-4" /> Médecin
            </button>
          </div>

          {activeTab === 'patient' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 font-display">Initialiser votre Profil</h3>
                <p className="text-sm text-slate-500 mt-1">Créez votre dossier médical sécurisé et certifié localement.</p>
              </div>

              <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={patientFirstName} onChange={e => setPatientFirstName(e.target.value)} required placeholder="Jean" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={patientLastName} onChange={e => setPatientLastName(e.target.value)} required placeholder="Dupont" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Adresse Gmail / Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} required placeholder="jean.dupont@gmail.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} required placeholder="+229 97000001" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Groupe Sanguin</label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select value={patientBloodGroup} onChange={e => setPatientBloodGroup(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none">
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Date de Naissance</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input type="date" value={patientBirthDate} onChange={e => setPatientBirthDate(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-4 cursor-pointer">
                  <span>Générer mon dossier médical</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'doctor' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 font-display">Portail Praticien (HDS)</h3>
                <p className="text-sm text-slate-500 mt-1">Accédez à votre espace professionnel de santé certifié.</p>
              </div>

              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Nom complet</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={doctorName} onChange={e => setDoctorName(e.target.value)} required placeholder="Dr. Sophie Martin" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Spécialité</label>
                    <input type="text" value={doctorSpecialty} onChange={e => setDoctorSpecialty(e.target.value)} required placeholder="Cardiologue" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">N° RPPS / CPS</label>
                    <input type="text" value={doctorRpps} onChange={e => setDoctorRpps(e.target.value)} required placeholder="10100984021" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Email Professionnel</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={doctorEmail} onChange={e => setDoctorEmail(e.target.value)} required placeholder="dr.martin@winhealth.pro" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="password" value={doctorPassword} onChange={e => setDoctorPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-4 cursor-pointer">
                  <span>Connexion Sécurisée</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
