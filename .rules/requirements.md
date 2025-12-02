# Billing App - Spécifications Techniques et Fonctionnelles

## 1. Spécifications Fonctionnelles

### 1.1 Authentification et Gestion des Utilisateurs

- **Inscription** : Création de compte avec email/mot de passe
- **Vérification email** : Code OTP envoyé par email (6 chiffres, validité 10 min)
- **Connexion** : Authentification sécurisée avec JWT
- **Déconnexion** : Invalidation de la session
- **Récupération de mot de passe** : Réinitialisation via code OTP
- **Renvoi code de vérification** : Possibilité de renvoyer le code OTP

### 1.2 Profil Entreprise (BusinessProfile)

- **Informations entreprise** :
  - Nom de l'entreprise
  - Adresse complète (adresse, ville, code postal, pays)
  - Téléphone
  - SIRET (optionnel)
  - Numéro de TVA (optionnel)
- **Personnalisation** :
  - Upload du logo (via Cloudinary)
  - Couleur de marque personnalisée
- Ces informations apparaîtront automatiquement sur les factures générées

### 1.3 Gestion des Factures

- **Créer une facture** :
  - Numérotation automatique séquentielle (unique par utilisateur)
  - Informations client saisies directement sur la facture :
    - Nom du client (obligatoire)
    - Email, téléphone (optionnels)
    - Adresse complète (optionnelle)
    - SIRET, numéro TVA client (optionnels)
  - Ajout de lignes de facturation :
    - Description du service/produit
    - Quantité
    - Prix unitaire
    - Total calculé automatiquement
  - Calcul automatique des totaux :
    - Sous-total HT
    - Taux de TVA (défaut 20%)
    - Montant TVA
    - Remise (optionnelle)
    - Total TTC
  - Date d'émission (défaut: aujourd'hui)
  - Date d'échéance (optionnelle)
  - Notes et conditions de paiement
  - Sélection d'un template de facture

- **Modifier une facture** : Édition des factures en statut DRAFT uniquement
- **Supprimer une facture** : Suppression définitive avec confirmation
- **Lister les factures** : Affichage paginé avec filtres par statut
- **Aperçu facture** : Visualisation avant export

### 1.4 Statuts des Factures

| Statut | Description |
|--------|-------------|
| `DRAFT` | Brouillon, modifiable |
| `SENT` | Envoyée au client |
| `PAID` | Payée |
| `OVERDUE` | En retard de paiement |
| `CANCELLED` | Annulée |

### 1.5 Templates de Factures

- 3 à 5 modèles prédéfinis disponibles
- Configuration JSON stockée (couleurs, layout, polices)
- Aperçu du template avant sélection
- Template par défaut configurable

### 1.6 Export PDF

- Génération de PDF à partir du template sélectionné
- Inclusion automatique :
  - Logo et infos entreprise (BusinessProfile)
  - Infos client
  - Lignes de facture
  - Totaux
  - Notes et mentions légales
- Téléchargement direct
- Option d'impression

---

## 2. Spécifications Techniques

### 2.1 Stack Technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js | 16.x |
| Runtime | React | 19.x |
| Langage | TypeScript | 5.x |
| Base de données | PostgreSQL | - |
| ORM | Prisma | 7.x |
| Validation | Zod | 4.x |
| State Management | Zustand | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | new-york |
| Icônes | Lucide React | - |
| Auth | JWT (jose/jsonwebtoken) | - |
| Email | Nodemailer | 7.x |
| Upload images | Cloudinary | - |
| HTTP Client | Axios | - |
| Hébergement | Vercel | - |

### 2.2 Architecture Backend

Pattern **Repository-Service-Controller** :

```
src/server/modules/[module]/
├── index.ts               # Exports
├── [module].controller.ts # Validation + orchestration
├── [module].service.ts    # Logique métier
├── [module].repository.ts # Requêtes Prisma
└── [module].schema.ts     # Schémas Zod
```

### 2.3 API Routes

#### Authentification (existant)
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/verify-email` - Vérification email
- `POST /api/auth/resend-verification-code` - Renvoi code
- `POST /api/auth/reset-password` - Réinitialisation mot de passe

#### Profil Entreprise (à créer)
- `GET /api/business-profile` - Récupérer le profil
- `PUT /api/business-profile` - Mettre à jour le profil
- `POST /api/business-profile/logo` - Upload logo

#### Factures (à créer)
- `GET /api/invoices` - Liste des factures (avec pagination/filtres)
- `GET /api/invoices/:id` - Détail d'une facture
- `POST /api/invoices` - Créer une facture
- `PUT /api/invoices/:id` - Modifier une facture
- `DELETE /api/invoices/:id` - Supprimer une facture
- `PATCH /api/invoices/:id/status` - Changer le statut
- `GET /api/invoices/:id/pdf` - Générer/télécharger PDF

#### Templates (à créer)
- `GET /api/templates` - Liste des templates disponibles
- `GET /api/templates/:id` - Détail d'un template

### 2.4 Sécurité

- **Authentification** : JWT avec refresh automatique
- **Autorisation** : Vérification ownership sur chaque ressource
- **Validation** : Schémas Zod sur toutes les entrées
- **Mots de passe** : Hashage bcrypt (10 rounds)
- **Sessions** : Cookies httpOnly
- **CORS** : Configuration restrictive en production

### 2.5 Base de Données

#### Modèles principaux

1. **User** - Utilisateurs de l'application
2. **OTP** - Codes de vérification temporaires
3. **BusinessProfile** - Profil entreprise (1:1 avec User)
4. **Invoice** - Factures avec infos client intégrées
5. **InvoiceItem** - Lignes de facture
6. **Template** - Modèles de factures

#### Contraintes

- `Invoice.invoiceNumber` unique par utilisateur
- `BusinessProfile.userId` unique (1 profil par user)
- Suppression en cascade : User → Invoices → InvoiceItems

---

## 3. Exigences Non-Fonctionnelles

### 3.1 Performance

- Temps de chargement initial < 3s
- Génération PDF < 5s
- Pagination par défaut : 20 éléments

### 3.2 Compatibilité

- Navigateurs : Chrome, Firefox, Safari, Edge (dernières versions)
- Responsive : Mobile, Tablet, Desktop
- PDF : Compatible lecteurs standards (Adobe, navigateurs)

### 3.3 Accessibilité

- Contraste couleurs conforme WCAG 2.1 AA
- Navigation clavier
- Labels sur tous les inputs

### 3.4 Internationalisation (MVP)

- Langue : Français uniquement
- Devise : EUR par défaut (configurable)
- Format dates : DD/MM/YYYY
- Format nombres : 1 234,56 €

---

## 4. Limites du MVP

### Inclus dans le MVP
- ✅ Authentification email/password
- ✅ Création et gestion des factures
- ✅ Infos client directement sur la facture
- ✅ Templates de factures prédéfinis
- ✅ Export PDF
- ✅ Profil entreprise avec logo

### Exclus du MVP (futures versions)
- ❌ Google OAuth
- ❌ Gestion des clients (carnet d'adresses)
- ❌ Factures récurrentes
- ❌ Envoi email automatique des factures
- ❌ Dashboard avec statistiques avancées
- ❌ Multi-devises
- ❌ Multi-langues
- ❌ Devis / Avoirs
- ❌ Paiement en ligne intégré
- ❌ Import/Export CSV