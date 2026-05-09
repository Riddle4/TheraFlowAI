# TheraFlow IA — Pack de développement pour Codex

Ce dossier contient les instructions et spécifications pour développer le MVP d'une plateforme SaaS IA destinée aux thérapeutes.

## Objectif
Construire une application web sécurisée permettant à un thérapeute de :

1. Créer son compte et son profil professionnel.
2. Gérer ses clients dans un espace strictement cloisonné.
3. Remplir une anamnèse structurée.
4. Ajouter l'historique des séances.
5. Générer une proposition de séance personnalisée avec l'IA.
6. Générer une note structurée après séance.
7. Pseudonymiser les données avant tout appel IA.

## Stack technique demandée

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Auth.js / NextAuth ou auth équivalente sécurisée
- OpenAI API côté serveur uniquement
- Architecture multi-tenant par thérapeute

## Priorité
Développer un MVP propre, fonctionnel et sécurisé. Ne pas développer de portail client ni de feedback client dans la première version.

## Fichiers importants

- `CODEX_MASTER_PROMPT.md` : prompt principal à coller dans Codex.
- `PRODUCT_SPEC_MVP.md` : cahier fonctionnel du MVP.
- `TECHNICAL_SPEC.md` : architecture technique.
- `DATABASE_SCHEMA.prisma` : proposition de schéma Prisma.
- `AI_PROMPTS.md` : prompts système pour les appels IA.
- `SECURITY_PRIVACY_REQUIREMENTS.md` : exigences de confidentialité.
- `USER_STORIES_AND_ACCEPTANCE.md` : user stories et critères d'acceptation.
- `.env.example` : variables d'environnement attendues.

