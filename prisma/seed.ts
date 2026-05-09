import { AiRequestStatus, AiRequestType, PrismaClient, SessionStatus } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const DEMO_EMAIL = "claire.martin@theraflow.demo";
const DEMO_PASSWORD = "NaturopathieDemo2026!";

const demoClients = [
  {
    pseudonym: "NAT-2022-001",
    firstName: "Elise",
    lastName: "Renaud",
    email: "elise.renaud@example.test",
    phone: "+41 79 111 22 01",
    address: "Rue du Lac 12, 1006 Lausanne",
    birthDate: "1985-03-14",
    adminNotes: "Suivi regulier depuis 2022. Prefere les rendez-vous du mardi matin.",
    anamnesis: {
      consultationReason: "Fatigue chronique et digestion lente apres une periode professionnelle intense.",
      mainGoal: "Retrouver une energie stable sur la journee et limiter les ballonnements.",
      personalHistory: "Terrain anxieux modere, rythme de travail soutenu, deux grossesses sans complication.",
      medicalHistory: "Bilan medical recent sans pathologie signalee. Ferritine basse surveillee par le medecin.",
      currentTreatments: "Suivi medical annuel, physiotherapie ponctuelle pour tensions cervicales.",
      medicationSupplements: "Magnesium le soir, vitamine D en hiver.",
      allergies: "Aucune allergie alimentaire connue.",
      sleep: "Endormissement rapide mais reveils vers 4h30 lors des periodes chargees.",
      nutrition: "Alimentation maison, tendance a sauter le petit-dejeuner.",
      stress: "Stress eleve lors des livraisons projet, respiration courte.",
      physicalActivity: "Marche 2 fois par semaine, yoga irregulier.",
      painSymptoms: "Tensions nuque-epaules, lourdeur digestive post-repas.",
      dominantEmotions: "Inquietude, frustration de ne pas recuperer assez vite.",
      lifeEvents: "Changement de poste en 2022, reprise a 80%.",
      dailyHabits: "Cafe 3 tasses par jour, hydratation insuffisante.",
      familyContext: "Vit avec son conjoint et deux enfants.",
      professionalContext: "Cheffe de projet dans une agence digitale.",
      expectations: "Conseils concrets, faciles a tenir avec un agenda dense.",
      contraindications: "Pas de jeune strict. Orientation medicale si aggravation fatigue.",
      warningSignals: "Perte de poids involontaire, douleur abdominale persistante, fatigue invalidante.",
      shortTermGoals: "Stabiliser les repas et introduire une routine de recuperation.",
      mediumTermGoals: "Reduire les pics de fatigue et mieux anticiper les periodes de stress.",
      freeNotes: "Bonne adherence quand les actions restent simples et mesurees."
    },
    sessions: [
      ["2022-02-08", "Premiere consultation", "Cartographier fatigue, digestion et rythme de vie.", "Arrive epuisee, esprit tres actif.", "Anamnese complete, journal alimentaire sur 7 jours, conseils hydratation et petit-dejeuner proteine.", "Soulagement d'avoir une feuille de route claire.", "Journal energie/digestion, tisane fenouil-melisse apres repas.", "Qualite du sommeil et tolerance petit-dejeuner.", "Ajuster apres lecture du journal."],
      ["2022-03-15", "Suivi naturopathie", "Evaluer digestion et niveau d'energie.", "Moins de ballonnements, fatigue encore marquee a 16h.", "Reequilibrage collations, respiration coherente 5 minutes, reduction progressive cafe.", "Motivation bonne, craint de perdre le rythme.", "Collation noix-fruit, pause respiration avant reunion.", "Reveils nocturnes.", "Introduire rituel du soir."],
      ["2022-06-07", "Suivi naturopathie", "Consolider les routines et prevenir rechute.", "Energie plus stable, sommeil fragile avant deadlines.", "Plan anti-surcharge, bain de pieds magnesium, priorisation des repas simples.", "Se sent plus autonome.", "Routine soir 20 minutes sans ecran.", "Charge mentale familiale.", "Point dans 8 semaines."],
      ["2023-01-24", "Bilan saisonnier", "Adapter l'accompagnement a l'hiver.", "Fatigue revenue apres infections familiales.", "Soutien micronutritionnel a valider avec medecin, bouillons, exposition lumiere matin.", "Rassuree par approche prudente.", "Marche lumiere 15 minutes, menu soupe-legumineuses.", "Resultats bilan fer.", "Revoir apres bilan medical."],
      ["2023-11-21", "Suivi naturopathie", "Preparer periode de fin d'annee.", "Meilleure recuperation, stress anticipe.", "Plan de prevention: repas de secours, limites agenda, respiration avant sommeil.", "Engagement fort.", "Deux soirees sans ordinateur par semaine.", "Maintien cafe a 1-2 tasses.", "Bilan annuel."],
      ["2025-04-10", "Bilan annuel", "Faire le point apres deux ans de suivi.", "Etat global stable, souhaite travailler vitalite sportive.", "Ajustement proteines, reprise yoga, suivi cycle/energie.", "Enthousiaste, veut eviter les exces.", "Yoga doux 2x/semaine, suivi energie cycle.", "Tensions cervicales.", "Controle dans 3 mois."]
    ]
  },
  {
    pseudonym: "NAT-2022-002",
    firstName: "Marc",
    lastName: "Duval",
    email: "marc.duval@example.test",
    phone: "+41 78 222 14 02",
    address: "Avenue de Morges 44, 1004 Lausanne",
    birthDate: "1976-09-02",
    adminNotes: "Consultations souvent en fin de journee. Tres demandeur d'explications physiologiques.",
    anamnesis: {
      consultationReason: "Troubles digestifs fonctionnels et reflux occasionnel.",
      mainGoal: "Identifier les declencheurs alimentaires et retrouver confort apres les repas.",
      personalHistory: "Repas rapides depuis plusieurs annees, nombreux deplacements.",
      medicalHistory: "Gastroscopie ancienne rassurante selon le client; suivi medical si reflux persistant.",
      currentTreatments: "Anti-acide ponctuel prescrit par medecin.",
      medicationSupplements: "Probiotiques par periodes.",
      allergies: "Intolerance subjective aux repas tres gras.",
      sleep: "Sommeil correct, couche tard.",
      nutrition: "Repas de midi pris a l'exterieur, diner tardif.",
      stress: "Stress professionnel important, mange vite.",
      physicalActivity: "Velo le week-end.",
      painSymptoms: "Brulures retrosternales ponctuelles, ballonnements.",
      dominantEmotions: "Impatience, envie de comprendre.",
      lifeEvents: "Promotion en 2021 avec plus de voyages.",
      dailyHabits: "Cafe apres chaque repas, alcool social le vendredi.",
      familyContext: "Deux adolescents a la maison.",
      professionalContext: "Responsable commercial regional.",
      expectations: "Plan alimentaire realiste sans regime strict.",
      contraindications: "Reflux nocturne intense ou douleur thoracique: avis medical immediat.",
      warningSignals: "Dysphagie, sang, amaigrissement, douleurs thoraciques.",
      shortTermGoals: "Ralentir les repas et reperer trois declencheurs.",
      mediumTermGoals: "Stabiliser le confort digestif en deplacement.",
      freeNotes: "Fonctionne bien avec des tableaux de suivi."
    },
    sessions: [
      ["2022-04-12", "Premiere consultation", "Comprendre reflux et habitudes de repas.", "Tendu, digestion inconfortable 4 jours sur 7.", "Journal symptomes, hygiene repas, diner avance quand possible.", "Interesse par suivi precis.", "Noter horaires, cafe, alcool, symptomes.", "Frequence reflux nocturne.", "Bilan dans 4 semaines."],
      ["2022-05-17", "Suivi digestif", "Analyser declencheurs.", "Moins de reflux avec diner plus tot.", "Identification cafe tardif et repas gras, introduction plantes ameres douces avant repas.", "Surpris par impact vitesse repas.", "20 mastications sur premier tiers du repas.", "Tolerance aux crudites.", "Plan deplacement."],
      ["2022-09-06", "Suivi naturopathie", "Adapter aux voyages.", "Reflux rare, ballonnements en hotel.", "Kit deplacement: petit-dejeuner simple, hydratation, marche post-repas.", "Pragmatique et satisfait.", "Marche 10 min apres diner.", "Gestion repas clients.", "Espacer a 3 mois."],
      ["2023-03-28", "Bilan printemps", "Verifier maintien des acquis.", "Confort bon hors periodes commerciales.", "Plan semaines chargees, limiter cafe apres 14h.", "Adhesion bonne.", "Routine respiration avant repas.", "Stress et grignotage.", "Suivi en juin."],
      ["2024-02-13", "Suivi naturopathie", "Reprise apres episode de reflux.", "Episode apres vacances, inquiet.", "Retour aux bases, orientation medecin si recurrence nocturne.", "Rassure par cadre.", "Journal 14 jours.", "Signaux d'alerte.", "Point rapide dans 6 semaines."]
    ]
  },
  {
    pseudonym: "NAT-2022-003",
    firstName: "Sofia",
    lastName: "Bianchi",
    email: "sofia.bianchi@example.test",
    phone: "+41 76 333 20 03",
    address: "Chemin des Cedres 8, 1009 Pully",
    birthDate: "1992-12-19",
    adminNotes: "Souhaite des supports visuels. Sensible aux formulations trop directives.",
    anamnesis: {
      consultationReason: "Syndrome premenstruel, irritabilite et fatigue cyclique.",
      mainGoal: "Mieux vivre la semaine premenstruelle et comprendre les variations d'energie.",
      personalHistory: "Cycles reguliers, symptomes depuis plusieurs annees.",
      medicalHistory: "Suivi gynecologique a jour selon cliente.",
      currentTreatments: "Aucun traitement hormonal.",
      medicationSupplements: "Omega-3 ponctuels.",
      allergies: "Aucune connue.",
      sleep: "Sommeil plus leger en phase premenstruelle.",
      nutrition: "Envies sucrees avant les regles.",
      stress: "Stress relationnel amplifie en fin de cycle.",
      physicalActivity: "Pilates et marche.",
      painSymptoms: "Crampes legeres, seins sensibles.",
      dominantEmotions: "Irritabilite puis culpabilite.",
      lifeEvents: "Installation en couple recente.",
      dailyHabits: "Travail sur ecran, repas assez reguliers.",
      familyContext: "Vie de couple stable.",
      professionalContext: "Designer independante.",
      expectations: "Se sentir accompagnee sans jugement.",
      contraindications: "Douleurs pelviennes inhabituelles ou saignements importants: avis medical.",
      warningSignals: "Cycle brutalement modifie, douleurs fortes, humeur depressive persistante.",
      shortTermGoals: "Suivre le cycle et soutenir la glycemie.",
      mediumTermGoals: "Adapter activite et agenda selon les phases.",
      freeNotes: "Tres receptive a l'approche cyclique."
    },
    sessions: [
      ["2022-07-05", "Premiere consultation", "Poser les bases du suivi cycle.", "Curieuse, legerement emue.", "Roue du cycle, suivi symptomes, petit-dejeuner proteine.", "Soulagement de normaliser certaines variations.", "Tracker cycle/humeur/energie.", "Sommeil phase luteale.", "Lecture du suivi dans 6 semaines."],
      ["2022-08-23", "Suivi cycle", "Identifier les moments critiques.", "Moins d'envies sucrees, irritabilite J-4.", "Soutien magnesium alimentaire, pauses sensorielles, plan communication couple.", "Se sent actrice.", "Pause 10 minutes en fin d'apres-midi.", "Crampes.", "Ajuster plantes si besoin."],
      ["2023-02-07", "Bilan naturopathie", "Consolider strategie premenstruelle.", "Symptomes reduits de moitie.", "Plan phase luteale: repas chauds, sommeil, charge de travail allegee.", "Tres satisfaite.", "Bloquer une demi-journee calme avant regles.", "Maintien activite physique.", "Controle a l'automne."],
      ["2024-05-21", "Suivi naturopathie", "Reprise apres surcharge pro.", "PMS augmente avec lancement d'activite.", "Routine minimale, respiration, zinc alimentaire, limites clients.", "Reconnait lien stress-cycle.", "Deux soirees sans rendez-vous en J-7/J-1.", "Charge entrepreneuriale.", "Point en 2 mois."]
    ]
  },
  {
    pseudonym: "NAT-2023-004",
    firstName: "Nadia",
    lastName: "Keller",
    email: "nadia.keller@example.test",
    phone: "+41 79 444 33 04",
    address: "Rue Centrale 5, 1800 Vevey",
    birthDate: "1968-05-30",
    adminNotes: "Suivi menopause. Apprecie les comptes rendus detailles.",
    anamnesis: {
      consultationReason: "Bouffees de chaleur, sommeil fragmente, variations d'humeur.",
      mainGoal: "Retrouver un sommeil recuperateur et reduire les bouffees nocturnes.",
      personalHistory: "Menopause installee depuis 18 mois.",
      medicalHistory: "Suivi gynecologique regulier, tension surveillee.",
      currentTreatments: "Traitement antihypertenseur stable.",
      medicationSupplements: "Vitamine D, calcium alimentaire encourage.",
      allergies: "Aucune connue.",
      sleep: "Reveils nocturnes avec chaleur.",
      nutrition: "Alimentation variee, vin le week-end.",
      stress: "Stress familial modere.",
      physicalActivity: "Natation hebdomadaire.",
      painSymptoms: "Raideurs matinales.",
      dominantEmotions: "Lassitude, inquietude de vieillir.",
      lifeEvents: "Depart du dernier enfant du domicile.",
      dailyHabits: "The noir l'apres-midi.",
      familyContext: "Couple stable, parents ages a soutenir.",
      professionalContext: "Enseignante a temps partiel.",
      expectations: "Approche naturelle compatible avec suivi medical.",
      contraindications: "Verifier interactions plantes/traitement. Pas de phyto hormonale sans avis medical.",
      warningSignals: "Saignement post-menopause, douleur thoracique, hypertension inhabituelle.",
      shortTermGoals: "Diminuer excitants et rafraichir routine du soir.",
      mediumTermGoals: "Retrouver confiance corporelle.",
      freeNotes: "Prudence sur complements, coordination medicale."
    },
    sessions: [
      ["2023-01-10", "Premiere consultation", "Evaluer sommeil et bouffees de chaleur.", "Fatigue, demande prudence.", "Journal chaleur/sommeil, hygiene thermique, diner plus leger.", "Rassuree par limites professionnelles.", "Noter alcool, the, reveils.", "Traitement tension.", "Point dans 1 mois."],
      ["2023-02-14", "Suivi menopause", "Reduire reveils nocturnes.", "Reveils moins longs, bouffees encore presentes.", "Respiration rafraichissante, infusion sauge avec verification prudente, marche douce.", "Confiance en hausse.", "Routine chambre fraiche.", "Frequence bouffees.", "Ajuster apres 6 semaines."],
      ["2023-04-04", "Suivi naturopathie", "Stabiliser sommeil.", "Sommeil 6h30 moyen, humeur meilleure.", "Renforcement proteines matin, natation 2x/mois, relaxation.", "Positive.", "Relaxation guidee 12 min.", "Raideurs.", "Controle ete."],
      ["2024-01-16", "Bilan annuel", "Faire le point apres un an.", "Bouffees rares, sommeil sensible au stress.", "Plan parents ages: respiration, limites, repas simples.", "Emue, se sent soutenue.", "Une activite plaisir par semaine.", "Charge aidante.", "Suivi trimestriel."],
      ["2025-09-09", "Suivi naturopathie", "Maintenir equilibre en rentree.", "Bon etat general.", "Ajustements saisonniers, vitamine D via medecin, reprise natation.", "Sereine.", "Natation hebdomadaire.", "Sommeil.", "Bilan hiver."]
    ]
  },
  {
    pseudonym: "NAT-2023-005",
    firstName: "Thomas",
    lastName: "Meyer",
    email: "thomas.meyer@example.test",
    phone: "+41 78 555 44 05",
    address: "Route de Berne 31, 1010 Lausanne",
    birthDate: "1981-01-08",
    adminNotes: "Objectif performance douce. A tendance a trop en faire.",
    anamnesis: {
      consultationReason: "Recuperation sportive lente et sommeil agite.",
      mainGoal: "Optimiser recuperation sans augmenter la charge mentale.",
      personalHistory: "Course a pied depuis 10 ans, pic d'entrainement recent.",
      medicalHistory: "Blessure mollet en 2022, suivi physio termine.",
      currentTreatments: "Aucun.",
      medicationSupplements: "Proteines en poudre occasionnelles.",
      allergies: "Aucune connue.",
      sleep: "Sommeil agite apres entrainements tardifs.",
      nutrition: "Mange sain mais portions parfois insuffisantes.",
      stress: "Stress de performance.",
      physicalActivity: "Course 4x/semaine, renforcement 1x.",
      painSymptoms: "Raideurs mollets, fatigue musculaire.",
      dominantEmotions: "Exigence, impatience.",
      lifeEvents: "Preparation semi-marathon.",
      dailyHabits: "Montre connectee consultee tres souvent.",
      familyContext: "Celibataire.",
      professionalContext: "Ingenieur logiciel.",
      expectations: "Optimisation concrete, mesurable.",
      contraindications: "Douleur persistante ou essoufflement inhabituel: medecin/physio.",
      warningSignals: "Blessure, surmenage, troubles du sommeil prolonges.",
      shortTermGoals: "Mieux manger apres effort et calmer le soir.",
      mediumTermGoals: "Construire une recuperation durable.",
      freeNotes: "Inviter a moins quantifier certains jours."
    },
    sessions: [
      ["2023-03-02", "Premiere consultation", "Analyser charge sportive et recuperation.", "Tres motive, fatigue visible.", "Chronologie entrainement-repas-sommeil, collation recuperation, deconnexion montre.", "Accepte difficilement l'idee de repos.", "Collation dans les 45 min post-effort.", "Sommeil apres fractionne.", "Revoir avant course."],
      ["2023-04-20", "Suivi sportif", "Ajuster avant semi-marathon.", "Moins de raideurs, sommeil meilleur.", "Plan semaine course, hydratation, magnesium alimentaire, visualisation calme.", "Confiant.", "Deux footings sans montre.", "Tension mollet.", "Bilan apres course."],
      ["2023-06-01", "Bilan course", "Recuperer apres objectif.", "Course reussie, fatigue nerveuse.", "Semaine regeneration, alimentation anti-inflammatoire, bain froid modere.", "Soulagé.", "Repos actif 10 jours.", "Envie de relancer trop vite.", "Espacer."],
      ["2024-09-12", "Suivi naturopathie", "Prevenir surentrainement.", "A repris fort, sommeil leger.", "Signaux de charge, plan deload, respiration parasympathique.", "Comprend le risque.", "Semaine allegee planifiee.", "Compulsion de mesure.", "Controle 6 semaines."]
    ]
  },
  {
    pseudonym: "NAT-2023-006",
    firstName: "Amina",
    lastName: "Traore",
    email: "amina.traore@example.test",
    phone: "+41 77 666 55 06",
    address: "Rue des Alpes 17, 1201 Geneve",
    birthDate: "1990-07-22",
    adminNotes: "Jeune maman, besoin de plans tres souples.",
    anamnesis: {
      consultationReason: "Fatigue post-partum tardive, charge mentale et envies sucrees.",
      mainGoal: "Recuperer progressivement sans culpabilite.",
      personalHistory: "Accouchement en 2022, allaitement termine.",
      medicalHistory: "Bilan post-partum realise, pas d'alerte selon cliente.",
      currentTreatments: "Aucun.",
      medicationSupplements: "Fer prescrit precedemment, termine.",
      allergies: "Aucune connue.",
      sleep: "Sommeil interrompu par enfant.",
      nutrition: "Repas parfois sautes, grignotage sucre.",
      stress: "Charge mentale familiale elevee.",
      physicalActivity: "Promenades poussette.",
      painSymptoms: "Bas du dos fatigue.",
      dominantEmotions: "Culpabilite, tendresse, epuisement.",
      lifeEvents: "Retour au travail progressif.",
      dailyHabits: "Telephone tard le soir.",
      familyContext: "Couple avec un jeune enfant.",
      professionalContext: "RH a 60%.",
      expectations: "Avoir des options quand la journee deraille.",
      contraindications: "Fatigue extreme, tristesse persistante: orientation medecin/sage-femme.",
      warningSignals: "Idees noires, vertiges, saignements, epuisement majeur.",
      shortTermGoals: "Ajouter des repas faciles et soutenir sommeil.",
      mediumTermGoals: "Retrouver une sensation de corps ressource.",
      freeNotes: "Valoriser chaque micro-progres."
    },
    sessions: [
      ["2023-05-09", "Premiere consultation", "Prioriser recuperation post-partum.", "Emue, fatigue, se sent debordee.", "Plan minimum viable: petit-dejeuner, hydratation, sieste sans culpabilite.", "Pleure de soulagement.", "Liste 5 repas de secours.", "Humeur et sommeil.", "Suivi rapproche."],
      ["2023-06-06", "Suivi vitalite", "Evaluer energie et alimentation.", "Moins d'envies sucrees le matin.", "Collations proteinees, rituel coucher telephone hors chambre.", "Fierte discrete.", "Preparer deux collations la veille.", "Charge mentale couple.", "Continuer douceur."],
      ["2023-08-29", "Suivi naturopathie", "Soutenir retour au travail.", "Fatigue variable, meilleure organisation.", "Plan bureau: repas simple, pause respiration, limites.", "Plus confiante.", "Bloquer pause midi.", "Dos fatigue.", "Revoir automne."],
      ["2024-03-19", "Bilan", "Consolider autonomie.", "Energie stable, sommeil encore fragile.", "Routine flexible, marche consciente, soutien micronutritionnel a discuter medecin.", "Reconnaissante.", "Marche seule 20 min par semaine.", "Besoin de temps personnel.", "Espacer."],
      ["2025-02-25", "Suivi ponctuel", "Reprise apres hiver fatigant.", "Besoin de recadrer les bases.", "Retour plan minimum, vitamine D via medecin, repas batch tres simple.", "Apaisee.", "Deux soupes completes par semaine.", "Sommeil enfant.", "Point printemps."]
    ]
  },
  {
    pseudonym: "NAT-2023-007",
    firstName: "Julien",
    lastName: "Morel",
    email: "julien.morel@example.test",
    phone: "+41 79 777 66 07",
    address: "Chemin du Signal 21, 1018 Lausanne",
    birthDate: "1988-11-11",
    adminNotes: "Burnout ancien, suivi prudent avec limites claires.",
    anamnesis: {
      consultationReason: "Prevention rechute apres burnout.",
      mainGoal: "Reconnaitre les signaux precoces et garder un rythme soutenable.",
      personalHistory: "Arret de travail en 2021, reprise progressive.",
      medicalHistory: "Suivi psychotherapeutique termine mais disponible si besoin.",
      currentTreatments: "Aucun.",
      medicationSupplements: "Magnesium ponctuel.",
      allergies: "Aucune connue.",
      sleep: "Se degrade rapidement en surcharge.",
      nutrition: "Correcte mais oublie de manger quand concentre.",
      stress: "Hypervigilance professionnelle.",
      physicalActivity: "Escalade douce, marche.",
      painSymptoms: "Oppression quand stress eleve.",
      dominantEmotions: "Peur de rechuter, exigence.",
      lifeEvents: "Nouveau poste moins expose.",
      dailyHabits: "Check mails le soir.",
      familyContext: "En couple.",
      professionalContext: "Developpeur senior.",
      expectations: "Cadre de prevention, pas de discours magique.",
      contraindications: "Symptomes anxiodepressifs persistants: recontacter psy/medecin.",
      warningSignals: "Insomnie prolongee, crises d'angoisse, idees noires.",
      shortTermGoals: "Installer tableau de signaux et routines de recuperation.",
      mediumTermGoals: "Reprendre confiance dans sa capacite a travailler.",
      freeNotes: "Approche psychoeducative utile."
    },
    sessions: [
      ["2023-09-05", "Premiere consultation", "Creer un plan prevention rechute.", "Vigilant, fatigue cognitive.", "Echelle signaux verts/oranges/rouges, repas alarmes, limites mail.", "Se sent compris.", "Couper mails apres 19h.", "Sommeil et oppression.", "Suivi 3 semaines."],
      ["2023-09-26", "Suivi stress", "Evaluer limites mises en place.", "Mieux le soir, culpabilite a deconnecter.", "Travail valeurs, respiration allongee, collation automatique.", "Apaise.", "Message d'absence soir.", "Culpabilite.", "Continuer."],
      ["2023-11-07", "Suivi naturopathie", "Stabiliser energie automne.", "Sommeil correct, stress ponctuel.", "Plan semaine chargee, plantes douces non sedatives, marche midi.", "Confiant.", "Marche 12 min apres repas.", "Prochaines deadlines.", "Bilan janvier."],
      ["2024-01-30", "Bilan prevention", "Verifier absence de signaux rouges.", "Aucun signal rouge, plus autonome.", "Revue tableau, ajustement nutrition, escalade plaisir.", "Fier.", "Garder check-in vendredi.", "Charge projet.", "Suivi espacé."],
      ["2025-06-17", "Suivi annuel", "Actualiser plan de prevention.", "Bonne stabilite, promotion en vue.", "Anticipation prise de responsabilite, limites calendrier.", "Lucide.", "Bloquer deux soirs libres.", "Risque surinvestissement.", "Point apres prise de poste."]
    ]
  },
  {
    pseudonym: "NAT-2024-008",
    firstName: "Lea",
    lastName: "Favre",
    email: "lea.favre@example.test",
    phone: "+41 76 888 77 08",
    address: "Rue du Midi 9, 1003 Lausanne",
    birthDate: "1998-04-05",
    adminNotes: "Etudiante. Budget limite, espacer autant que possible.",
    anamnesis: {
      consultationReason: "Acne adulte legere, stress examens et digestion variable.",
      mainGoal: "Comprendre les liens hygiène de vie/peau sans regime restrictif.",
      personalHistory: "Acne fluctuante depuis adolescence.",
      medicalHistory: "Dermatologue consulte, traitement local possible.",
      currentTreatments: "Creme locale ponctuelle.",
      medicationSupplements: "Aucun.",
      allergies: "Aucune connue.",
      sleep: "Irregulier en periode d'examens.",
      nutrition: "Repas etudiants, sucre augmente au stress.",
      stress: "Examens, peur de l'echec.",
      physicalActivity: "Danse occasionnelle.",
      painSymptoms: "Ballonnements ponctuels.",
      dominantEmotions: "Honte liee a la peau, anxiete examens.",
      lifeEvents: "Master en cours.",
      dailyHabits: "Travail tardif, scrolling.",
      familyContext: "Colocation.",
      professionalContext: "Etudiante et job week-end.",
      expectations: "Ne pas tout changer d'un coup.",
      contraindications: "Acne inflammatoire severe: dermatologue.",
      warningSignals: "Troubles alimentaires, anxiete invalidante, lesions douloureuses.",
      shortTermGoals: "Reguler sommeil et repas pendant examens.",
      mediumTermGoals: "Observer peau sans obsession.",
      freeNotes: "Attention au perfectionnisme."
    },
    sessions: [
      ["2024-02-06", "Premiere consultation", "Relier peau, stress et habitudes.", "Genee, tres motivee.", "Routine sommeil examens, assiette simple, observation cycle/peau.", "Rassuree de ne pas recevoir un regime strict.", "Petit-dejeuner 4 jours/semaine.", "Stress examens.", "Suivi 6 semaines."],
      ["2024-03-19", "Suivi peau", "Evaluer tolerance changements.", "Moins de grignotage, peau encore fluctuante.", "Hydratation, omega-3 alimentaires, pause respiration revision.", "Plus douce envers elle-meme.", "Pause 5 min toutes 90 min.", "Sommeil.", "Controle apres examens."],
      ["2024-06-25", "Bilan examens", "Prevenir rechute stress.", "Examens passes, digestion meilleure.", "Plan vacances, activite plaisir, suivi peau non quotidien.", "Soulagee.", "Danse 1x/semaine.", "Auto-observation excessive.", "Espacer."],
      ["2025-01-14", "Suivi ponctuel", "Adapter a nouveau semestre.", "Stress modere, peau stable.", "Routine minimale, repas colocation, limites cafe.", "Confiance.", "Cafe avant 15h.", "Rythme de sommeil.", "Suivi si besoin."]
    ]
  },
  {
    pseudonym: "NAT-2024-009",
    firstName: "Olivier",
    lastName: "Chappuis",
    email: "olivier.chappuis@example.test",
    phone: "+41 78 999 88 09",
    address: "Avenue William-Fraisse 3, 1006 Lausanne",
    birthDate: "1959-10-27",
    adminNotes: "Retraite recente. Coordination medicale importante.",
    anamnesis: {
      consultationReason: "Transition retraite, sommeil leger, digestion lente.",
      mainGoal: "Construire une routine de vitalite adaptee a la retraite.",
      personalHistory: "Retraite depuis 6 mois, perte de structure.",
      medicalHistory: "Cholesterol surveille par medecin.",
      currentTreatments: "Traitement hypolipemiant.",
      medicationSupplements: "Vitamine D selon medecin.",
      allergies: "Aucune connue.",
      sleep: "Reveils a 5h, rumination.",
      nutrition: "Repas bons mais plus riches depuis retraite.",
      stress: "Questionnement identitaire.",
      physicalActivity: "Marche, jardinage.",
      painSymptoms: "Raideur lombaire.",
      dominantEmotions: "Nostalgie, flottement.",
      lifeEvents: "Fin de carriere longue.",
      dailyHabits: "Aperitif plus frequent.",
      familyContext: "Marie, petits-enfants.",
      professionalContext: "Retraite d'une banque.",
      expectations: "Retrouver un cap.",
      contraindications: "Verifier interactions avec traitement. Avis medical pour symptomes nouveaux.",
      warningSignals: "Douleur thoracique, perte appetit, tristesse persistante.",
      shortTermGoals: "Recreer une routine matin et alleger diners.",
      mediumTermGoals: "Trouver activites ressourcantes.",
      freeNotes: "Travail sur sens et rythme."
    },
    sessions: [
      ["2024-01-23", "Premiere consultation", "Structurer la transition retraite.", "Sympathique, un peu perdu.", "Routine matin lumiere-marche, diner plus leger, journal envies.", "Se sent considere.", "Marche avant 10h trois fois.", "Aperitif.", "Suivi 1 mois."],
      ["2024-02-27", "Suivi vitalite", "Evaluer sommeil et digestion.", "Sommeil meilleur les jours de marche.", "Plan hebdomadaire, fibres douces, hydratation.", "Motivation bonne.", "Planifier activites dimanche soir.", "Lombaires.", "Continuer."],
      ["2024-05-07", "Suivi naturopathie", "Consolider routine.", "Digestion plus legere, humeur meilleure.", "Jardinage dose, repas mediterraneen, aperitif conscient.", "Content des progres.", "Deux diners vegetaux/semaine.", "Bilan cholesterol medical.", "Revoir automne."],
      ["2025-03-04", "Bilan annuel", "Adapter au rythme installe.", "Bonne vitalite, souhaite perdre 2 kg.", "Objectif non restrictif, marche en denivele, portions soir.", "Engage.", "Marche denivele 1x/semaine.", "Poids sans obsession.", "Suivi ete."]
    ]
  },
  {
    pseudonym: "NAT-2024-010",
    firstName: "Maya",
    lastName: "Singh",
    email: "maya.singh@example.test",
    phone: "+41 77 101 10 10",
    address: "Rue de Bourg 18, 1003 Lausanne",
    birthDate: "1983-08-16",
    adminNotes: "Entrepreneure, tres peu de temps. Aime les checklists courtes.",
    anamnesis: {
      consultationReason: "Stress entrepreneurial, digestion nerveuse et sommeil court.",
      mainGoal: "Creer une hygiene de recuperation compatible avec son activite.",
      personalHistory: "Creation d'entreprise en 2023.",
      medicalHistory: "Aucun element majeur rapporte.",
      currentTreatments: "Aucun.",
      medicationSupplements: "Adaptogenes essayes seule, arretes.",
      allergies: "Aucune connue.",
      sleep: "5-6h, reveils avec idees business.",
      nutrition: "Repas pris devant ordinateur.",
      stress: "Tres eleve, adrenaline constante.",
      physicalActivity: "Peu d'activite.",
      painSymptoms: "Noeud estomac, machoire serree.",
      dominantEmotions: "Excitation, peur de ralentir.",
      lifeEvents: "Levee de fonds en preparation.",
      dailyHabits: "Notifications permanentes.",
      familyContext: "Vit seule.",
      professionalContext: "Fondatrice SaaS.",
      expectations: "Ne veut pas un plan impossible.",
      contraindications: "Pas d'automedication plantes stimulantes. Avis medical si palpitations.",
      warningSignals: "Palpitations, attaque panique, insomnie severe.",
      shortTermGoals: "Manger sans ecran une fois par jour.",
      mediumTermGoals: "Dormir 7h au moins 3 nuits/semaine.",
      freeNotes: "Necessite des objectifs negociés."
    },
    sessions: [
      ["2024-04-09", "Premiere consultation", "Reduire hyperactivation.", "Parle vite, fatigue masquee.", "Micro-pauses, repas sans ecran, arret cafe 15h, respiration 4-6.", "Sceptique mais ouverte.", "Un repas sans ecran par jour.", "Palpitations.", "Suivi 3 semaines."],
      ["2024-04-30", "Suivi stress", "Tester faisabilite routines.", "A reussi 4 repas sans ecran/semaine.", "Rituel fermeture ordinateur, collation stable, marche appel audio.", "Surprise par efficacite.", "Fermeture ordinateur 21h30 deux soirs.", "Levee de fonds.", "Suivi rapproche."],
      ["2024-06-11", "Suivi naturopathie", "Adapter en periode intense.", "Sommeil 6h30, digestion meilleure.", "Plan de crise semaine pitch, repas secours, pas de nouveaux complements.", "Reconnaissante.", "Commander repas equilibres anticipes.", "Machoire.", "Revoir apres pitch."],
      ["2024-09-24", "Bilan", "Consolider apres levee.", "Tres fatiguee mais fiere.", "Phase recuperation active, bilan medical preventif, massage/physio machoire.", "Accepte de ralentir.", "Weekend sans travail.", "Risque surcharge.", "Suivi mensuel."],
      ["2025-05-20", "Suivi annuel", "Maintenir recuperation avec croissance equipe.", "Meilleure delegation, sommeil fragile.", "Rituels equipe, limites Slack, repas communs.", "Plus mature dans son rythme.", "Pas de Slack apres 20h.", "Voyages.", "Point ete."]
    ]
  },
  {
    pseudonym: "NAT-2024-011",
    firstName: "Gabriel",
    lastName: "Luthi",
    email: "gabriel.luthi@example.test",
    phone: "+41 79 202 20 11",
    address: "Chemin de la Cure 2, 1095 Lutry",
    birthDate: "2001-02-03",
    adminNotes: "Sportif amateur. Vient surtout quand la saison commence.",
    anamnesis: {
      consultationReason: "Crampes et fatigue pendant saison de football amateur.",
      mainGoal: "Mieux gerer hydratation, repas et recuperation.",
      personalHistory: "Entrainements 3x/semaine.",
      medicalHistory: "Entorse cheville ancienne.",
      currentTreatments: "Aucun.",
      medicationSupplements: "Boissons energetiques frequentes.",
      allergies: "Aucune connue.",
      sleep: "Irregulier le week-end.",
      nutrition: "Repas rapides, manque legumes.",
      stress: "Stress examens et matchs.",
      physicalActivity: "Football, salle.",
      painSymptoms: "Crampes mollets.",
      dominantEmotions: "Motivation, impatience.",
      lifeEvents: "Fin apprentissage.",
      dailyHabits: "Boissons sucrees, jeux video tard.",
      familyContext: "Vit chez ses parents.",
      professionalContext: "Apprenti automaticien.",
      expectations: "Conseils simples, pas trop longs.",
      contraindications: "Crampes persistantes ou douleur: medecin/physio.",
      warningSignals: "Douleur thoracique, malaise, blessure.",
      shortTermGoals: "Hydratation et repas avant match.",
      mediumTermGoals: "Recuperer sans boissons energetiques.",
      freeNotes: "Langage direct et concret."
    },
    sessions: [
      ["2024-08-13", "Premiere consultation", "Construire routine match.", "Dynamique, peu structure.", "Plan hydratation, repas 3h avant, collation recuperation.", "Trouve ca faisable.", "Gourde 1L au travail.", "Crampes.", "Revoir apres 4 matchs."],
      ["2024-09-17", "Suivi sportif", "Evaluer crampes.", "Crampes diminuees, sommeil tardif reste probleme.", "Electrolytes alimentaires, routine coucher apres entrainement.", "Content.", "Banane/yogourt apres entrainement.", "Boissons energetiques.", "Point fin saison."],
      ["2024-11-19", "Bilan saison", "Ancrer recuperation hors saison.", "Moins fatigue, meilleure eau.", "Renforcement cheville, repas legumes faciles.", "Motivation moyenne hors saison.", "Deux repas legumes/semaine.", "Sommeil week-end.", "Reprise printemps."],
      ["2025-04-15", "Suivi reprise", "Preparer nouvelle saison.", "A perdu certaines habitudes.", "Retour routine match, reduction energy drinks progressive.", "Pret a reprendre.", "Max 1 boisson energetique/semaine.", "Adherence.", "Controle mai."]
    ]
  },
  {
    pseudonym: "NAT-2025-012",
    firstName: "Ines",
    lastName: "Barraud",
    email: "ines.barraud@example.test",
    phone: "+41 76 303 30 12",
    address: "Rue Neuve 14, 1260 Nyon",
    birthDate: "1979-06-09",
    adminNotes: "Migraine: toujours rappeler le cadre medical.",
    anamnesis: {
      consultationReason: "Migraines cycliques et tensions cervicales.",
      mainGoal: "Identifier facteurs declencheurs et soutenir le terrain.",
      personalHistory: "Migraines depuis l'age adulte.",
      medicalHistory: "Diagnostic et traitement de crise suivis par neurologue.",
      currentTreatments: "Traitement de crise prescrit.",
      medicationSupplements: "Magnesium selon tolerance.",
      allergies: "Aucune connue.",
      sleep: "Sommeil sensible a la lumiere et au stress.",
      nutrition: "Repas corrects, parfois saute le midi.",
      stress: "Stress familial et ecran.",
      physicalActivity: "Pilates doux.",
      painSymptoms: "Migraine, cervicalgies.",
      dominantEmotions: "Apprehension des crises.",
      lifeEvents: "Periode de proche aidance.",
      dailyHabits: "Ecrans tardifs.",
      familyContext: "Mere de deux enfants, parent malade.",
      professionalContext: "Architecte.",
      expectations: "Approche complementaire serieuse.",
      contraindications: "Ne pas modifier traitement. Urgence si migraine inhabituelle.",
      warningSignals: "Cefalee brutale, troubles neurologiques, fievre, changement de pattern.",
      shortTermGoals: "Journal declencheurs et repas reguliers.",
      mediumTermGoals: "Reduire frequence via hygiene de vie.",
      freeNotes: "Coordination avec neurologue si besoin."
    },
    sessions: [
      ["2025-01-21", "Premiere consultation", "Cartographier migraines.", "Prudente, fatiguee.", "Journal migraine, repas midi, lumiere/ecrans, hydratation.", "Rassuree par respect du suivi medical.", "Journal 30 jours.", "Signaux d'alerte.", "Suivi 1 mois."],
      ["2025-02-18", "Suivi migraine", "Lire journal declencheurs.", "Deux crises, lien sommeil et repas saute.", "Plan repas bureau, lunettes lumiere a discuter, relaxation cervicale.", "Motivation.", "Repas midi bloque agenda.", "Tensions cervicales.", "Revoir apres cycle."],
      ["2025-04-01", "Suivi naturopathie", "Ajuster prevention.", "Une crise moins intense.", "Magnesium alimentaire, hydratation, routine ecran soir.", "Encouragee.", "Ecran coupe 30 min avant sommeil.", "Proche aidance.", "Suivi mai."],
      ["2025-08-26", "Bilan ete", "Evaluer frequence.", "Crises espacees, tension liee au travail.", "Plan rentree, pause visuelle, coordination physio.", "Confiance.", "Pause yeux toutes 60 min.", "Charge projets.", "Controle automne."]
    ]
  },
  {
    pseudonym: "NAT-2025-013",
    firstName: "Pierre",
    lastName: "Garnier",
    email: "pierre.garnier@example.test",
    phone: "+41 78 404 40 13",
    address: "Route de Chailly 70, 1012 Lausanne",
    birthDate: "1971-04-18",
    adminNotes: "Objectif metabolique. Bilan medical suivi par generaliste.",
    anamnesis: {
      consultationReason: "Glycemie limite et envie de modifier hygiene de vie.",
      mainGoal: "Stabiliser energie et soutenir recommandations medicales.",
      personalHistory: "Prise de poids progressive depuis 5 ans.",
      medicalHistory: "Glycemie a jeun surveillee par medecin.",
      currentTreatments: "Aucun medicament antidiabetique.",
      medicationSupplements: "Aucun.",
      allergies: "Aucune connue.",
      sleep: "Ronflements, sommeil non recuperateur.",
      nutrition: "Pain blanc, desserts frequents.",
      stress: "Stress moderé.",
      physicalActivity: "Peu actif hors promenades.",
      painSymptoms: "Genoux sensibles.",
      dominantEmotions: "Inquietude, envie de reprendre la main.",
      lifeEvents: "Enfants partis, repas plus riches.",
      dailyHabits: "Dessert le soir, grignotage TV.",
      familyContext: "Marie.",
      professionalContext: "Comptable.",
      expectations: "Changer sans regime punitif.",
      contraindications: "Suivi medical prioritaire pour glycemie. Avis medical si symptomes.",
      warningSignals: "Soif intense, amaigrissement, malaise, douleurs thoraciques.",
      shortTermGoals: "Petit-dejeuner et marche apres repas.",
      mediumTermGoals: "Reduire pics glycemiques avec plaisir alimentaire.",
      freeNotes: "Approche comportementale progressive."
    },
    sessions: [
      ["2025-02-04", "Premiere consultation", "Soutenir objectif glycemie.", "Inquiet mais determine.", "Assiette fibres-proteines, marche post-diner, suivi desserts.", "Rassure par absence d'interdit total.", "Marche 10 min apres diner 4x/semaine.", "Sommeil/ronflements.", "Suivi 1 mois."],
      ["2025-03-11", "Suivi metabolique", "Evaluer changements.", "Marche tenue, moins somnolent apres repas.", "Remplacer pain blanc, dessert conscient 3x/semaine, hydratation.", "Fier.", "Pain complet au petit-dejeuner.", "Genoux.", "Continuer."],
      ["2025-05-06", "Suivi naturopathie", "Consolider alimentation.", "Perte 2 kg, energie meilleure.", "Plan barbecue/ete, legumes faciles, sommeil a discuter medecin si ronflements.", "Motivation forte.", "Legumes a chaque diner.", "Bilan medical juin.", "Revoir apres bilan."],
      ["2025-07-08", "Bilan medical", "Adapter apres resultats.", "Glycemie amelioree selon medecin.", "Maintien, renforcement doux, gestion vacances.", "Tres content.", "Renforcement 15 min 2x/semaine.", "Vacances.", "Controle automne."]
    ]
  },
  {
    pseudonym: "NAT-2025-014",
    firstName: "Caroline",
    lastName: "Viret",
    email: "caroline.viret@example.test",
    phone: "+41 79 505 50 14",
    address: "Chemin de Primerose 6, 1007 Lausanne",
    birthDate: "1986-12-01",
    adminNotes: "Hypersensibilite au stress. Besoin de beaucoup de nuance.",
    anamnesis: {
      consultationReason: "Troubles du sommeil et anxiete somatique.",
      mainGoal: "Apaiser le systeme nerveux et retrouver confiance dans le sommeil.",
      personalHistory: "Periode anxieuse depuis conflit professionnel.",
      medicalHistory: "Medecin consulte, pas d'urgence selon cliente.",
      currentTreatments: "Aucun.",
      medicationSupplements: "Melisse ponctuelle.",
      allergies: "Aucune connue.",
      sleep: "Endormissement long, peur de mal dormir.",
      nutrition: "Appetit diminue le soir.",
      stress: "Eleve, sensations corporelles amplifiees.",
      physicalActivity: "Yoga doux.",
      painSymptoms: "Boule gorge, ventre serre.",
      dominantEmotions: "Peur, lassitude.",
      lifeEvents: "Conflit au travail.",
      dailyHabits: "Recherche de symptomes en ligne.",
      familyContext: "Vit en couple.",
      professionalContext: "Chargee de communication.",
      expectations: "Etre accompagnee sans minimisation.",
      contraindications: "Anxiete severe ou depressive: psychotherapie/medecin.",
      warningSignals: "Idees noires, attaques paniques frequentes, perte de poids rapide.",
      shortTermGoals: "Rituel securisant du soir et repas doux.",
      mediumTermGoals: "Reduire hypervigilance corporelle.",
      freeNotes: "Eviter surcharge d'informations."
    },
    sessions: [
      ["2025-03-18", "Premiere consultation", "Installer securite autour du sommeil.", "Tres tendue, parle doucement.", "Psychoeducation stress, rituel soir, repas soupe/proteines, limites recherches web.", "Larmes, soulagement.", "Boite a inquietudes avant 19h.", "Humeur.", "Suivi rapproche."],
      ["2025-04-08", "Suivi sommeil", "Evaluer endormissement.", "Endormissement encore long mais moins de peur.", "Respiration 4-6, ancrage sensoriel, tisane simple.", "Dit se sentir moins seule.", "Rituel identique 5 soirs.", "Conflit travail.", "Continuer."],
      ["2025-05-13", "Suivi naturopathie", "Stabiliser systeme nerveux.", "Deux bonnes nuits/semaine, appetit revient.", "Collations, yoga nidra, marche lumiere.", "Encouragee.", "Marche matin 10 min.", "Rumination.", "Point juin."],
      ["2025-06-24", "Bilan", "Mesurer progres et autonomie.", "Sommeil 6-7h, anxiete fluctuante.", "Plan rechute, orientation psy si conflit perdure.", "Plus confiante.", "Contacter psy si besoin.", "Travail.", "Suivi apres vacances."]
    ]
  },
  {
    pseudonym: "NAT-2025-015",
    firstName: "Hugo",
    lastName: "Sanchez",
    email: "hugo.sanchez@example.test",
    phone: "+41 76 606 60 15",
    address: "Avenue de la Gare 24, 1110 Morges",
    birthDate: "1994-05-25",
    adminNotes: "Travail en horaires decales. Suivi recent mais dossier deja vivant.",
    anamnesis: {
      consultationReason: "Horaires decales, digestion perturbee et fatigue.",
      mainGoal: "Adapter repas et sommeil aux rotations de travail.",
      personalHistory: "Travail de nuit depuis 18 mois.",
      medicalHistory: "Bilan medical professionnel annuel.",
      currentTreatments: "Aucun.",
      medicationSupplements: "Cafeine importante.",
      allergies: "Aucune connue.",
      sleep: "Sommeil fractionne apres nuits.",
      nutrition: "Repas de nuit lourds, cafe.",
      stress: "Fatigue sociale.",
      physicalActivity: "Salle irreguliere.",
      painSymptoms: "Brulures digestives apres nuits.",
      dominantEmotions: "Decalage, irritation.",
      lifeEvents: "Nouveau poste hospitalier.",
      dailyHabits: "Cafe pour tenir, repas distributeur.",
      familyContext: "En couple, horaires compliquent vie sociale.",
      professionalContext: "Infirmier.",
      expectations: "Solutions pratiques pour travail de nuit.",
      contraindications: "Reflux intense, somnolence dangereuse: avis medical/employeur.",
      warningSignals: "Endormissement au volant, douleurs thoraciques, epuisement severe.",
      shortTermGoals: "Plan repas nuit et descente cafeine.",
      mediumTermGoals: "Stabiliser recuperation entre rotations.",
      freeNotes: "Tres concret, besoin de variantes."
    },
    sessions: [
      ["2025-09-16", "Premiere consultation", "Adapter hygiene de vie aux nuits.", "Fatigue, humour present.", "Plan repas pre-nuit/nuit/post-nuit, cafeine stop 3h avant fin poste, lunettes soleil retour.", "Trouve les idees applicables.", "Preparer box repas nuit.", "Somnolence retour.", "Suivi 3 semaines."],
      ["2025-10-07", "Suivi horaires decales", "Evaluer plan nuit.", "Moins de reflux, cafe encore eleve.", "Collation proteinee, hydratation, rituel retour maison.", "Content des premiers effets.", "Reduire cafe de nuit d'une tasse.", "Sommeil jour.", "Continuer."],
      ["2025-11-18", "Suivi naturopathie", "Stabiliser entre rotations.", "Sommeil jour meilleur avec routine.", "Plan jours off, lumiere matin, repas social sans exces.", "Se sent moins subi.", "Lumiere naturelle au reveil jours off.", "Vie sociale.", "Bilan janvier."]
    ]
  }
];

function date(value: string): Date {
  return new Date(`${value}T09:30:00.000Z`);
}

function planContent(clientName: string, objective: string): string {
  return [
    `Plan de seance pour ${clientName}`,
    "",
    `Objectif du jour: ${objective}`,
    "1. Accueil et meteo corporelle, 5 minutes.",
    "2. Relecture des observations depuis la derniere seance, 10 minutes.",
    "3. Ajustement naturopathique principal: alimentation, sommeil, stress ou recuperation selon priorite.",
    "4. Choix d'une action tres concrete a tester pendant 2 a 4 semaines.",
    "5. Verification des limites: rappeler les signaux qui necessitent un avis medical.",
    "",
    "Note: contenu fictif de demonstration, non destine a remplacer un avis medical."
  ].join("\n");
}

function structuredNote(objective: string, clientState: string, nextStep: string): string {
  return [
    `Objectif: ${objective}`,
    `Etat observe: ${clientState}`,
    `Synthese: la seance a permis de relier les symptomes rapportes aux habitudes quotidiennes et de choisir une action prioritaire.`,
    `Suite: ${nextStep}`
  ].join("\n");
}

async function main() {
  await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } });

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: "Claire Martin",
      passwordHash: hashPassword(DEMO_PASSWORD),
      createdAt: date("2021-11-15")
    }
  });

  await prisma.therapistProfile.create({
    data: {
      therapistId: user.id,
      mainDiscipline: "Naturopathie",
      secondaryDisciplines: "Nutrition fonctionnelle, phytotherapie douce, gestion du stress, hygiene du sommeil",
      therapeuticApproach:
        "Approche integrative, progressive et pedagogique. Les recommandations restent compatibles avec le suivi medical et privilegient des changements realistes.",
      targetAudience: "Adultes, jeunes parents, actifs sous stress, sportifs amateurs et personnes en transition de vie",
      supportedIssues:
        "Fatigue fonctionnelle, digestion sensible, sommeil perturbe, stress chronique, accompagnement du cycle feminin, prevention de rechute d'epuisement",
      defaultSessionDuration: 75,
      accompanimentStyle:
        "Ecoute precise, priorisation de quelques leviers simples, supports ecrits, suivi des signaux d'alerte et coordination medicale lorsque necessaire.",
      professionalLimits:
        "Ne pose pas de diagnostic, ne modifie jamais un traitement medical, ne remplace pas une consultation medicale, oriente vers medecin ou specialiste en cas de signal d'alerte.",
      language: "fr",
      preferredTone: "Chaleureux, clair, prudent, concret",
      createdAt: date("2021-11-15")
    }
  });

  let sessionCount = 0;

  for (const clientData of demoClients) {
    const client = await prisma.client.create({
      data: {
        therapistId: user.id,
        pseudonym: clientData.pseudonym,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        birthDate: date(clientData.birthDate),
        adminNotes: clientData.adminNotes,
        createdAt: date(clientData.sessions[0][0])
      }
    });

    await prisma.anamnesis.create({
      data: {
        clientId: client.id,
        ...clientData.anamnesis,
        createdAt: date(clientData.sessions[0][0])
      }
    });

    for (const [
      sessionDate,
      sessionType,
      objective,
      clientState,
      performedInterventions,
      observedReactions,
      exercisesGiven,
      pointsToRevisit,
      nextStep
    ] of clientData.sessions) {
      const session = await prisma.therapySession.create({
        data: {
          clientId: client.id,
          therapistId: user.id,
          sessionDate: date(sessionDate),
          durationMinutes: sessionType.includes("Premiere") ? 90 : 75,
          sessionType,
          objective,
          clientState,
          performedInterventions,
          observedReactions,
          exercisesGiven,
          pointsToRevisit,
          nextStep,
          rawNote: `${clientData.pseudonym} - ${sessionType}. ${clientState} Intervention: ${performedInterventions} Suite: ${nextStep}`,
          structuredNote: structuredNote(objective, clientState, nextStep),
          aiSessionPlan: planContent(`${clientData.firstName} ${clientData.lastName}`, objective),
          status: SessionStatus.FINALIZED,
          createdAt: date(sessionDate)
        }
      });

      sessionCount += 1;

      if (sessionCount % 3 === 0) {
        await prisma.aiGeneratedSessionPlan.create({
          data: {
            clientId: client.id,
            therapistId: user.id,
            durationMinutes: session.durationMinutes ?? 75,
            sessionType,
            dayObjective: objective,
            intensityLevel: "Moderee",
            sessionStyle: "Pedagogique et concret",
            desiredTools: "Journal de suivi, respiration, ajustements alimentaires simples",
            avoid: "Promesses therapeutiques, regimes stricts, modification de traitement",
            therapistNotes: pointsToRevisit,
            generatedContent: planContent(`${clientData.firstName} ${clientData.lastName}`, objective),
            createdAt: date(sessionDate)
          }
        });
      }
    }
  }

  const clients = await prisma.client.findMany({ where: { therapistId: user.id }, orderBy: { createdAt: "asc" } });
  for (const [index, client] of clients.entries()) {
    await prisma.aiRequestLog.create({
      data: {
        therapistId: user.id,
        clientId: client.id,
        type: index % 2 === 0 ? AiRequestType.SESSION_PLAN : AiRequestType.STRUCTURED_NOTE,
        provider: "openai",
        model: "gpt-4.1-mini",
        status: AiRequestStatus.SUCCESS,
        createdAt: date(`2025-${String((index % 9) + 1).padStart(2, "0")}-12`)
      }
    });
  }

  await prisma.aiRequestLog.create({
    data: {
      therapistId: user.id,
      type: AiRequestType.SUMMARY,
      provider: "openai",
      model: "gpt-4.1-mini",
      status: AiRequestStatus.ERROR,
      error: "Exemple de log de demonstration: requete interrompue avant generation.",
      createdAt: date("2025-10-03")
    }
  });

  console.log(`Demo therapist created: ${DEMO_EMAIL}`);
  console.log(`Demo password: ${DEMO_PASSWORD}`);
  console.log(`Clients: ${demoClients.length}`);
  console.log(`Sessions: ${sessionCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
