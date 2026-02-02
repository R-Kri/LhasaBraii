'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Phone,
    ArrowLeft,
    BookOpen,
    User,
    MessageSquare,
    Loader2,
    Calendar,
    Mail,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Order {
    id: string;
    status: string;
    price: number;
    buyer_phone: string | null;
    seller_phone: string | null;
    notes: string | null;
    buyer_confirmed_at: string | null;
    seller_confirmed_at: string | null;
    created_at: string;
    updated_at: string;
    buyer_id: string;
    seller_id: string;
    book: {
        id: string;
        title: string;
        author: string;
        images: string[];
        condition: string;
        description?: string;
        isbn?: string;
    } | null;
    buyer: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
        email: string | null;
    } | null;
    seller: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
        email: string | null;
    } | null;
}

const getStatusBadge = (status: string, isSeller: boolean) => {
    switch (status) {
        case 'initiated':
            return (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    {isSeller ? 'New Order' : 'Pending'}
                </Badge>
            );
        case 'buyer_confirmed':
            return (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {isSeller ? 'Confirm Payment' : 'Awaiting Seller'}
                </Badge>
            );
        case 'completed':
            return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
        case 'cancelled':
            return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'initiated':
            return <Clock className="w-6 h-6 text-yellow-600" />;
        case 'buyer_confirmed':
            return <Package className="w-6 h-6 text-blue-600" />;
        case 'completed':
            return <CheckCircle className="w-6 h-6 text-green-600" />;
        case 'cancelled':
            return <XCircle className="w-6 h-6 text-red-600" />;
        default:
            return <Package className="w-6 h-6 text-gray-600" />;
    }
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orderId, setOrderId] = useState<string>('');
    const [order, setOrder] = useState<Order | null>(null);
    const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Get order ID from params
    useEffect(() => {
        const getOrderId = async () => {
            const { id } = await params;
            setOrderId(id);
        };
        getOrderId();
    }, [params]);

    const fetchOrder = useCallback(async () => {
        if (!orderId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/orders/${orderId}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch order');
            }

            setOrder(result.data);
            setUserRole(result.userRole);
        } catch (err) {
            console.error('Fetch order error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load order');
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOrder();
    }, [user, authLoading, router, orderId, fetchOrder]);

    const handleAction = async (action: 'buyer_confirm' | 'seller_confirm' | 'cancel') => {
        if (!orderId) return;

        setActionLoading(true);
        setActionMessage(null);

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update order');
            }

            setActionMessage({ type: 'success', text: result.message });
            await fetchOrder(); // Refresh order data
        } catch (err) {
            console.error('Order action error:', err);
            setActionMessage({
                type: 'error',
                text: err instanceof Error ? err.message : 'Failed to update order',
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <Card className="max-w-md mx-auto border-red-200 bg-red-50">
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
                            <p className="text-red-700 mb-4">{error || 'Order not found'}</p>
                            <Button onClick={() => router.back()} variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    const book = Array.isArray(order.book) ? order.book[0] : order.book;
    const buyer = Array.isArray(order.buyer) ? order.buyer[0] : order.buyer;
    const seller = Array.isArray(order.seller) ? order.seller[0] : order.seller;
    const otherParty = userRole === 'buyer' ? seller : buyer;
    const otherPartyLabel = userRole === 'buyer' ? 'Seller' : 'Buyer';
    const contactPhone = userRole === 'buyer' ? (seller?.phone || order.seller_phone) : (buyer?.phone || order.buyer_phone);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to {userRole === 'buyer' ? 'Orders' : 'Sales'}
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(order.status)}
                                        <div>
                                            <h1 className="text-xl font-bold">Order Details</h1>
                                            <p className="text-sm text-gray-500">
                                                Order ID: {order.id.slice(0, 8)}...
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(order.status, userRole === 'seller')}
                                </div>

                                {/* Status Description */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-gray-700">
                                        {order.status === 'initiated' && userRole === 'buyer' &&
                                            'Contact the seller and arrange to meet. After receiving the book and paying, confirm below.'}
                                        {order.status === 'initiated' && userRole === 'seller' &&
                                            'A buyer is interested in your book. Contact them to arrange the exchange.'}
                                        {order.status === 'buyer_confirmed' && userRole === 'buyer' &&
                                            'You have confirmed receipt. Waiting for the seller to confirm payment received.'}
                                        {order.status === 'buyer_confirmed' && userRole === 'seller' &&
                                            'The buyer confirmed they received the book and paid. Please confirm you received the payment.'}
                                        {order.status === 'completed' &&
                                            'This transaction has been completed successfully.'}
                                        {order.status === 'cancelled' &&
                                            'This order has been cancelled.'}
                                    </p>
                                </div>

                                {/* Action Message */}
                                {actionMessage && (
                                    <div
                                        className={`mb-4 p-3 rounded-lg text-sm ${
                                            actionMessage.type === 'success'
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}
                                    >
                                        {actionMessage.text}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    {order.status === 'initiated' && userRole === 'buyer' && (
                                        <Button
                                            onClick={() => handleAction('buyer_confirm')}
                                            disabled={actionLoading}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {actionLoading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                            )}
                                            Confirm Receipt & Payment
                                        </Button>
                                    )}

                                    {order.status === 'buyer_confirmed' && userRole === 'seller' && (
                                        <Button
                                            onClick={() => handleAction('seller_confirm')}
                                            disabled={actionLoading}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {actionLoading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                            )}
                                            Confirm Payment Received
                                        </Button>
                                    )}

                                    {(order.status === 'initiated' || order.status === 'buyer_confirmed') && (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleAction('cancel')}
                                            disabled={actionLoading}
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Cancel Order
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Book Details */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Book Details
                                </h2>
                                <div className="flex gap-4">
                                    <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                                        {book?.images && book.images.length > 0 ? (
                                            <Image
                                                src={book.images[0]}
                                                alt={book.title || 'Book'}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <BookOpen className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{book?.title || 'Unknown Book'}</h3>
                                        <p className="text-gray-600">{book?.author || 'Unknown Author'}</p>
                                        <Badge variant="secondary" className="mt-2">
                                            {book?.condition || 'Unknown Condition'}
                                        </Badge>
                                        {book?.isbn && (
                                            <p className="text-xs text-gray-500 mt-2">ISBN: {book.isbn}</p>
                                        )}
                                        {book?.description && (
                                            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                                {book.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">₹{order.price}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {order.notes && (
                            <Card>
                                <CardContent className="pt-6">
                                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Notes from Buyer
                                    </h2>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Contact Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    {otherPartyLabel} Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                            {otherParty?.first_name?.charAt(0) || otherParty?.last_name?.charAt(0) || otherPartyLabel.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                {otherParty?.first_name || otherParty?.last_name
                                                    ? `${otherParty?.first_name || ''} ${otherParty?.last_name || ''}`.trim()
                                                    : otherPartyLabel}
                                            </p>
                                            <p className="text-sm text-gray-500">{otherPartyLabel}</p>
                                        </div>
                                    </div>

                                    {contactPhone && (
                                        <a
                                            href={`tel:${contactPhone}`}
                                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span className="font-medium">{contactPhone}</span>
                                        </a>
                                    )}

                                    {otherParty?.email && (
                                        <a
                                            href={`mailto:${otherParty.email}`}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span className="font-medium text-sm truncate">{otherParty.email}</span>
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="font-semibold mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Timeline
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Order Created</span>
                                        <span className="font-medium">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {order.buyer_confirmed_at && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Buyer Confirmed</span>
                                            <span className="font-medium">
                                                {new Date(order.buyer_confirmed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {order.seller_confirmed_at && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Completed</span>
                                            <span className="font-medium">
                                                {new Date(order.seller_confirmed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Last Updated</span>
                                        <span className="font-medium">
                                            {new Date(order.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Links */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="font-semibold mb-4">Quick Links</h2>
                                <div className="space-y-2">
                                    {book && (
                                        <Link href={`/books/${book.id}`}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                View Book Listing
                                            </Button>
                                        </Link>
                                    )}
                                    <Link href={userRole === 'buyer' ? '/orders' : '/sales'}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Package className="w-4 h-4 mr-2" />
                                            All {userRole === 'buyer' ? 'Orders' : 'Sales'}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
