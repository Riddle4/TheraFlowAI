export type LibraryCategory =
  | "Modèles de séances"
  | "Trames de notes"
  | "Questions utiles"
  | "Points de vigilance"
  | "Canevas IA";

export type LibraryResource = {
  title: string;
  category: LibraryCategory;
  audience: string;
  content: string;
};

export const libraryCategories: Array<LibraryCategory | "Tout"> = [
  "Tout",
  "Modèles de séances",
  "Trames de notes",
  "Questions utiles",
  "Points de vigilance",
  "Canevas IA"
];

export const libraryResources: LibraryResource[] = [
  {
    category: "Modèles de séances",
    title: "Première séance généraliste",
    audience: "Toutes disciplines",
    content:
      "Objectif: comprendre la demande, poser le cadre et vérifier les limites.\n\n1. Accueil et cadre de travail\n2. Demande principale et contexte\n3. Objectif prioritaire du client\n4. Historique utile sans sur-investigation\n5. Traitements, contre-indications, signaux d'alerte\n6. Ressources déjà présentes\n7. Proposition de travail à valider\n8. Prochaine étape simple\n\nRappel: ne pas poser de diagnostic, clarifier les limites du cadre thérapeutique."
  },
  {
    category: "Modèles de séances",
    title: "Séance de suivi",
    audience: "Toutes disciplines",
    content:
      "Objectif: suivre l'évolution et ajuster l'accompagnement.\n\n1. Point depuis la dernière séance\n2. Changements observés par le client\n3. Difficultés rencontrées\n4. Objectif du jour\n5. Intervention ou exploration principale\n6. Intégration et ressentis\n7. Tâche ou observation entre deux séances\n8. Points à reprendre"
  },
  {
    category: "Modèles de séances",
    title: "Séance de clôture ou bilan",
    audience: "Toutes disciplines",
    content:
      "Objectif: consolider les apprentissages et préparer l'autonomie.\n\n1. Rappel du chemin parcouru\n2. Ressources acquises\n3. Changements concrets observés\n4. Situations encore sensibles\n5. Plan d'autonomie\n6. Signaux indiquant qu'un nouveau soutien serait utile\n7. Clôture et feedback professionnel"
  },
  {
    category: "Modèles de séances",
    title: "Régulation émotionnelle douce",
    audience: "Hypnose, sophrologie, coaching, accompagnement stress",
    content:
      "Objectif: apaiser sans forcer l'exploration.\n\nAccueil 5 min\nMétéo interne 10 min\nRespiration ou ancrage 10 min\nExploration des ressources 20 min\nRetour corporel et verbalisation 10 min\nClôture 5 min\n\nVigilance: ralentir si anxiété forte, dissociation, fatigue importante ou sentiment de perte de contrôle."
  },
  {
    category: "Modèles de séances",
    title: "Sommeil et récupération",
    audience: "Naturopathie, sophrologie, hypnose, coaching santé",
    content:
      "Objectif: comprendre les habitudes de récupération et proposer une étape réaliste.\n\n1. Rythme de sommeil actuel\n2. Facteurs de stress et routines du soir\n3. Stimulants, écrans, alimentation, activité physique\n4. Ressources déjà testées\n5. Exercice de détente ou routine courte\n6. Objectif interséance mesurable\n\nVigilance: orienter si insomnie sévère persistante, apnées suspectées, douleurs importantes, symptômes psychiatriques ou traitement médical complexe."
  },
  {
    category: "Modèles de séances",
    title: "Habitudes alimentaires et hygiène de vie",
    audience: "Nutrition, naturopathie, coaching santé",
    content:
      "Objectif: identifier une amélioration réaliste sans culpabilisation.\n\n1. Demande et objectif prioritaire\n2. Journée type alimentaire\n3. Contraintes familiales, professionnelles, budgétaires\n4. Signaux corporels: faim, satiété, énergie, digestion\n5. Ressources et réussites existantes\n6. Une action simple pour la semaine\n\nVigilance: ne pas prescrire, orienter en cas de trouble alimentaire suspecté, perte de poids inexpliquée, maladie chronique ou grossesse."
  },
  {
    category: "Trames de notes",
    title: "Note courte après séance",
    audience: "Toutes disciplines",
    content:
      "Date:\nDurée:\nObjectif de séance:\nÉtat initial du client:\nInterventions réalisées:\nRéactions observées:\nPoints importants:\nExercice ou tâche donnée:\nProchaine étape:\nPoints de vigilance:"
  },
  {
    category: "Trames de notes",
    title: "Note SOAP adaptée",
    audience: "Toutes disciplines",
    content:
      "S - Subjectif: ce que le client rapporte, dans ses mots si utile.\nO - Observations: éléments observables pendant la séance.\nA - Analyse professionnelle prudente: hypothèses de travail à confirmer, sans diagnostic.\nP - Plan: prochaines étapes, exercice, point à reprendre, orientation éventuelle."
  },
  {
    category: "Trames de notes",
    title: "Bilan intermédiaire",
    audience: "Toutes disciplines",
    content:
      "Période couverte:\nObjectif initial:\nÉvolutions constatées:\nCe qui aide le client:\nCe qui reste difficile:\nAdaptations proposées:\nPoints de vigilance:\nObjectif pour la suite:"
  },
  {
    category: "Trames de notes",
    title: "Synthèse avant prochaine séance",
    audience: "Toutes disciplines",
    content:
      "À relire avant la prochaine séance:\n1. Objectif principal actuel\n2. Dernière intervention réalisée\n3. Réaction du client\n4. Point sensible à respecter\n5. Exercice donné\n6. Question utile pour reprendre\n7. Prochaine étape envisagée"
  },
  {
    category: "Questions utiles",
    title: "Clarifier la demande",
    audience: "Toutes disciplines",
    content:
      "Qu'est-ce qui vous amène aujourd'hui ?\nQu'aimeriez-vous voir changer concrètement ?\nComment saurez-vous que l'accompagnement vous aide ?\nQu'avez-vous déjà essayé ?\nQu'est-ce qui vous semble le plus urgent ou important ?\nY a-t-il quelque chose que vous ne souhaitez pas aborder aujourd'hui ?"
  },
  {
    category: "Questions utiles",
    title: "Explorer les ressources",
    audience: "Toutes disciplines",
    content:
      "Dans quelles situations le problème est-il moins présent ?\nQu'est-ce qui vous aide, même un peu ?\nQuelles qualités avez-vous déjà mobilisées dans des périodes difficiles ?\nQui ou quoi vous soutient actuellement ?\nQuel petit signe montrerait que vous avancez dans la bonne direction ?"
  },
  {
    category: "Questions utiles",
    title: "Suivre l'évolution",
    audience: "Toutes disciplines",
    content:
      "Depuis la dernière séance, qu'est-ce qui a changé ?\nQu'est-ce qui a été plus facile ?\nQu'est-ce qui est resté difficile ?\nAvez-vous observé des réactions après la séance ?\nL'exercice proposé était-il réaliste ?\nQue souhaitez-vous ajuster aujourd'hui ?"
  },
  {
    category: "Questions utiles",
    title: "Cadre et limites",
    audience: "Toutes disciplines",
    content:
      "Y a-t-il un diagnostic ou un suivi médical en cours dont je dois tenir compte ?\nPrenez-vous actuellement des médicaments ou compléments ?\nY a-t-il des contre-indications connues ?\nAvez-vous déjà vécu une expérience d'accompagnement difficile ?\nDans quelle situation devrions-nous ralentir ou arrêter l'exercice ?"
  },
  {
    category: "Points de vigilance",
    title: "Idées suicidaires ou danger immédiat",
    audience: "Toutes disciplines",
    content:
      "Signaux possibles: propos suicidaires, désespoir intense, plan précis, accès à un moyen, mise en danger.\n\nConduite prudente: ne pas gérer seul dans le cadre complémentaire. Encourager une aide médicale urgente, contacter les services d'urgence si danger immédiat, documenter factuellement, rester dans son cadre professionnel."
  },
  {
    category: "Points de vigilance",
    title: "Violence, abus ou emprise",
    audience: "Toutes disciplines",
    content:
      "Signaux possibles: peur d'un proche, contrôle coercitif, violences physiques, sexuelles, psychologiques, isolement, menaces.\n\nConduite prudente: ne pas promettre une confidentialité absolue si danger grave, orienter vers ressources spécialisées, éviter de confronter l'auteur présumé, respecter le rythme et la sécurité de la personne."
  },
  {
    category: "Points de vigilance",
    title: "Urgence médicale ou symptômes graves",
    audience: "Toutes disciplines",
    content:
      "Signaux possibles: douleur thoracique, déficit neurologique, malaise sévère, difficulté respiratoire, confusion aiguë, fièvre élevée, douleur intense inhabituelle.\n\nConduite prudente: recommander une évaluation médicale rapide ou les urgences selon la gravité. Ne pas interpréter comme un simple stress sans avis médical."
  },
  {
    category: "Points de vigilance",
    title: "Plantes, compléments et médicaments",
    audience: "Naturopathie, phytothérapie, nutrition",
    content:
      "Vérifier: anticoagulants, psychotropes, antiépileptiques, traitements cardiaques, immunosuppresseurs, grossesse/allaitement, chirurgie prévue, pathologies hépatiques/rénales.\n\nFormulation prudente: ne pas recommander d'arrêt de traitement. En cas de doute, orienter vers médecin ou pharmacien."
  },
  {
    category: "Points de vigilance",
    title: "Troubles alimentaires suspectés",
    audience: "Nutrition, naturopathie, coaching santé",
    content:
      "Signaux possibles: restriction importante, crises, vomissements, usage de laxatifs, perte de poids rapide, peur intense de grossir, hypercontrôle alimentaire.\n\nConduite prudente: éviter les plans restrictifs, ne pas renforcer le contrôle, orienter vers médecin, psychologue ou structure spécialisée."
  },
  {
    category: "Canevas IA",
    title: "Préparer une séance prudente",
    audience: "Toutes disciplines",
    content:
      "Prépare une séance de [durée] minutes pour un client pseudonymisé. Objectif du jour: [objectif]. Discipline: [discipline]. Style souhaité: doux, structuré, non directif. Inclure: déroulé minute par minute, questions utiles, exercices possibles, adaptations, points de vigilance, tâche interséance. Ne pose aucun diagnostic et formule seulement des propositions à valider."
  },
  {
    category: "Canevas IA",
    title: "Structurer une note brute",
    audience: "Toutes disciplines",
    content:
      "Structure cette note brute sans ajouter d'information absente. Sections: résumé bref, interventions réalisées, réactions observées, éléments importants exprimés, hypothèses à confirmer, points de vigilance, exercice donné, prochaine étape. Ton professionnel, clair et prudent. Ne transforme pas les hypothèses en certitudes."
  },
  {
    category: "Canevas IA",
    title: "Générer des questions ouvertes",
    audience: "Toutes disciplines",
    content:
      "À partir de ce contexte pseudonymisé, propose 12 questions ouvertes pour aider le thérapeute à explorer la demande sans induire de réponse. Classer par thèmes: clarification, ressources, freins, sécurité, prochaine étape. Exclure toute question intrusive non nécessaire."
  },
  {
    category: "Canevas IA",
    title: "Identifier les points de vigilance",
    audience: "Toutes disciplines",
    content:
      "Analyse ce contexte pseudonymisé uniquement pour repérer des points de vigilance possibles. Ne pose pas de diagnostic. Classe les points en: sécurité immédiate, médical, cadre professionnel, interactions potentielles, limites de l'accompagnement. Propose une formulation prudente pour le thérapeute."
  }
];
