# TheraFlow IA — User stories et critères d'acceptation

## Authentification

### US-001
En tant que thérapeute, je veux créer un compte afin d'accéder à mon espace personnel.

Critères :
- l'utilisateur peut s'inscrire avec email et mot de passe ou provider choisi
- une session est créée après connexion
- les pages privées ne sont pas accessibles sans connexion

### US-002
En tant que thérapeute, je veux que mes données soient privées afin qu'aucun autre thérapeute ne puisse y accéder.

Critères :
- toutes les listes affichent uniquement les données de l'utilisateur connecté
- l'accès direct à une URL client d'un autre thérapeute est refusé

## Profil thérapeute

### US-003
En tant que thérapeute, je veux définir ma discipline et mon approche afin que l'IA adapte ses propositions.

Critères :
- formulaire de profil disponible
- sauvegarde en base
- profil utilisé dans les prompts IA

## Clients

### US-004
En tant que thérapeute, je veux créer une fiche client afin de centraliser les informations utiles.

Critères :
- création client fonctionnelle
- pseudonyme généré automatiquement
- client lié au thérapeute connecté

### US-005
En tant que thérapeute, je veux consulter la fiche d'un client afin de voir son anamnèse et son historique.

Critères :
- page détail client
- sections anamnèse, séances, génération IA

## Anamnèse

### US-006
En tant que thérapeute, je veux remplir une anamnèse structurée afin de préparer l'accompagnement.

Critères :
- formulaire anamnèse complet
- sauvegarde et modification possibles
- données utilisées dans le contexte IA pseudonymisé

## Séances

### US-007
En tant que thérapeute, je veux ajouter une note de séance afin de conserver l'historique.

Critères :
- création d'une séance
- affichage dans l'historique
- modification possible

## IA

### US-008
En tant que thérapeute, je veux générer une proposition de séance afin de gagner du temps de préparation.

Critères :
- formulaire de paramètres
- appel IA côté serveur
- contexte pseudonymisé
- résultat structuré affiché à l'écran
- possibilité de sauvegarder le résultat

### US-009
En tant que thérapeute, je veux transformer une note brute en note structurée afin d'améliorer mon suivi.

Critères :
- champ note brute
- appel IA serveur
- résultat structuré
- sauvegarde dans la séance

## Sécurité

### US-010
En tant que fondateur du produit, je veux que l'application n'envoie pas de données identifiantes à l'IA afin de réduire les risques de confidentialité.

Critères :
- fonction de pseudonymisation testée
- nom/email/téléphone/date de naissance complète absents du contexte envoyé
- logs IA sans prompts bruts
