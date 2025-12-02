# Hooks

Ce dossier contient les hooks React personnalisés pour l'application de facturation.

## Hooks disponibles

### `useInvoices`

Hook pour récupérer la liste des factures avec pagination, filtres et tri.

```tsx
import { useInvoices } from "@/hooks/use-invoices";

const { invoices, total, isLoading, setStatus, setSearch, setPage, refetch } = useInvoices({
  initialQuery: { limit: 20, sortBy: "createdAt", sortOrder: "desc" },
});
```

**Options:**
- `initialQuery` - Query initiale (status, search, limit, offset, sortBy, sortOrder)
- `autoFetch` - Récupérer automatiquement au montage (défaut: true)

**Retour:**
- `invoices` - Liste des factures
- `total` - Nombre total de factures
- `limit` / `offset` - Pagination
- `isLoading` - État de chargement
- `error` - Message d'erreur
- `setStatus(status)` - Filtrer par statut
- `setSearch(search)` - Rechercher
- `setPage(page)` - Changer de page
- `setSortBy(sortBy)` - Changer le tri
- `setSortOrder(sortOrder)` - Changer l'ordre
- `refetch()` - Recharger les données

---

### `useInvoice`

Hook pour récupérer une facture par son ID.

```tsx
import { useInvoice } from "@/hooks/use-invoice";

const { invoice, isLoading, error, refetch } = useInvoice(invoiceId);
```

---

### `useInvoiceStats`

Hook pour récupérer les statistiques des factures.

```tsx
import { useInvoiceStats } from "@/hooks/use-invoice-stats";

const { stats, isLoading, refetch } = useInvoiceStats();

// stats = { totalCount, draftCount, sentCount, paidCount, overdueCount, totalRevenue }
```
