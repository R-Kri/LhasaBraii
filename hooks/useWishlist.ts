'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

interface WishlistBook {
    id: string;
    title: string;
    author: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    status: string;
}

interface WishlistItem {
    id: string;
    created_at: string;
    book: WishlistBook;
}

export function useWishlist() {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            setWishlistIds(new Set());
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/wishlist');
            const result = await response.json();

            if (result.success) {
                setWishlist(result.data);
                setWishlistIds(new Set(result.data.map((item: WishlistItem) => item.book?.id).filter(Boolean)));
            } else {
                setError(result.error);
            }
        } catch {
            setError('Failed to fetch wishlist');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = useCallback(async (bookId: string): Promise<boolean> => {
        if (!user) {
            setError('Please login to add to wishlist');
            return false;
        }

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ book_id: bookId }),
            });

            const result = await response.json();

            if (result.success) {
                setWishlistIds(prev => new Set([...prev, bookId]));
                await fetchWishlist();
                return true;
            } else {
                setError(result.error);
                return false;
            }
        } catch {
            setError('Failed to add to wishlist');
            return false;
        }
    }, [user, fetchWishlist]);

    const removeFromWishlist = useCallback(async (bookId: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const response = await fetch(`/api/wishlist?book_id=${bookId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setWishlistIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(bookId);
                    return newSet;
                });
                setWishlist(prev => prev.filter(item => item.book?.id !== bookId));
                return true;
            } else {
                setError(result.error);
                return false;
            }
        } catch {
            setError('Failed to remove from wishlist');
            return false;
        }
    }, [user]);

    const toggleWishlist = useCallback(async (bookId: string): Promise<boolean> => {
        if (wishlistIds.has(bookId)) {
            return removeFromWishlist(bookId);
        } else {
            return addToWishlist(bookId);
        }
    }, [wishlistIds, removeFromWishlist, addToWishlist]);

    const isInWishlist = useCallback((bookId: string): boolean => {
        return wishlistIds.has(bookId);
    }, [wishlistIds]);

    const count = useMemo(() => wishlist.length, [wishlist.length]);

    return useMemo(() => ({
        wishlist,
        wishlistIds,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
        count,
    }), [wishlist, wishlistIds, loading, error, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, fetchWishlist, count]);
}
