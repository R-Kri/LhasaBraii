'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Phone,
    ArrowRight,
    BookOpen,
    ShoppingBag,
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
    book: {
        id: string;
        title: string;
        author: string;
        images: string[];
        condition: string;
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

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'initiated':
            return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
        case 'buyer_confirmed':
            return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Awaiting Seller</Badge>;
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
            return <Clock className="w-5 h-5 text-yellow-600" />;
        case 'buyer_confirmed':
            return <Package className="w-5 h-5 text-blue-600" />;
        case 'completed':
            return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'cancelled':
            return <XCircle className="w-5 h-5 text-red-600" />;
        default:
            return <Package className="w-5 h-5 text-gray-600" />;
    }
};

export default function OrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/orders?role=buyer&status=${activeTab === 'all' ? '' : activeTab}`);
                const result = await response.json();

                if (response.ok) {
                    setOrders(result.data || []);
                    setError(null);
                } else {
                    setError(result.error || 'Failed to fetch orders');
                }
            } catch (err) {
                console.error('Fetch orders error:', err);
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, authLoading, router, activeTab]);

    if (authLoading || (!user && !authLoading)) {
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <Link href="/browse">
                        <Button variant="outline" className="mt-4 sm:mt-0">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Browse More Books
                        </Button>
                    </Link>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="initiated">Pending</TabsTrigger>
                        <TabsTrigger value="buyer_confirmed">Awaiting Seller</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab}>
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        ) : error ? (
                            <Card className="border-red-200 bg-red-50">
                                <CardContent className="pt-6 text-center">
                                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                                    <p className="text-red-700">{error}</p>
                                </CardContent>
                            </Card>
                        ) : orders.length === 0 ? (
                            <Card>
                                <CardContent className="pt-8 pb-8 text-center">
                                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
                                    <p className="text-gray-600 mb-6">
                                        {activeTab === 'all'
                                            ? "You haven't placed any orders yet."
                                            : `No ${activeTab.replace('_', ' ')} orders.`}
                                    </p>
                                    <Link href="/browse">
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Start Shopping
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => {
                                    const book = Array.isArray(order.book) ? order.book[0] : order.book;
                                    const seller = Array.isArray(order.seller) ? order.seller[0] : order.seller;

                                    return (
                                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    {/* Book Image */}
                                                    <div className="w-full sm:w-24 h-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
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

                                                    {/* Order Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg line-clamp-1">
                                                                    {book?.title || 'Unknown Book'}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {book?.author || 'Unknown Author'}
                                                                </p>
                                                            </div>
                                                            {getStatusBadge(order.status)}
                                                        </div>

                                                        <div className="flex items-center gap-2 mb-3">
                                                            {getStatusIcon(order.status)}
                                                            <span className="text-sm text-gray-600">
                                                                {order.status === 'initiated' && 'Waiting for you to confirm receipt & payment'}
                                                                {order.status === 'buyer_confirmed' && 'Waiting for seller to confirm payment'}
                                                                {order.status === 'completed' && 'Transaction completed successfully'}
                                                                {order.status === 'cancelled' && 'This order was cancelled'}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-gray-500">Price</p>
                                                                <p className="font-semibold text-green-600">₹{order.price}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Seller</p>
                                                                <p className="font-medium">
                                                                    {seller?.first_name} {seller?.last_name}
                                                                </p>
                                                            </div>
                                                            {(seller?.phone || order.seller_phone) && (
                                                                <div>
                                                                    <p className="text-gray-500">Contact</p>
                                                                    <a
                                                                        href={`tel:${seller?.phone || order.seller_phone}`}
                                                                        className="font-medium text-blue-600 flex items-center gap-1"
                                                                    >
                                                                        <Phone className="w-3 h-3" />
                                                                        {seller?.phone || order.seller_phone}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                            <p className="text-xs text-gray-500">
                                                                Ordered {new Date(order.created_at).toLocaleDateString()}
                                                            </p>
                                                            <Link href={`/orders/${order.id}`}>
                                                                <Button size="sm" variant="outline">
                                                                    View Details
                                                                    <ArrowRight className="w-3 h-3 ml-1" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
}
