'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CartBook {
    id: string;
    title: string;
    author: string;
    price: number;
    images: string[];
    condition: string;
    status: string;
    seller_id: string;
}

interface CartItem {
    id: string;
    quantity: number;
    created_at: string;
    book: CartBook | CartBook[];
}

interface CartSummary {
    itemCount: number;
    subtotal: number;
    total: number;
}

interface UseCartReturn {
    items: CartItem[];
    summary: CartSummary;
    loading: boolean;
    error: string | null;
    addToCart: (bookId: string, quantity?: number) => Promise<{ success: boolean; message: string }>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
    removeItem: (cartItemId: string) => Promise<boolean>;
    clearCart: () => void;
    refreshCart: () => Promise<void>;
}

export function useCart(): UseCartReturn {
    const [items, setItems] = useState<CartItem[]>([]);
    const [summary, setSummary] = useState<CartSummary>({
        itemCount: 0,
        subtotal: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = useCallback(async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setItems([]);
                setSummary({ itemCount: 0, subtotal: 0, total: 0 });
                setLoading(false);
                return;
            }

            const response = await fetch('/api/cart');
            const result = await response.json();

            if (response.ok) {
                setItems(result.data || []);
                setSummary(result.summary || { itemCount: 0, subtotal: 0, total: 0 });
                setError(null);
            } else {
                setError(result.error || 'Failed to fetch cart');
            }
        } catch (err) {
            console.error('Cart fetch error:', err);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (bookId: string, quantity: number = 1): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ book_id: bookId, quantity }),
            });

            const result = await response.json();

            if (response.ok) {
                await fetchCart(); // Refresh cart
                return { success: true, message: result.message || 'Added to cart' };
            } else {
                return { success: false, message: result.error || 'Failed to add to cart' };
            }
        } catch (err) {
            console.error('Add to cart error:', err);
            return { success: false, message: 'Failed to add to cart' };
        }
    }, [fetchCart]);

    const updateQuantity = useCallback(async (cartItemId: string, quantity: number): Promise<boolean> => {
        try {
            const response = await fetch(`/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }),
            });

            if (response.ok) {
                await fetchCart(); // Refresh cart
                return true;
            }
            return false;
        } catch (err) {
            console.error('Update quantity error:', err);
            return false;
        }
    }, [fetchCart]);

    const removeItem = useCallback(async (cartItemId: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/cart/${cartItemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchCart(); // Refresh cart
                return true;
            }
            return false;
        } catch (err) {
            console.error('Remove item error:', err);
            return false;
        }
    }, [fetchCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        setSummary({ itemCount: 0, subtotal: 0, total: 0 });
    }, []);

    const refreshCart = useCallback(async () => {
        setLoading(true);
        await fetchCart();
    }, [fetchCart]);

    return {
        items,
        summary,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
    };
}

// Helper to get normalized book from cart item
export function getCartItemBook(item: CartItem): CartBook | null {
    if (!item.book) return null;
    return Array.isArray(item.book) ? item.book[0] : item.book;
}
