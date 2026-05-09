# TheraFlow IA — Exigences sécurité et confidentialité

## Principes

L'application manipule des données sensibles. Le MVP doit être conçu avec une logique privacy-by-design.

## Exigences critiques

1. Cloisonnement strict
   - chaque thérapeute ne peut accéder qu'à ses propres données
   - toutes les requêtes métier filtrent par `therapistId`

2. Pseudonymisation IA
   - jamais de nom, prénom, email, téléphone, adresse, date de naissance complète dans les prompts IA
   - utiliser un pseudonyme client interne
   - convertir date de naissance en tranche d'âge si nécessaire

3. Appels IA serveur uniquement
   - clé OpenAI uniquement dans les variables d'environnement serveur
   - aucun appel OpenAI côté navigateur

4. Logs minimaux
   - ne pas logguer les prompts complets
   - ne pas logguer de données clients brutes
   - logguer uniquement type de requête, statut, timestamp, modèle

5. Suppression et export
   - prévoir une architecture permettant la suppression complète des données d'un thérapeute
   - prévoir plus tard un export complet

6. Disclaimers
   - afficher clairement que l'IA ne remplace pas le thérapeute
   - préciser que le thérapeute reste responsable

7. Situations à risque
   - l'IA doit signaler les situations qui dépassent le cadre d'un accompagnement complémentaire

## Données à ne pas envoyer à l'IA

- nom complet
- prénom exact
- adresse
- téléphone
- email
- date de naissance complète
- numéro AVS
- noms de proches
- employeur précis
- documents médicaux bruts non filtrés

## Données utilisables après transformation

- tranche d'âge
- problématique générale
- objectifs
- historique thérapeutique synthétique
- réactions observées
- préférences d'accompagnement
- contre-indications non identifiantes

## Fonction attendue

Créer une fonction serveur :

```ts
export function buildAnonymizedClientContext(input: {
  client: Client;
  anamnesis?: Anamnesis | null;
  sessions?: TherapySession[];
  therapistProfile?: TherapistProfile | null;
}): string
```

Cette fonction retourne une chaîne structurée, prête à être envoyée à l'IA, sans données directement identifiantes.
