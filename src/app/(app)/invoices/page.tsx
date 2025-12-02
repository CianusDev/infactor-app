"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/use-documents";
import { deleteDocument, duplicateDocument } from "@/services/document.service";
import { DocumentWithItems } from "@/types/document";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DocumentPDFDownloadButton } from "@/components/pdf";
import { DocumentThumbnail } from "@/components/invoice";

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [documentToDelete, setDocumentToDelete] =
    useState<DocumentWithItems | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  const { documents, total, isLoading, setSearch, refetch } = useDocuments({
    initialQuery: {
      limit: 20,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  // Gérer la recherche
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setSearch(value);
    },
    [setSearch],
  );

  // Créer un nouveau document
  const handleCreate = useCallback(() => {
    router.push("/invoices/new");
  }, [router]);

  // Éditer un document
  const handleEdit = useCallback(
    (document: DocumentWithItems) => {
      router.push(`/invoices/${document.id}/edit`);
    },
    [router],
  );

  // Dupliquer un document
  const handleDuplicate = useCallback(
    async (document: DocumentWithItems) => {
      setIsDuplicating(document.id);
      try {
        const result = await duplicateDocument(document.id);
        if (result.success) {
          toast.success("Document dupliqué avec succès");
          refetch();
        } else {
          toast.error(result.message || "Erreur lors de la duplication");
        }
      } catch (error) {
        toast.error("Une erreur inattendue s'est produite");
        console.error("Erreur de duplication:", error);
      } finally {
        setIsDuplicating(null);
      }
    },
    [refetch],
  );

  // Supprimer un document
  const handleDelete = useCallback((document: DocumentWithItems) => {
    setDocumentToDelete(document);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteDocument(documentToDelete.id);
      if (result.success) {
        toast.success("Document supprimé avec succès");
        refetch();
      } else {
        toast.error(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite");
      console.error("Erreur de suppression:", error);
    } finally {
      setIsDeleting(false);
      setDocumentToDelete(null);
    }
  }, [documentToDelete, refetch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Mes Documents
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} document{total > 1 ? "s" : ""} enregistré
            {total > 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau document
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un document..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Liste des documents */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              Aucun document
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              {searchQuery
                ? "Aucun document ne correspond à votre recherche."
                : "Vous n'avez pas encore créé de document. Commencez par en créer un !"}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((document) => (
            <Card
              key={document.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => handleEdit(document)}
            >
              {/* Thumbnail */}
              <div className="relative bg-muted/30">
                <DocumentThumbnail
                  document={document}
                  width={300}
                  height={200}
                  className="w-full h-48 border-0 rounded-none"
                />

                {/* Actions overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(document);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(document);
                        }}
                        disabled={isDuplicating === document.id}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {isDuplicating === document.id
                          ? "Duplication..."
                          : "Dupliquer"}
                      </DropdownMenuItem>
                      <DocumentPDFDownloadButton
                        document={document}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-2 py-1.5 h-auto font-normal"
                      >
                        Télécharger PDF
                      </DocumentPDFDownloadButton>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(document);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Infos du document */}
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground truncate mb-1">
                  {document.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate mb-3">
                  {document.clientName}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(document.issueDate)}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(Number(document.total), document.currency)}
                  </span>
                </div>

                {/* Template badge */}
                {document.template && (
                  <div className="mt-2 pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Modèle : {document.template.name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le document{" "}
              <strong>{documentToDelete?.name}</strong> ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
