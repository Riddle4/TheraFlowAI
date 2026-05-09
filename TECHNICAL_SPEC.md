# TheraFlow IA — Spécification technique

## Stack

- Framework : Next.js App Router
- Langage : TypeScript
- UI : Tailwind CSS
- Base de données : PostgreSQL
- ORM : Prisma
- Auth : Auth.js / NextAuth ou équivalent
- IA : OpenAI API côté serveur uniquement
- Validation : Zod

## Structure recommandée

```txt
theraflow-ia/
  app/
    page.tsx
    login/
    register/
    dashboard/
    clients/
      page.tsx
      new/
      [clientId]/
        page.tsx
        anamnesis/
        sessions/
        ai-session/
    settings/
      profile/
  components/
    ui/
    layout/
    clients/
    sessions/
    ai/
  lib/
    auth.ts
    db.ts
    openai.ts
    anonymization.ts
    validators.ts
    constants.ts
  server/
    actions/
      clients.ts
      anamnesis.ts
      sessions.ts
      therapistProfile.ts
      ai.ts
  prisma/
    schema.prisma
  .env.example
  README.md
```

## Règle multi-tenant
Toutes les tables métier doivent contenir `therapistId`. Toutes les requêtes doivent filtrer sur l'utilisateur connecté.

Exemple :

```ts
await prisma.client.findFirst({
  where: {
    id: clientId,
    therapistId: session.user.id
  }
})
```

Ne jamais faire :

```ts
await prisma.client.findUnique({ where: { id: clientId } })
```

sauf si un contrôle explicite d'appartenance est effectué immédiatement après.

## Appels IA

Les appels OpenAI doivent passer par des fonctions serveur :

- `generateSessionPlan`
- `structurePostSessionNote`
- `buildAnonymizedClientContext`

Aucune clé API ne doit être exposée côté client.

## Pseudonymisation

Créer une couche de préparation du contexte :

```ts
buildAnonymizedClientContext({ client, anamnesis, sessions, therapistProfile })
```

Cette fonction doit :

- retirer nom, prénom, email, téléphone, adresse
- remplacer le client par `client.pseudonym`
- transformer date de naissance en tranche d'âge si nécessaire
- retirer les noms propres évidents des notes libres si possible
- limiter le contexte aux données utiles

## Logs

Créer une table `AiRequestLog` pour tracer :

- therapistId
- clientId optionnel
- type de requête
- provider
- model
- createdAt
- status
- error message court si erreur

Ne pas stocker le prompt complet brut contenant des données sensibles dans les logs en MVP.

## UI minimale

Pages principales :

- `/` : landing simple / redirection dashboard si connecté
- `/login`
- `/register`
- `/dashboard`
- `/clients`
- `/clients/new`
- `/clients/[clientId]`
- `/clients/[clientId]/anamnesis`
- `/clients/[clientId]/sessions`
- `/clients/[clientId]/ai-session`
- `/settings/profile`

## Disclaimers
Afficher dans les zones IA :

“TheraFlow IA propose une aide à la préparation. Le thérapeute reste responsable de son jugement professionnel. L'outil ne pose pas de diagnostic et ne remplace pas un avis médical.”

## Tests minimaux
Prévoir au moins :

- test de pseudonymisation
- test d'accès interdit entre thérapeutes
- test de validation des formulaires critiques
