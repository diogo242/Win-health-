import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Initialize Gemini API client lazily to avoid startup crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Pre-defined static audit & comparative intelligence for Santé 5.0 and MTN Win Health Pro
const PRESET_COMPARISON_DATA = {
  sante50: {
    id: "sante50",
    name: "Santé 5.0",
    url: "https://sant-5-0.onrender.com",
    role: "Patient-Centric Health Companion & Wellness Portal",
    tagline: "Consumer-focused digital health hub with interactive lifestyle trackers.",
    scores: {
      performance: 82,
      ux: 91,
      seo: 78,
      security: 65,
      professionalUtility: 40,
    },
    pros: [
      "Intuitive, consumer-grade user interface with modern interactive charts",
      "Robust personal lifestyle logging (hydration, sleep, activity, mood)",
      "Excellent client-side responsive adaptation for mobile devices",
      "Interactive symptom visualizer and patient journal",
    ],
    cons: [
      "Lacks secure, structured patient medical record (EHR/DMP) compliance",
      "No direct online calendar synchronizing for professional medical agendas",
      "Absence of certified HDS (Hébergement de Données de Santé) compliant hosting framework",
      "No capability for generating secured, legally binding electronic prescriptions",
    ],
    techStack: ["React 18", "Tailwind CSS", "Local Storage State", "Client Charts", "Framer Motion"],
  },
  santePlusPro: {
    id: "santePlusPro",
    name: "MTN Win Health Pro",
    url: "https://santepluspro.onrender.com/",
    role: "Professional Medical EHR & Agenda Portal",
    tagline: "High-compliance workspace built for medical practitioners and clinics.",
    scores: {
      performance: 74,
      ux: 68,
      seo: 72,
      security: 90,
      professionalUtility: 92,
    },
    pros: [
      "Highly structured electronic health records (EHR) with patient history indexing",
      "Practitioner-side shared calendar supporting multi-resource bookings and SMS reminders",
      "HDS-aligned architecture securing clinical notes, diagnoses, and allergies datasets",
      "Secure e-prescription generation with automated ICD-10 code referencing",
    ],
    cons: [
      "Dull, complex user experience requiring learning curves for patients",
      "Lacks patient-side self-management metrics, fitness integration, or wellness tracking",
      "No interactive dashboard or visual metrics showing historical wellness progress",
      "SEO & loading performance is slower due to heavy compliance validation protocols",
    ],
    techStack: ["NodeJS / Express", "Relational Database", "Secure Session Handlers", "PDF Generation Service", "Ameli API Bindings"],
  }
};

async function startServer() {
  const app = express();
  
  app.use(express.json());

  // API route to retrieve static comparative data
  app.get("/api/presets", (req, res) => {
    res.json(PRESET_COMPARISON_DATA);
  });

  // API route to create an LNbits Lightning Invoice (real proxy)
  app.post("/api/lnbits/create-invoice", async (req, res) => {
    try {
      const { amount, memo, customApiKey, customUrl } = req.body;
      
      // Prioritize client-provided credentials from the UI, fallback to server process.env
      const apiKey = customApiKey || process.env.LNBITS_API_KEY;
      const baseUrl = customUrl || process.env.LNBITS_URL || "https://legend.lnbits.com";
      
      if (!apiKey) {
        return res.status(400).json({ 
          error: "Clé API LNbits manquante. Veuillez la configurer dans l'onglet Intégration de Paiement LNbits." 
        });
      }

      // Format clean URL
      const cleanUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      const endpoint = `${cleanUrl}/api/v1/payments`;

      console.log(`[LNbits] Création de facture sur ${endpoint} d'un montant de ${amount} SATS...`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          out: false,
          amount: parseInt(amount) || 10,
          memo: memo || "Consultation médicale MTN Win Health",
          expiry: 3600
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[LNbits] Erreur lors de la création de la facture:", errorText);
        throw new Error(`LNbits API a répondu avec le statut ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("[LNbits] Exception lors de la création de facture:", error);
      res.status(500).json({ error: error.message || "Erreur lors de l'appel à l'API LNbits." });
    }
  });

  // API route to check an LNbits invoice payment status (real proxy)
  app.post("/api/lnbits/check-invoice", async (req, res) => {
    try {
      const { paymentHash, customApiKey, customUrl } = req.body;
      
      const apiKey = customApiKey || process.env.LNBITS_API_KEY;
      const baseUrl = customUrl || process.env.LNBITS_URL || "https://legend.lnbits.com";
      
      if (!apiKey) {
        return res.status(400).json({ error: "Clé API LNbits manquante." });
      }
      if (!paymentHash) {
        return res.status(400).json({ error: "Payment Hash manquant." });
      }

      const cleanUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      const endpoint = `${cleanUrl}/api/v1/payments/${paymentHash}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LNbits API a répondu avec le statut ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("[LNbits] Exception lors de la vérification de facture:", error);
      res.status(500).json({ error: error.message || "Erreur de connexion avec l'API de vérification LNbits." });
    }
  });

  // API route for AI health coach assistant (patient-facing)
  app.post("/api/health-coach", async (req, res) => {
    try {
      const { biometrics, symptoms, question } = req.body;
      const ai = getAiClient();

      const prompt = `You are an expert AI clinical health coach trained to analyze biometric telemetry and guide patients with preventative and supportive advice.
Analyze the following patient biometric records and clinical context:
- Tension Artérielle (BP): ${biometrics.systolic}/${biometrics.diastolic} mmHg
- Fréquence Cardiaque (Heart Rate): ${biometrics.heartRate} bpm
- Glycémie (Blood Glucose): ${biometrics.glucose} g/L
- Hydratation: ${biometrics.hydration} L/jour
- Heures de Sommeil (Sleep): ${biometrics.sleep} h/nuit
- Humeur (Mood): ${biometrics.mood}/10
- Symptômes déclarés: ${symptoms || "Aucun symptôme déclaré."}

Patient's direct inquiry: "${question || "Fournir une analyse globale de mes constantes de santé et des recommandations bien-être."}"

Provide a highly structured, clinically precise response in elegant French:
1. **Évaluation Biométrique Rapide** : Classifiez chaque constante (ex: Normotendu, Glycémie stable, Légère déshydratation, etc.).
2. **Analyse Systémique** : Expliquez comment les constantes et les symptômes interagissent de manière simple mais scientifiquement juste.
3. **Plan de Prévention & Conseils Hygiéno-Diététiques** : Donnez 3 actions concrètes à mener immédiatement (nutrition, hydratation, repos).
4. **Indicateurs de Vigilance Médicale** : Spécifiez dans quel cas précis un médecin traitant doit être consulté.
Avertissement légal clair : Cette analyse est un accompagnement préventif et ne remplace pas une consultation médicale. No formatting errors, use beautiful markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an empathetic, highly specialized preventive medicine and digital therapeutics counselor. You speak perfect French, avoiding complex jargon but maintaining absolute clinical accuracy.",
          temperature: 0.2,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Health coach error:", error);
      res.status(500).json({ error: error.message || "Failed to process health coach request." });
    }
  });

  // API route for secure clinical prescription audits (practitioner-facing)
  app.post("/api/audit-prescription", async (req, res) => {
    try {
      const { drugs, patientAllergies, patientHistory } = req.body;
      const ai = getAiClient();

      const prompt = `You are a chief clinical pharmacologist and safety auditor. Audit this proposed medical prescription for critical safety, drug-to-drug interactions, contraindications, and regulatory guidelines (ANSM compliance).

Patient Clinical Context:
- Allergies connues: ${patientAllergies || "Aucune allergie déclarée"}
- Antécédents médicaux / Historique: ${patientHistory || "Aucun antécédent déclaré"}

Proposed Prescription Items:
${JSON.stringify(drugs, null, 2)}

Provide a strict, professional, and exhaustive safety audit in French:
1. **Dépistage des Interactions Médicamenteuses (DDI)** : Identifiez de manière catégorique toute interaction nocive ou synergique indésirable entre les substances proposées.
2. **Vérification des Contre-indications & Allergies** : Vérifiez s'il y a incompatibilité majeure avec les allergies ou antécédents saisis.
3. **Contrôle des Posologies & Fréquences** : Évaluez si les dosages et fréquences de prise sont conformes aux référentiels cliniques.
4. **Classification CIM-10 Recommandée** : Suggérez les codes diagnostiques officiels correspondants (ex: I10, E11).
5. **Verdict d'Approbation Clinique** : Rédigez un court paragraphe de validation ou d'alerte critique exigeant révision immédiate (ex: ALERTE ROUGE, VALIDÉ SOUS SURVEILLANCE, APPROUVÉ).
Provide absolute technical clarity without generic fluff. Use beautiful markdown tables if appropriate.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an advanced clinical pharmacologist and medical portal safety compliance auditor. You write precise, high-density, authoritative clinical reviews in French.",
          temperature: 0.1,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Prescription audit error:", error);
      res.status(500).json({ error: error.message || "Failed to audit prescription." });
    }
  });

  // API route for AI-powered feature integration or custom audit questions
  app.post("/api/analyze", async (req, res) => {
    try {
      const { prompt, option, targetPlatform } = req.body;
      
      let systemInstruction = `You are an expert full-stack web architect and healthcare technology compliance consultant specializing in European medical portals (GDPR & HDS compliance). 
  You are analyzing two platforms:
  1. Santé 5.0 (Patient companion, sleek client interface, excellent UX, lacks professional modules and HDS compliance).
  2. MTN Win Health Pro (Professional practitioner workspace, rich EHR, medical agenda booking, secure prescription systems, high compliance, but complex UX and low patient engagement).

  Your task is to provide the user with clear, optimal, and concrete web development architecture solutions, database schemas, or feature integration paths.
  Format your responses using clean Markdown, focusing on actual structural files, DB schemas, or API endpoints.
  Do not use generic fluff. Provide technical clarity. Use clear, objective language.`;

      let userPrompt = prompt || "";
      
      if (option === "integration_plan") {
        if (targetPlatform === "sante50") {
          userPrompt = `Generate a detailed React & Express code architecture and step-by-step roadmap to integrate MTN Win Health Pro's PROFESSIONAL BOOKING & AGENDA system into the sleek, patient-centric Santé 5.0 platform.
  Include:
  1. A simplified Prisma or relational DB schema for patient-doctor appointments.
  2. A secure Express API endpoint in TypeScript to handle bookings with HDS encryption checks.
  3. A beautiful React component code block (Tailwind CSS) for the patient-side booking scheduler.
  4. Compliance recommendations for HDS (Hébergement de Données de Santé) and GDPR.`;
        } else {
          userPrompt = `Generate a detailed React & Express code architecture and step-by-step roadmap to integrate Santé 5.0's PATIENT WELLNESS & HEALTH METRICS TRACKER into the clinical MTN Win Health Pro dashboard.
  Include:
  1. A database schema to log biometric metrics (heart rate, blood pressure, blood glucose, sleep, mood) over time.
  2. An Express backend endpoint in TypeScript with safety boundary filters to ingest patient telemetry.
  3. A React chart component skeleton using Recharts to visualize this biometric telemetry inside MTN Win Health Pro's patient history tab.
  4. A strategy to securely share client-side logs with the doctor's EHR system while adhering to HIPAA/GDPR rules.`;
        }
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI insights." });
    }
  });

  // Serve frontend assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the Express fullstack server:", error);
});
