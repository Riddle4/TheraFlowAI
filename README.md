# TheraFlow AI

MVP SaaS Next.js pour thérapeutes indépendants. L'application gère l'authentification, le profil thérapeute, les clients, l'anamnèse, les notes de séance et deux flux IA côté serveur avec pseudonymisation.

## Stack

- Next.js App Router + TypeScript strict
- Tailwind CSS
- Prisma + PostgreSQL
- Auth maison par cookie HTTP-only et session DB
- Validation serveur Zod
- OpenAI appelé uniquement depuis le serveur

## Installation locale

```bash
npm install
cp .env.example .env
```

Renseignez `DATABASE_URL` avec une base PostgreSQL locale, puis :

```bash
npm run prisma:migrate
npm run seed # facultatif
npm run dev
```

Compte de démo après seed :

- Email : `demo@theraflow.local`
- Mot de passe : `theraflow-demo-2026`

## IA

Ajoutez `OPENAI_API_KEY` dans `.env`. Si la clé est absente, les écrans IA restent disponibles mais l'appel retournera une erreur claire.

La fonction serveur [buildAnonymizedClientContext](/Users/laurentmoreschi/theraflow/lib/anonymization.ts) construit le contexte transmis à l'IA. Elle remplace le client par son pseudonyme, convertit la date de naissance en tranche d'âge et masque les identifiants directs détectables.

## Sécurité MVP

- Toutes les requêtes métier filtrent par `therapistId`.
- Les noms, emails, téléphones, adresses et dates complètes ne sont pas envoyés tels quels à l'IA.
- Les logs IA stockent uniquement type, statut, modèle, timestamp et erreur courte.
- Aucun portail client ni feedback client n'est inclus.
- Les propositions IA portent un disclaimer : le thérapeute garde la responsabilité de son jugement professionnel.

## Scripts utiles

```bash
npm run dev
npm run build
npm run typecheck
npm run test
npm run prisma:studio
```

## Déploiement avec Neon

1. Créez un projet PostgreSQL sur Neon.
2. Copiez l'URL de connexion PostgreSQL fournie par Neon.
3. Dans l'environnement de production, configurez :

```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
APP_URL="https://votre-domaine"
ALLOW_PUBLIC_REGISTRATION="false"
RESEND_API_KEY="re_..."
ACCESS_REQUEST_TO_EMAIL="info@cosmoengine.ai"
EMAIL_FROM="TheraFlow AI <notifications@votre-domaine>"
```

4. Appliquez les migrations Prisma en production :

```bash
npm run prisma:deploy
```

5. Lancez le build :

```bash
npm run build
```

Note : GitHub héberge le code. Pour exécuter l'application Next.js en production, utilisez ensuite un hébergeur compatible Node/Next.js comme Vercel, Render, Railway ou Fly.io, avec les mêmes variables d'environnement.

## Accès professionnel et invitations

Par défaut, l'inscription publique est fermée :

```env
ALLOW_PUBLIC_REGISTRATION="false"
```

Les visiteurs peuvent demander un accès via `/request-access`. Les demandes sont stockées dans la table `AccessRequest`.

Si `RESEND_API_KEY` est configuré, chaque demande d'accès envoie aussi un email récapitulatif à `ACCESS_REQUEST_TO_EMAIL`. Configurez `EMAIL_FROM` avec une adresse validée dans Resend pour la production.

Pour créer un code d'invitation :

```bash
npm run invite:create
```

Pour réserver le code à un email :

```bash
npm run invite:create -- --email=therapeute@example.com --label="Invitation pilote"
```

Le code est affiché une seule fois dans le terminal et stocké haché en base. Envoyez ce code au thérapeute pour qu'il puisse créer son compte sur `/register`.
