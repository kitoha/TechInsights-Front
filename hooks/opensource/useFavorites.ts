"use client";

import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "techinsights_favorite_repos";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
            try {
                const parsed: unknown = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
                    setFavorites(parsed);
                } else {
                    localStorage.removeItem(FAVORITES_KEY);
                    setFavorites([]);
                }
            } catch (e) {
                console.error("Failed to parse favorites", e);
                localStorage.removeItem(FAVORITES_KEY);
                setFavorites([]);
            }
        }
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            const isFav = prev.includes(id);
            const next = isFav ? prev.filter((fid) => fid !== id) : [...prev, id];
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

    return { favorites, toggleFavorite, isFavorite };
}
