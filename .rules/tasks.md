# Tâches de Développement - Billing App MVP

## ✅ Phase 1 : Configuration et Infrastructure (COMPLÉTÉ)

- [x] Initialiser le projet Next.js 16
- [x] Configurer Prisma avec PostgreSQL
- [x] Mettre en place la structure des dossiers du projet
- [x] Configurer les variables d'environnement
- [x] Configurer ESLint
- [x] Configurer Tailwind CSS et shadcn/ui
- [x] Configurer Cloudinary pour l'upload d'images
- [x] Configurer Nodemailer pour l'envoi d'emails

## ✅ Phase 2 : Authentification Backend (COMPLÉTÉ)

- [x] Créer le modèle User dans Prisma
- [x] Créer le modèle OTP dans Prisma
- [x] Implémenter le module user (controller, service, repository, schema)
- [x] Implémenter le module otp (service, repository, schema)
- [x] Créer l'API route POST /api/auth/register
- [x] Créer l'API route POST /api/auth/login
- [x] Créer l'API route POST /api/auth/verify-email
- [x] Créer l'API route POST /api/auth/resend-verification-code
- [x] Créer l'API route POST /api/auth/forgot-password
- [x] Créer l'API route POST /api/auth/reset-password
- [x] Créer l'API route POST /api/auth/resend-reset-code
- [x] Implémenter les services côté client (auth.service.ts)
- [x] Implémenter la gestion de session (session.service.ts)
- [x] Créer le guard d'authentification

## ✅ Phase 3 : Schéma Base de Données (COMPLÉTÉ)

- [x] Ajouter le modèle BusinessProfile
- [x] Ajouter le modèle Invoice
- [x] Ajouter le modèle InvoiceItem
- [x] Ajouter le modèle Template
- [x] Ajouter l'enum InvoiceStatus
- [x] Mettre à jour le modèle User avec les relations
- [x] Générer la migration Prisma

## ✅ Phase 4 : Backend Profil Entreprise (COMPLÉTÉ)

- [x] Créer le module business-profile (controller, service, repository, schema)
- [x] Créer l'API route GET /api/business-profile
- [x] Créer l'API route PUT /api/business-profile
- [x] Créer l'API route POST /api/business-profile/logo (upload Cloudinary)

## ✅ Phase 5 : Backend Gestion des Factures (COMPLÉTÉ)

- [x] Créer le module invoice (controller, service, repository, schema)
- [x] Implémenter la génération automatique du numéro de facture
- [x] Implémenter le calcul automatique des totaux (HT, TVA, TTC)
- [x] Implémenter la validation des transitions de statut
- [x] Créer l'API route GET /api/invoices (liste avec pagination/filtres)
- [x] Créer l'API route GET /api/invoices/:id
- [x] Créer l'API route POST /api/invoices
- [x] Créer l'API route PUT /api/invoices/:id
- [x] Créer l'API route DELETE /api/invoices/:id
- [x] Créer l'API route PATCH /api/invoices/:id/status
- [x] Créer l'API route GET /api/invoices/stats

## ✅ Phase 6 : Backend Templates (COMPLÉTÉ)

- [x] Créer le module template (controller, service, repository, schema)
- [x] Créer l'API route GET /api/templates
- [x] Créer l'API route GET /api/templates/:id
- [x] Créer l'API route POST /api/templates (admin)
- [x] Créer l'API route PUT /api/templates/:id (admin)
- [x] Créer l'API route DELETE /api/templates/:id (admin)
- [x] Créer le fichier de seed avec 5 templates prédéfinis
- [x] Exécuter le seed des templates

## ✅ Phase 7 : Frontend - Pages Authentification (COMPLÉTÉ)

- [x] Créer la page de connexion (/login)
- [x] Créer la page d'inscription (/signup)
- [x] Créer la page de vérification email (/verify-email)
- [x] Créer la page mot de passe oublié (/forgot-password)
- [x] Créer la page de réinitialisation mot de passe (/reset-password)
- [x] Intégrer l'API dans login-form
- [x] Intégrer l'API dans signup-form
- [x] Intégrer l'API dans otp-form (verify-email)
- [x] Intégrer l'API dans forgot-password-form
- [x] Intégrer l'API dans reset-password-form
- [x] Implémenter la redirection après authentification
- [x] Implémenter la protection des routes (guards)
- [x] Créer les composants partagés (AuthHeader, AuthFooter, FormInput, OAuthButton)
- [x] Ajouter les toasts de notification (sonner)

## ✅ Phase 8 : Frontend - Layout Principal (COMPLÉTÉ)

- [x] Créer le layout principal avec navbar
- [x] Créer la sidebar de navigation
- [x] Adapter le sidebar pour l'application de facturation
- [x] Implémenter le menu utilisateur (déconnexion, profil)
- [x] Ajouter le thème et les styles globaux (ModeToggle)
- [x] Intégrer la recherche rapide (⌘K)
- [x] Ajouter les actions rapides (nouvelle facture)

---

## 📋 Phase 9 : Frontend - Profil Entreprise

- [ ] Créer la page paramètres/profil entreprise (/settings/business)
- [ ] Créer le formulaire d'édition du profil
- [ ] Implémenter l'upload de logo avec preview
- [ ] Implémenter le color picker pour la couleur de marque

## 📋 Phase 10 : Frontend - Liste des Factures

- [ ] Créer la page liste des factures (/invoices)
- [ ] Créer le composant tableau des factures
- [ ] Implémenter les filtres par statut
- [ ] Implémenter la pagination
- [ ] Créer les badges de statut (DRAFT, SENT, PAID, OVERDUE, CANCELLED)
- [ ] Ajouter les actions rapides (voir, modifier, supprimer)

## 📋 Phase 11 : Frontend - Création/Édition de Facture

- [ ] Créer la page création de facture (/invoices/new)
- [ ] Créer la page édition de facture (/invoices/:id/edit)
- [ ] Créer le formulaire principal de facture
- [ ] Créer le composant d'informations client
- [ ] Créer le composant d'ajout/suppression de lignes dynamiques
- [ ] Implémenter le calcul en temps réel des totaux
- [ ] Implémenter la sélection du template
- [ ] Implémenter la sélection des dates (émission, échéance)

## 📋 Phase 12 : Frontend - Détail de Facture

- [ ] Créer la page détail/aperçu de facture (/invoices/:id)
- [ ] Afficher toutes les informations de la facture
- [ ] Ajouter les actions (modifier, supprimer, changer statut)
- [ ] Créer le composant de prévisualisation selon le template

## 📋 Phase 13 : Frontend - Templates

- [ ] Créer le composant de sélection de template
- [ ] Créer les previews des templates
- [ ] Implémenter la prévisualisation en temps réel

## 📋 Phase 14 : Export PDF

### Backend
- [ ] Choisir et intégrer une bibliothèque PDF (@react-pdf/renderer)
- [ ] Créer les composants PDF pour chaque template
- [ ] Créer l'API route GET /api/invoices/:id/pdf
- [ ] Implémenter la génération PDF avec les données de la facture

### Frontend
- [ ] Ajouter le bouton de téléchargement PDF
- [ ] Implémenter l'aperçu avant téléchargement
- [ ] Ajouter l'option d'impression directe

## 📋 Phase 15 : Dashboard

- [ ] Créer la page dashboard (/dashboard)
- [ ] Afficher le résumé des factures par statut
- [ ] Afficher les dernières factures créées
- [ ] Afficher le total des revenus (factures payées)
- [ ] Créer les cards de statistiques simples

## 📋 Phase 16 : Finalisation et Déploiement

### UI/UX
- [ ] Vérifier la responsivité mobile
- [ ] Ajouter les pages d'erreur (404, 500)
- [ ] Optimiser l'accessibilité

### Tests et Qualité
- [ ] Tester tous les endpoints API
- [ ] Tester les flows utilisateur principaux
- [ ] Corriger les bugs identifiés
- [ ] Optimiser les performances

### Déploiement
- [ ] Configurer la base de données PostgreSQL de production
- [ ] Configurer les variables d'environnement sur Vercel
- [ ] Déployer l'application sur Vercel
- [ ] Tester l'application en production
- [ ] Configurer le domaine personnalisé (optionnel)

---

## 📊 Résumé des Priorités

| Priorité | Phase | Statut |
|----------|-------|--------|
| 1 | Configuration et Infrastructure | ✅ Complété |
| 2 | Authentification Backend | ✅ Complété |
| 3 | Schéma Base de Données | ✅ Complété |
| 4 | Backend Profil Entreprise | ✅ Complété |
| 5 | Backend Gestion des Factures | ✅ Complété |
| 6 | Backend Templates | ✅ Complété |
| 7 | Frontend Pages Auth | ✅ Complété |
| 8 | Frontend Layout Principal | ✅ Complété |
| 9 | Frontend Profil Entreprise | ⏳ À faire |
| 10 | Frontend Liste Factures | ⏳ À faire |
| 11 | Frontend Création/Édition Facture | ⏳ À faire |
| 12 | Frontend Détail Facture | ⏳ À faire |
| 13 | Frontend Templates | ⏳ À faire |
| 14 | Export PDF | ⏳ À faire |
| 15 | Dashboard | ⏳ À faire |
| 16 | Finalisation et Déploiement | ⏳ À faire |

---

## 📁 Structure Backend Créée

```
src/server/modules/
├── business-profile/
│   ├── index.ts
│   ├── business-profile.controller.ts
│   ├── business-profile.service.ts
│   ├── business-profile.repository.ts
│   └── business-profile.schema.ts
├── invoice/
│   ├── index.ts
│   ├── invoice.controller.ts
│   ├── invoice.service.ts
│   ├── invoice.repository.ts
│   └── invoice.schema.ts
├── template/
│   ├── index.ts
│   ├── template.controller.ts
│   ├── template.service.ts
│   ├── template.repository.ts
│   └── template.schema.ts
├── user/
│   └── ...
└── otp/
    └── ...
```

## 📁 Structure Frontend Auth Créée

```
src/components/
├── forms/
│   └── auth/
│       ├── login-form.tsx
│       ├── signup-form.tsx
│       ├── otp-form.tsx
│       ├── forgot-password-form.tsx
│       └── reset-password-form.tsx
└── shared/
    ├── auth-header.tsx
    ├── auth-footer.tsx
    ├── form-input.tsx
    ├── oauth-button.tsx
    ├── logo.tsx
    └── index.ts

src/app/(auth)/
├── login/page.tsx
├── signup/page.tsx
├── verify-email/page.tsx
├── forgot-password/page.tsx
└── reset-password/page.tsx
```

## 📁 Structure Sidebar Créée

```
src/components/shared/sidebar/
├── index.ts
├── app-sidebard.tsx      # Sidebar principal avec navigation
├── nav-header.tsx        # Header avec logo et recherche (⌘K)
├── nav-main.tsx          # Navigation principale
├── nav-footer.tsx        # Footer avec menu utilisateur
└── types.ts              # Types TypeScript

src/app/(app)/
└── layout.tsx            # Layout avec sidebar et session user
```

## 🔗 API Routes Disponibles

### Authentification
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification-code`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/resend-reset-code`

### Profil Entreprise
- `GET /api/business-profile`
- `PUT /api/business-profile`
- `POST /api/business-profile/logo`

### Factures
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/invoices/:id`
- `PUT /api/invoices/:id`
- `DELETE /api/invoices/:id`
- `PATCH /api/invoices/:id/status`
- `GET /api/invoices/stats`

### Templates
- `GET /api/templates`
- `GET /api/templates/:id`
- `POST /api/templates` (admin)
- `PUT /api/templates/:id` (admin)
- `DELETE /api/templates/:id` (admin)