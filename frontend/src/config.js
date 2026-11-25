// URL backenda. Pri gradnji za produkcijo ga nastavi okoljska spremenljivka
// VITE_API_URL, lokalno se uporabi privzeti naslov.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
