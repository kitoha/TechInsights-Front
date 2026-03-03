"use client";

import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "techinsights_favorite_repos";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse favorites", e);
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
