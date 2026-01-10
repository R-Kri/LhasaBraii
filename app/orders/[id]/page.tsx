'use client';

import { useState, useEffect } from 'react';
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
    Check,
    X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderDetail {
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
        description: string | null;
        isbn: string | null;
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

const statusSteps = [
    { key: 'initiated', label: 'Order Placed', icon: Package },
    { key: 'buyer_confirmed', label: 'Buyer Confirmed', icon: Check },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orderId, setOrderId] = useState<string>('');
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Get order ID from params
    useEffect(() => {
        const getOrderId = async () => {
            const { id } = await params;
            setOrderId(id);
        };
        getOrderId();
    }, [params]);

    // Fetch order details
    useEffect(() => {
        if (!orderId || authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                const result = await response.json();

                if (response.ok) {
                    setOrder(result.data);
                    setUserRole(result.userRole);
                    setError(null);
                } else {
                    setError(result.error || 'Failed to fetch order');
                }
            } catch (err) {
                console.error('Fetch order error:', err);
                setError('Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, user, authLoading, router]);

    const handleAction = async (action: 'buyer_confirm' | 'seller_confirm' | 'cancel') => {
        if (!orderId) return;

        setActionLoading(action);
        setActionMessage(null);

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            const result = await response.json();

            if (response.ok) {
                setActionMessage({ type: 'success', text: result.message });
                // Refresh order data
                const refreshResponse = await fetch(`/api/orders/${orderId}`);
                const refreshResult = await refreshResponse.json();
                if (refreshResponse.ok) {
                    setOrder(refreshResult.data);
                }
            } else {
                setActionMessage({ type: 'error', text: result.error || 'Action failed' });
            }
        } catch (err) {
            console.error('Action error:', err);
            setActionMessage({ type: 'error', text: 'Failed to process action' });
        } finally {
            setActionLoading(null);
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
                            <Button onClick={() => router.push('/orders')} variant="outline">
                                Back to Orders
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
    const otherPartyPhone = userRole === 'buyer' ? (seller?.phone || order.seller_phone) : (buyer?.phone || order.buyer_phone);

    const getStepStatus = (stepKey: string) => {
        const statusOrder = ['initiated', 'buyer_confirmed', 'completed'];
        const currentIndex = statusOrder.indexOf(order.status);
        const stepIndex = statusOrder.indexOf(stepKey);

        if (order.status === 'cancelled') return 'cancelled';
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'pending';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                {/* Back Button */}
                <Link href="/orders" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold">Order Details</h1>
                                        <p className="text-sm text-gray-500">Order ID: {order.id.slice(0, 8)}...</p>
                                    </div>
                                    {order.status === 'initiated' && (
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
                                    )}
                                    {order.status === 'buyer_confirmed' && (
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">Awaiting Seller</Badge>
                                    )}
                                    {order.status === 'completed' && (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                                    )}
                                    {order.status === 'cancelled' && (
                                        <Badge className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>
                                    )}
                                </div>

                                {/* Progress Steps */}
                                {order.status !== 'cancelled' && (
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between">
                                            {statusSteps.map((step, index) => {
                                                const status = getStepStatus(step.key);
                                                const Icon = step.icon;
                                                return (
                                                    <div key={step.key} className="flex-1 flex items-center">
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                                    status === 'completed'
                                                                        ? 'bg-green-500 text-white'
                                                                        : status === 'current'
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-gray-200 text-gray-500'
                                                                }`}
                                                            >
                                                                <Icon className="w-5 h-5" />
                                                            </div>
                                                            <p className={`text-xs mt-2 text-center ${
                                                                status === 'completed' || status === 'current'
                                                                    ? 'text-gray-900 font-medium'
                                                                    : 'text-gray-500'
                                                            }`}>
                                                                {step.label}
                                                            </p>
                                                        </div>
                                                        {index < statusSteps.length - 1 && (
                                                            <div className={`flex-1 h-1 mx-2 ${
                                                                getStepStatus(statusSteps[index + 1].key) !== 'pending'
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-200'
                                                            }`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Action Message */}
                                {actionMessage && (
                                    <div className={`mb-4 p-3 rounded-lg text-sm ${
                                        actionMessage.type === 'success'
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        {actionMessage.text}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {order.status !== 'completed' && order.status !== 'cancelled' && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        {userRole === 'buyer' && order.status === 'initiated' && (
                                            <div>
                                                <h3 className="font-semibold mb-2">Confirm Receipt & Payment</h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Once you have received the book and paid the seller, click the button below to confirm.
                                                </p>
                                                <div className="flex gap-3">
                                                    <Button
                                                        onClick={() => handleAction('buyer_confirm')}
                                                        disabled={actionLoading !== null}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        {actionLoading === 'buyer_confirm' ? (
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4 mr-2" />
                                                        )}
                                                        I Received the Book & Paid
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleAction('cancel')}
                                                        disabled={actionLoading !== null}
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                    >
                                                        {actionLoading === 'cancel' ? (
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <X className="w-4 h-4 mr-2" />
                                                        )}
                                                        Cancel Order
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {userRole === 'seller' && order.status === 'initiated' && (
                                            <div>
                                                <h3 className="font-semibold mb-2">Waiting for Buyer</h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    The buyer needs to confirm they received the book and paid before you can complete the order.
                                                </p>
                                                <div className="flex items-center gap-2 text-yellow-700">
                                                    <Clock className="w-5 h-5" />
                                                    <span>Waiting for buyer confirmation...</span>
                                                </div>
                                            </div>
                                        )}

                                        {userRole === 'buyer' && order.status === 'buyer_confirmed' && (
                                            <div>
                                                <h3 className="font-semibold mb-2">Waiting for Seller</h3>
                                                <p className="text-sm text-gray-600">
                                                    You have confirmed receipt. Waiting for the seller to confirm they received your payment.
                                                </p>
                                                <div className="flex items-center gap-2 text-blue-700 mt-4">
                                                    <Clock className="w-5 h-5" />
                                                    <span>Waiting for seller confirmation...</span>
                                                </div>
                                            </div>
                                        )}

                                        {userRole === 'seller' && order.status === 'buyer_confirmed' && (
                                            <div>
                                                <h3 className="font-semibold mb-2">Confirm Payment Receipt</h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    The buyer has confirmed receiving the book. If you have received the payment, click below to complete the order.
                                                </p>
                                                <Button
                                                    onClick={() => handleAction('seller_confirm')}
                                                    disabled={actionLoading !== null}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {actionLoading === 'seller_confirm' ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Check className="w-4 h-4 mr-2" />
                                                    )}
                                                    I Received the Payment
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {order.status === 'completed' && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                        <h3 className="font-semibold text-green-900">Transaction Complete!</h3>
                                        <p className="text-sm text-green-700">
                                            Both parties have confirmed. This transaction is now complete.
                                        </p>
                                    </div>
                                )}

                                {order.status === 'cancelled' && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                        <XCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                                        <h3 className="font-semibold text-red-900">Order Cancelled</h3>
                                        <p className="text-sm text-red-700">
                                            This order has been cancelled.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Book Details */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Book Details</h2>
                                <div className="flex gap-4">
                                    <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
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
                                        <Badge variant="secondary" className="mt-2">{book?.condition}</Badge>
                                        {book?.isbn && (
                                            <p className="text-xs text-gray-500 mt-2">ISBN: {book.isbn}</p>
                                        )}
                                        {book?.description && (
                                            <p className="text-sm text-gray-600 mt-3 line-clamp-3">{book.description}</p>
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
                                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Notes from Buyer
                                    </h2>
                                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{order.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right: Contact Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    {otherPartyLabel} Information
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                            {otherParty?.first_name?.charAt(0)}{otherParty?.last_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                {otherParty?.first_name} {otherParty?.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">{otherPartyLabel}</p>
                                        </div>
                                    </div>

                                    {otherPartyPhone && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-blue-800 mb-2">Contact Phone</p>
                                            <a
                                                href={`tel:${otherPartyPhone}`}
                                                className="flex items-center gap-2 text-blue-600 font-semibold text-lg"
                                            >
                                                <Phone className="w-5 h-5" />
                                                {otherPartyPhone}
                                            </a>
                                            <a
                                                href={`https://wa.me/${otherPartyPhone.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                </svg>
                                                Chat on WhatsApp
                                            </a>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t">
                                        <p className="text-xs text-gray-500">Order placed on</p>
                                        <p className="font-medium">
                                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>

                                    {order.buyer_confirmed_at && (
                                        <div>
                                            <p className="text-xs text-gray-500">Buyer confirmed on</p>
                                            <p className="font-medium text-sm">
                                                {new Date(order.buyer_confirmed_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {order.seller_confirmed_at && (
                                        <div>
                                            <p className="text-xs text-gray-500">Completed on</p>
                                            <p className="font-medium text-sm">
                                                {new Date(order.seller_confirmed_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    )}
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
