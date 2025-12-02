# Tâches de Développement - Billing App MVP (Version Simplifiée)

## 📌 Nouvelle Vision du Produit

L'application est un **générateur de factures PDF simple** :
1. Choisir un modèle
2. Remplir le formulaire (émetteur + client + lignes)
3. Personnaliser le style
4. Télécharger le PDF
5. Sauvegarder pour réutilisation (optionnel)

---

## 🔄 Phase de Simplification (EN COURS)

### Modifications Base de Données
- [x] Simplifier le schéma Prisma
  - [x] Renommer `Invoice` → `Document`
  - [x] Renommer `InvoiceItem` → `DocumentItem`
  - [x] Supprimer `BusinessProfile` (les infos émetteur sont sur le Document)
  - [x] Supprimer l'enum `InvoiceStatus` (pas de suivi de statut)
  - [x] Ajouter les champs émetteur (company*) sur Document
  - [x] Ajouter `styleConfig` pour sauvegarder la personnalisation
- [ ] Créer la migration Prisma
- [ ] Mettre à jour le client Prisma généré

### Modifications Backend
- [ ] Supprimer le module `business-profile`
- [ ] Renommer/Simplifier le module `invoice` → `document`
  - [ ] Supprimer la gestion des statuts
  - [ ] Supprimer la numérotation automatique
  - [ ] Adapter les schémas Zod
  - [ ] Adapter le service et repository
- [ ] Mettre à jour les routes API
  - [ ] `GET /api/documents` - Liste des documents de l'utilisateur
  - [ ] `POST /api/documents` - Sauvegarder un document
  - [ ] `GET /api/documents/:id` - Récupérer un document
  - [ ] `PUT /api/documents/:id` - Modifier un document
  - [ ] `DELETE /api/documents/:id` - Supprimer un document
  - [ ] `POST /api/documents/:id/duplicate` - Dupliquer un document
- [ ] Supprimer les anciennes routes inutiles
  - [ ] `/api/invoices/stats`
  - [ ] `/api/invoices/:id/status`
  - [ ] `/api/business-profile/*`

### Modifications Frontend - Types
- [ ] Mettre à jour `src/types/invoice.ts` → `src/types/document.ts`
  - [ ] Supprimer `InvoiceStatus` et tout ce qui y est lié
  - [ ] Renommer les types Invoice → Document
  - [ ] Ajouter les champs émetteur (company*)

### Modifications Frontend - Hooks
- [ ] Mettre à jour `use-invoices.ts` → `use-documents.ts`
- [ ] Mettre à jour `use-invoice-form.ts` → intégrer dans `use-invoice-creator.ts`
- [ ] Mettre à jour `use-invoice-creator.ts`
  - [ ] Ajouter les champs émetteur
  - [ ] Intégrer la génération PDF

### Modifications Frontend - Composants
- [ ] Supprimer les composants de statut
  - [ ] `invoice-status-badge.tsx`
- [ ] Simplifier `invoice-table.tsx` → `document-list.tsx`
  - [ ] Retirer les colonnes de statut
  - [ ] Actions : Modifier, Dupliquer, Télécharger PDF, Supprimer
- [ ] Simplifier `invoice-filters.tsx`
  - [ ] Garder uniquement la recherche
- [ ] Supprimer `invoice-detail.tsx` (pas besoin de page détail)
- [ ] Mettre à jour `invoice-creator.tsx`
  - [ ] Ajouter section "Informations de l'émetteur"
  - [ ] Activer le bouton de téléchargement PDF
  - [ ] Permettre la sauvegarde

### Modifications Frontend - Pages
- [ ] Renommer `/invoices` → `/documents` (ou garder `/invoices` pour l'URL)
- [ ] Simplifier la page liste
  - [ ] Grille de cartes plutôt que tableau
  - [ ] Actions rapides : Modifier, Dupliquer, Télécharger, Supprimer
- [ ] Page création : déjà faite avec le split-screen ✅
- [ ] Supprimer la page détail `/invoices/[id]`
- [ ] Garder la page édition `/invoices/[id]/edit`

### Modifications Frontend - Sidebar
- [ ] Simplifier la navigation
  - [ ] Accueil / Dashboard
  - [ ] Mes Documents
  - [ ] Modèles
  - [ ] Paramètres (profil utilisateur uniquement)

### Export PDF
- [ ] Activer le téléchargement PDF dans le creator
- [ ] S'assurer que le PDF utilise les données du formulaire
- [ ] S'assurer que le PDF utilise la config de style personnalisée

---

## ✅ Phases Complétées

### Phase 1 : Configuration et Infrastructure ✅
### Phase 2 : Authentification Backend ✅
### Phase 3 : Schéma Base de Données ✅ (à migrer)
### Phase 6 : Backend Templates ✅
### Phase 7 : Frontend - Pages Authentification ✅
### Phase 8 : Frontend - Layout Principal ✅
### Phase 13 : Frontend - Templates ✅
### Phase 14 : Export PDF (Frontend) ✅

---

## 📋 Tâches Restantes Après Simplification

### Dashboard Simple
- [ ] Page d'accueil avec :
  - [ ] Bouton "Nouvelle facture" bien visible
  - [ ] Derniers documents créés (3-5 max)
  - [ ] Lien vers tous les documents

### Paramètres Utilisateur
- [ ] Page profil utilisateur simple
  - [ ] Modifier nom/prénom
  - [ ] Modifier email
  - [ ] Modifier mot de passe

### Finalisation
- [ ] Vérifier la responsivité mobile
- [ ] Pages d'erreur (404, 500)
- [ ] Tests des flows principaux
- [ ] Déploiement sur Vercel

---

## 📊 Résumé des Priorités

| Priorité | Tâche | Statut |
|----------|-------|--------|
| 1 | Migration schéma Prisma | ⏳ À faire |
| 2 | Simplifier backend (module document) | ⏳ À faire |
| 3 | Mettre à jour types frontend | ⏳ À faire |
| 4 | Activer téléchargement PDF | ⏳ À faire |
| 5 | Simplifier liste documents | ⏳ À faire |
| 6 | Ajouter infos émetteur au formulaire | ⏳ À faire |
| 7 | Dashboard simple | ⏳ À faire |
| 8 | Finalisation et déploiement | ⏳ À faire |

---

## 📁 Nouvelle Structure Simplifiée

```
src/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── documents/
│   │   │   ├── page.tsx          # Liste des documents
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Création (split-screen)
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx  # Édition (split-screen)
│   │   ├── templates/
│   │   │   ├── page.tsx          # Galerie de templates
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Prévisualisation template
│   │   └── settings/
│   │       └── page.tsx          # Paramètres utilisateur
│   ├── (auth)/                   # Pages auth (inchangé)
│   └── api/
│       ├── auth/                 # Routes auth (inchangé)
│       ├── documents/            # CRUD documents
│       └── templates/            # Templates (inchangé)
├── components/
│   ├── document/                 # Composants document (ex-invoice)
│   │   ├── creator/              # Split-screen creator
│   │   ├── forms/                # Formulaires
│   │   └── ...
│   ├── templates/                # Composants templates (inchangé)
│   ├── pdf/                      # Composants PDF (inchangé)
│   └── ...
├── hooks/
│   ├── use-documents.ts
│   ├── use-document-creator.ts
│   └── ...
├── services/
│   ├── document.service.ts
│   └── ...
└── types/
    ├── document.ts
    └── ...
```

---

## 🔗 API Routes Simplifiées

### Authentification (inchangé)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification-code`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Documents
- `GET /api/documents` - Liste des documents
- `POST /api/documents` - Créer/Sauvegarder un document
- `GET /api/documents/:id` - Récupérer un document
- `PUT /api/documents/:id` - Modifier un document
- `DELETE /api/documents/:id` - Supprimer un document
- `POST /api/documents/:id/duplicate` - Dupliquer un document

### Templates (inchangé)
- `GET /api/templates` - Liste des templates
- `GET /api/templates/:id` - Détail d'un template