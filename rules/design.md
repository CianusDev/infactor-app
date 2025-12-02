# Design Patterns & Conventions - Billing App

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Routes authentifiées (dashboard, factures)
│   ├── (auth)/            # Routes publiques auth (login, signup, etc.)
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── reset-password/
│   │   ├── signup/
│   │   └── verify-email/
│   ├── admin/             # Routes admin
│   ├── api/               # API Routes Next.js
│   ├── globals.css        # Styles globaux (Tailwind)
│   └── layout.tsx         # Layout racine
├── components/
│   ├── forms/             # Composants formulaires
│   │   └── auth/          # Formulaires d'authentification
│   ├── shared/            # Composants partagés réutilisables
│   └── ui/                # Composants UI (shadcn/ui)
├── generated/
│   └── prisma/            # Client Prisma généré
├── guards/                # Guards d'authentification
├── hooks/                 # Custom React hooks
├── lib/                   # Utilitaires et helpers
├── providers/             # React Context providers
├── server/                # Logique serveur
│   ├── config/            # Configurations (db, email, env, routes, session)
│   ├── middlewares/       # Middlewares API
│   └── modules/           # Modules métier
├── services/              # Services côté client (Server Actions)
├── stores/                # State management (Zustand)
├── types/                 # Types TypeScript globaux
└── proxy.ts               # Middleware de routage (auth guards)
```

---

## 🧱 Pattern Repository-Service-Controller

Chaque module métier dans `src/server/modules/` suit cette architecture :

```
src/server/modules/[module]/
├── index.ts               # Export centralisé du module
├── [module].controller.ts # Validation des entrées + orchestration
├── [module].service.ts    # Logique métier
├── [module].repository.ts # Accès aux données (Prisma)
└── [module].schema.ts     # Schémas Zod + types exportés
```

### Modules existants

| Module | Description |
|--------|-------------|
| `user` | Gestion des utilisateurs et authentification |
| `otp` | Gestion des codes OTP |
| `business-profile` | Profil entreprise (logo, infos, etc.) |
| `invoice` | Gestion des factures |
| `template` | Templates de factures |

### Responsabilités

| Couche | Responsabilité |
|--------|----------------|
| **Controller** | Valide les données avec Zod, attrape les erreurs de validation, appelle le service |
| **Service** | Contient la logique métier, gère les règles, appelle le repository |
| **Repository** | Interagit avec Prisma, requêtes DB uniquement |
| **Schema** | Définit les schémas Zod et exporte les types inférés |

### Exemple de flux

```
API Route → Controller.method()
                ↓ validation Zod
           Service.method()
                ↓ logique métier
           Repository.method()
                ↓ requête Prisma
           Base de données
```

---

## 🔐 Authentification & Guards

### Flow JWT

1. **Login/Register** → Génération token JWT avec `createUserToken()`
2. **Token** contient : `{ user, role }` avec expiration configurable
3. **Vérification** via `verifyUserToken()` dans les middlewares/guards
4. **Session** côté client gérée via cookies httpOnly

### Guards (`src/guards/auth.guard.ts`)

| Fonction | Description |
|----------|-------------|
| `redirectToLogin()` | Redirige vers `/login` si non authentifié sur route protégée |
| `redirectToDashboard()` | Redirige vers le dashboard si authentifié sur route auth |

### Proxy (`src/proxy.ts`)

Le proxy intercepte les requêtes et applique les guards :

```typescript
export async function proxy(request: NextRequest) {
  const signInRedirect = await redirectToLogin(request);
  if (signInRedirect) return signInRedirect;

  const dashboardRedirect = await redirectToDashboard(request);
  if (dashboardRedirect) return dashboardRedirect;
}
```

### Flow de réinitialisation de mot de passe

```
/forgot-password (email)
    → POST /api/auth/forgot-password
    → Envoie code OTP par email

/reset-password (code + nouveau mot de passe)
    → POST /api/auth/reset-password
    → Vérifie code OTP + met à jour le mot de passe
```

### Durées de validité

| Type | Durée |
|------|-------|
| Token utilisateur | 7 jours |
| Token admin | 1 jour |
| Code OTP | 10 minutes |

---

## 🛣️ Routes Centralisées

Les routes sont définies dans `src/server/config/routes.ts` :

```typescript
export const routes = {
  auth: {
    login: "/login",
    signup: "/signup",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  app: {
    dashboard: { overview: "/dashboard" },
    invoices: {
      list: "/invoices",
      new: "/invoices/new",
      detail: (id: string) => `/invoices/${id}`,
      edit: (id: string) => `/invoices/${id}/edit`,
    },
    settings: {
      profile: "/settings/profile",
      business: "/settings/business",
    },
  },
  admin: { ... },
};
```

### Catégories de routes

| Variable | Description |
|----------|-------------|
| `publicRoutes` | Routes accessibles sans authentification |
| `authRoutes` | Routes d'authentification (login, signup, etc.) |
| `protectedRoutes` | Routes nécessitant une authentification |
| `adminRoutes` | Routes réservées aux administrateurs |
| `userRoutes` | Routes réservées aux utilisateurs |

---

## ✅ Validation avec Zod

### Convention de nommage

```typescript
// Schéma
export const createInvoiceSchema = z.object({ ... });

// Type inféré
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
```

### Gestion des erreurs de validation

```typescript
try {
  const validated = schema.parse(data);
  return await service.method(validated);
} catch (error) {
  if (error instanceof ZodError) {
    throw new ValidationError(
      error.issues.map((e) => e.message).join(", ")
    );
  }
  throw error;
}
```

---

## ⚠️ Gestion des Erreurs

### Classes d'erreurs personnalisées (`src/lib/errors.ts`)

| Classe | Code HTTP | Usage |
|--------|-----------|-------|
| `ValidationError` | 400 | Données invalides |
| `UnauthorizedError` | 401 | Non authentifié |
| `ForbiddenError` | 403 | Accès interdit |
| `NotFoundError` | 404 | Ressource non trouvée |
| `ConflictError` | 409 | Conflit (ex: email déjà utilisé) |
| `InternalServerError` | 500 | Erreur serveur |

### Handler centralisé

```typescript
// Dans les API routes
import { handleApiError } from "@/lib/errors";

try {
  // ... logique
} catch (error) {
  return handleApiError(error);
}
```

---

## 🎨 UI & Composants

### Stack UI

- **Framework CSS** : Tailwind CSS v4
- **Composants** : shadcn/ui (style `new-york`)
- **Icônes** : Lucide React
- **Animations** : tw-animate-css

### Organisation des composants

```
src/components/
├── forms/                 # Formulaires
│   └── auth/              # Formulaires d'authentification
│       ├── login-form.tsx
│       ├── signup-form.tsx
│       ├── forgot-password-form.tsx
│       ├── reset-password-form.tsx
│       └── otp-form.tsx
├── shared/                # Composants partagés
│   ├── auth-header.tsx    # Header des pages auth
│   ├── auth-footer.tsx    # Footer avec liens
│   ├── form-input.tsx     # Input avec label/description/error
│   ├── logo.tsx           # Logo de l'application
│   ├── oauth-button.tsx   # Boutons OAuth (GitHub, Google)
│   └── index.ts           # Export centralisé
└── ui/                    # Composants shadcn/ui
    ├── button.tsx
    ├── input.tsx
    ├── field.tsx
    └── ...
```

### Composants partagés (`src/components/shared/`)

| Composant | Props | Description |
|-----------|-------|-------------|
| `AuthHeader` | `title`, `description`, `showLogo` | En-tête des pages auth |
| `AuthFooterLink` | `text`, `linkText`, `href` | Lien de navigation |
| `AuthFooterLegal` | `termsHref`, `privacyHref` | Mentions légales |
| `OAuthButton` | `provider`, `action` | Bouton OAuth |
| `FormInput` | `label`, `description`, `error`, `labelRight` | Champ de formulaire |

### Alias d'import

```typescript
import { Button } from "@/components/ui/button";
import { AuthHeader, FormInput, OAuthButton } from "@/components/shared";
import { routes } from "@/server/config/routes";
```

---

## 📡 API Routes

### Structure des routes

```
src/app/api/
├── auth/
│   ├── forgot-password/route.ts   # Demande reset password
│   ├── login/route.ts
│   ├── register/route.ts
│   ├── resend-reset-code/route.ts # Renvoyer code reset
│   ├── resend-verification-code/route.ts
│   ├── reset-password/route.ts    # Réinitialiser password
│   └── verify-email/route.ts
├── business-profile/
│   ├── route.ts                   # GET, PUT
│   └── logo/route.ts              # POST (upload)
├── invoices/
│   ├── route.ts                   # GET (liste), POST
│   ├── stats/route.ts             # GET (statistiques)
│   └── [id]/
│       ├── route.ts               # GET, PUT, DELETE
│       └── status/route.ts        # PATCH
└── templates/
    ├── route.ts                   # GET, POST (admin)
    └── [id]/route.ts              # GET, PUT, DELETE (admin)
```

### Convention de réponse API

```typescript
// Succès
return NextResponse.json({ data, message }, { status: 200 });

// Erreur
return NextResponse.json({ error: "Message" }, { status: 4xx });
```

### Type de réponse standard

```typescript
type APIResponse = {
  data?: unknown;
  message?: string;
  success: boolean;
};
```

---

## 🔄 Services Client (Server Actions)

Les services dans `src/services/` utilisent `"use server"` et encapsulent les appels API :

```typescript
"use
 server";

export async function signin(payload: LoginUserInput) {
  const result = await api.post("/auth/login", payload);
  // Gestion session + retour formaté
  return prepareDataApi(status, data, error);
}
```

---

## 🗄️ Base de Données

### Configuration Prisma

- **Provider** : PostgreSQL
- **Adapter** : `@prisma/adapter-pg`
- **Output** : `src/generated/prisma`

### Modèles

| Modèle | Description |
|--------|-------------|
| `User` | Utilisateurs de l'application |
| `OTP` | Codes de vérification temporaires |
| `BusinessProfile` | Profil entreprise (1:1 avec User) |
| `Invoice` | Factures avec infos client intégrées |
| `InvoiceItem` | Lignes de facture |
| `Template` | Modèles de factures |

### Conventions

- IDs : `cuid()` par défaut
- Timestamps : `createdAt` et `updatedAt` sur chaque modèle
- Soft delete : non implémenté (suppression réelle)
- Index : sur les clés étrangères et champs de recherche

### Commandes utiles

```bash
pnpm prisma:generate   # Générer le client
pnpm prisma:push       # Push schema vers DB
pnpm prisma:migrate    # Créer une migration
pnpm prisma:studio     # Interface visuelle
pnpm prisma:seed       # Seed des données (templates)
```

---

## 📝 Conventions de Code

### Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Fichiers | kebab-case | `user.service.ts` |
| Classes | PascalCase | `UserService` |
| Fonctions | camelCase | `createInvoice` |
| Constantes | UPPER_SNAKE_CASE | `HTTP_STATUS` |
| Types/Interfaces | PascalCase | `CreateUserInput` |
| Composants React | PascalCase | `LoginForm` |

### Imports

```typescript
// 1. Dépendances externes
import { NextResponse } from "next/server";
import z from "zod";

// 2. Alias internes (@/)
import { prisma } from "@/server/config/database";
import { ValidationError } from "@/lib/errors";
import { routes } from "@/server/config/routes";

// 3. Imports relatifs
import { UserRepository } from "./user.repository";
```

### Logger

```typescript
import { Logger } from "@/lib/helpers";

Logger.log("Message info");
Logger.warn("Message warning");
Logger.error("Message erreur");
```

---

## 📧 Emails

### Configuration (`src/server/config/email.ts`)

- **Transport** : Nodemailer avec Gmail SMTP
- **Templates** : HTML intégrés avec styles inline

### Templates disponibles

| Template | Usage |
|----------|-------|
| `verificationCode` | Code OTP pour vérification email |
| `resendVerificationCode` | Renvoi du code de vérification |
| `resetPasswordCode` | Code OTP pour reset password |
| `resetPasswordSuccess` | Confirmation de changement de mot de passe |