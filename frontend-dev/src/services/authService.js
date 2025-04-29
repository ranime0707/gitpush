// src/services/authService.js

import axios from 'axios';

// Utilisation d'une variable d'environnement pour l'URL de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';  // Remplace par ton URL de backend

// Fonction pour gérer la réponse d'axios et gérer les erreurs
const handleResponse = (response) => {
    return response.data;
};

const handleError = (error) => {
    if (error.response) {
        // Si la réponse du serveur existe
        return Promise.reject(error.response.data);
    } else if (error.request) {
        // Si la requête a été envoyée mais aucune réponse reçue
        return Promise.reject({ error: 'Aucune réponse reçue du serveur.' });
    } else {
        // Erreur de configuration de la requête
        return Promise.reject({ error: `Erreur: ${error.message}` });
    }
};

// Inscription
export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { email, password });
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// Connexion
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// Mot de passe oublié
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// Réinitialiser mot de passe
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password/${token}`, { newPassword });
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};
