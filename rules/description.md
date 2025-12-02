# Billing App - Générateur de Factures PDF

## Vision du Produit

Billing App est un **micro-SaaS simple** destiné aux freelances et petites entreprises pour **créer, personnaliser et télécharger des factures PDF** professionnelles en quelques clics.

## Concept Clé

L'utilisateur vient sur la plateforme pour :
1. **Choisir un modèle** de facture parmi les templates disponibles
2. **Remplir le formulaire** avec ses informations et celles de son client
3. **Personnaliser le style** (couleurs, layout, police)
4. **Télécharger le PDF** pour l'imprimer ou l'envoyer manuellement à son client
5. **Sauvegarder son document** (optionnel) pour le modifier ou le réutiliser plus tard

## Ce que l'application N'EST PAS

- ❌ Un outil de suivi de paiements
- ❌ Un CRM pour gérer des clients
- ❌ Un outil d'envoi automatique de factures par email
- ❌ Un système de comptabilité
- ❌ Un outil de relance de paiements

## Fonctionnalités Principales

### 1. Galerie de Templates
- Plusieurs modèles de factures prédéfinis (Classique, Moderne, Minimaliste, etc.)
- Prévisualisation avant sélection
- Personnalisation des couleurs, polices et layout

### 2. Éditeur de Facture (Split-Screen)
- **Panneau gauche** : Formulaire de saisie
  - Informations de l'entreprise (émetteur)
  - Informations du client (destinataire)
  - Lignes de facture (description, quantité, prix)
  - Options (dates, TVA, remise, notes)
  - Personnalisation du style
- **Panneau droit** : Aperçu en temps réel du PDF

### 3. Export PDF
- Génération instantanée du PDF
- Téléchargement direct
- Qualité professionnelle

### 4. Mes Documents (Sauvegarde)
- Sauvegarder un document pour le modifier plus tard
- Dupliquer un document existant
- Historique des documents créés

## Flow Utilisateur

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. Choisir     │ ──► │  2. Éditer &    │ ──► │  3. Télécharger │
│     Template    │     │     Prévisualiser│     │     PDF         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  4. Sauvegarder │
                        │    (optionnel)  │
                        └─────────────────┘
```

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 16 |
| Runtime | React 19 |
| Langage | TypeScript 5 |
| Base de données | PostgreSQL |
| ORM | Prisma 7 |
| Validation | Zod 4 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| Auth | JWT |
| PDF | @react-pdf/renderer |
| Hébergement | Vercel |

## Modèle de Données Simplifié

- **User** : Utilisateurs de la plateforme
- **Template** : Modèles de factures prédéfinis (créés par l'admin)
- **Document** : Factures sauvegardées par les utilisateurs (données + config style)

## Avantages Clés

- ✅ **Simple** : Pas de fonctionnalités superflues
- ✅ **Rapide** : Créer une facture en moins de 5 minutes
- ✅ **Professionnel** : Templates de qualité
- ✅ **Flexible** : Personnalisation du style
- ✅ **Pratique** : Sauvegarde pour réutilisation