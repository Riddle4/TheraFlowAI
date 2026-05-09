# TheraFlow IA — Spécification fonctionnelle MVP

## 1. Concept
TheraFlow IA est une plateforme web qui aide les thérapeutes à préparer, structurer et suivre leurs séances grâce à l'intelligence artificielle. L'outil agit comme un copilote professionnel, jamais comme un substitut au thérapeute.

## 2. Utilisateurs

### Thérapeute indépendant
Utilisateur principal. Il crée son compte, configure son profil, ajoute ses clients, renseigne l'anamnèse, consigne les séances et demande des propositions IA.

### Administrateur SaaS
Non prioritaire dans le MVP. Peut être ajouté plus tard pour gérer les abonnements et les comptes.

### Client final
Pas d'accès dans le MVP. Pas de portail client.

## 3. Parcours utilisateur principal

1. Le thérapeute crée son compte.
2. Il complète son profil thérapeutique.
3. Il crée une fiche client.
4. Il remplit l'anamnèse initiale.
5. Il clique sur “Préparer une séance IA”.
6. Il saisit les paramètres de séance.
7. L'application pseudonymise le contexte.
8. L'IA génère une proposition de séance.
9. Le thérapeute adapte, valide ou sauvegarde la proposition.
10. Après la séance, il ajoute une note brute.
11. L'IA structure la note.
12. L'historique du client s'enrichit pour les séances suivantes.

## 4. Modules MVP

### 4.1 Authentification
- Inscription
- Connexion
- Déconnexion
- Session sécurisée
- Données cloisonnées par utilisateur

### 4.2 Profil thérapeute
Champs :
- discipline principale
- disciplines secondaires
- approche thérapeutique
- public cible
- problématiques accompagnées
- durée habituelle
- style d'accompagnement
- limites professionnelles
- langue
- ton préféré

### 4.3 Clients
Champs :
- prénom
- nom
- email
- téléphone
- date de naissance
- notes administratives
- pseudonyme automatique
- date de création
- date de mise à jour

Fonctions :
- liste
- recherche simple
- création
- modification
- suppression
- accès à la fiche détaillée

### 4.4 Anamnèse
Sections :
- motif de consultation
- objectif principal
- historique personnel pertinent
- historique médical pertinent
- traitements en cours
- médicaments/compléments
- allergies
- sommeil
- alimentation
- stress
- activité physique
- douleurs/symptômes
- émotions dominantes
- événements de vie
- habitudes quotidiennes
- contexte familial
- contexte professionnel
- attentes
- contre-indications
- signaux d'alerte
- objectifs à court terme
- objectifs à moyen terme
- notes libres

### 4.5 Historique de séances
Champs :
- date
- durée
- type de séance
- objectif
- état du client
- contenu réalisé
- réactions
- exercices donnés
- points à reprendre
- prochaine étape
- note brute
- note structurée IA
- proposition IA associée

### 4.6 Génération IA de séance
Entrées :
- client
- durée
- type de séance
- objectif du jour
- niveau d'intensité
- style de séance
- outils souhaités
- choses à éviter
- notes libres

Sortie attendue :
- résumé du contexte pseudonymisé
- objectif proposé
- déroulé minute par minute
- questions à poser
- exercices/interventions possibles
- précautions
- alternatives
- conclusion suggérée
- tâche entre deux séances
- note de suivi proposée

### 4.7 Note après séance assistée
Entrée : note brute du thérapeute.
Sortie : note structurée.

Structure :
- résumé
- interventions réalisées
- réactions observées
- hypothèses de travail
- points de vigilance
- exercice donné
- prochaine étape

## 5. Fonctions explicitement hors MVP

- portail client
- feedback client
- paiement Stripe
- application mobile native
- agenda complexe
- téléconsultation
- messagerie client
- diagnostic médical
- prescription automatique

## 6. Ton IA
L'IA doit être claire, prudente, professionnelle, nuancée, structurée et respectueuse de la responsabilité du thérapeute.
