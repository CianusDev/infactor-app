"use server";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { getToken } from "../../services/session.service";
import { envConfig } from "./env";

// Création d'une instance axios
export const api: AxiosInstance = axios.create({
  baseURL: envConfig.API_URL + `/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  async (config) => {
    // Vous pouvez ajouter des tokens d'authentification ici
    const session = await getToken();

    // On récupère le token de la session entreprise ou membre si disponible
    const token = session?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data;
      console.log({ message, status });
      return {
        data: message,
        status,
      };
    } else if (error.request) {
      console.error("Erreur de requête: Pas de réponse reçue");
    } else {
      console.error("Erreur:", error.message);
    }
    return Promise.reject(error);
  },
);
