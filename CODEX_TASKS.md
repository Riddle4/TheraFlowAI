# TheraFlow IA — Découpage des tâches pour Codex

## Tâche 1 — Initialisation projet
Créer le projet Next.js TypeScript avec Tailwind, Prisma, PostgreSQL, structure de dossiers, README et `.env.example`.

## Tâche 2 — Authentification
Mettre en place l'inscription, la connexion, la déconnexion et la protection des routes privées.

## Tâche 3 — Schéma Prisma
Implémenter les modèles User, TherapistProfile, Client, Anamnesis, TherapySession, AiGeneratedSessionPlan, AiRequestLog.

## Tâche 4 — Profil thérapeute
Créer la page paramètres/profil avec formulaire complet et sauvegarde.

## Tâche 5 — Clients
Créer le CRUD client avec pseudonyme automatique et contrôle strict `therapistId`.

## Tâche 6 — Anamnèse
Créer le formulaire d'anamnèse complet par client.

## Tâche 7 — Séances
Créer l'historique de séances et les notes manuelles.

## Tâche 8 — Pseudonymisation
Créer `buildAnonymizedClientContext` et ses tests.

## Tâche 9 — Génération IA de séance
Créer la page de préparation IA, le formulaire, l'appel serveur OpenAI et l'affichage du résultat.

## Tâche 10 — Note après séance assistée
Créer l'action serveur qui transforme une note brute en note structurée.

## Tâche 11 — UI polish
Améliorer dashboard, navigation, états vides, disclaimers et responsive.

## Tâche 12 — Sécurité minimale
Vérifier accès inter-thérapeutes impossible, logs propres, aucun secret côté client.
