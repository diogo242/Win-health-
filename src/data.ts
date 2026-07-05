import { MetricDetail } from "./types";

export const METRIC_DETAILS: MetricDetail[] = [
  {
    key: "ux",
    name: "Expérience Patient & UX/UI",
    description: "Évalue la fluidité de navigation, la clarté visuelle, la facilité de prise de rendez-vous et l'adaptabilité sur les appareils mobiles.",
    sante50Description: "Exceptionnelle (91/100). Interface moderne inspirée du grand public. Graphiques fluides, journalisation bienveillante, et courbe d'apprentissage quasi nulle. Très engageant sur mobile.",
    santePlusProDescription: "Moyenne (68/100). Visuellement austère et clinique. Parcours patient complexe. Formulaires denses et peu engageants, axés sur la saisie de données administratives rigides."
  },
  {
    key: "professionalUtility",
    name: "Utilité Professionnelle & DMP",
    description: "Évalue l'intégration avec le Dossier Médical Partagé (DMP), la saisie d'ordonnances sécurisées, la facturation SESAM-VITALE et la gestion d'agendas complexes.",
    sante50Description: "Très faible (40/100). Pas de module médecin officiel. Impossible de facturer, de générer des ordonnances valides avec codes CIP/UCD, ou de gérer un cabinet multi-praticiens.",
    santePlusProDescription: "Excellente (92/100). Véritable outil métier. Intègre un agenda synchrone complexe avec rappels SMS automatiques, historique clinique exhaustif, classification CIM-10, et gestion de flux de prescriptions."
  },
  {
    key: "security",
    name: "Sécurité & Conformité Réglementaire",
    description: "Conformité avec les exigences RGPD, l'hébergement certifié HDS (Hébergement de Données de Santé) et le chiffrement de bout en bout des dossiers.",
    sante50Description: "Insuffisante (65/100). Stockage local-first ou sur cloud standard. Manque de certification HDS et de mécanismes d'authentification forte obligatoire (ex. Pro Santé Connect) pour les praticiens.",
    santePlusProDescription: "Robuste (90/100). Entièrement hébergé sur des serveurs agréés HDS. Chiffrement au repos et en transit, journalisation stricte des accès de consultation clinique, et politique de consentement explicite."
  },
  {
    key: "performance",
    name: "Optimisation & Performance Technique",
    description: "Vitesse de chargement initial, taille des bundles JavaScript, réactivité sous faible bande passante (3G/4G) et scores de Core Web Vitals.",
    sante50Description: "Bonne (82/100). Client léger React, chargement rapide et transitions animées instantanées. Cependant, l'accumulation de visualisations graphiques lourdes peut ralentir les terminaux d'entrée de gamme.",
    santePlusProDescription: "Passable (74/100). Temps de chargement initial plus lourd dû à des scripts de sécurité de conformité et des vérifications d'intégrité côté serveur. Navigation parfois saccadée lors du chargement d'historiques denses."
  },
  {
    key: "seo",
    name: "Référencement & SEO Médical",
    description: "Structure sémantique du code HTML, balisage Schema.org pour les professionnels de santé, indexabilité par les moteurs de recherche et temps de réponse serveur (TTFB).",
    sante50Description: "Moyenne (78/100). Excellente sémantique de base, mais manque de données structurées enrichies de type 'MedicalBusiness' ou 'Physician' pour le référencement local des praticiens.",
    santePlusProDescription: "Correcte (72/100). Présence de balises méta fonctionnelles, mais l'accès restreint derrière une barrière de connexion (loginwall) limite l'indexation de la majeure partie des pages de spécialités."
  }
];

export const INTEGRATION_TEMPLATES = {
  sante50_booking: {
    title: "Intégrer l'Agenda de Win Health Pro dans Santé 5.0",
    description: "Comment injecter un calendrier de prise de rendez-vous médical conforme, synchronisé et sécurisé, au sein de l'interface fluide de Santé 5.0.",
    recommendation: "Recommandé pour Santé 5.0 afin de capter l'adhésion des cabinets de médecins professionnels tout en conservant l'expérience fluide adorée des patients."
  },
  santePlusPro_wellness: {
    title: "Intégrer les Outils Biométriques de Santé 5.0 dans Win Health Pro",
    description: "Comment ajouter un flux de suivi continu du patient (télésurveillance des constantes vitales, sommeil, hydratation) directement visualisable par le médecin dans Win Health Pro.",
    recommendation: "Recommandé pour Win Health Pro pour transformer un outil de gestion administrative froid en un espace interactif de prévention active et d'engagement de santé."
  }
};
