'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import {
    BookOpen,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    ShoppingCart,
    AlertCircle,
    ArrowRight,
    Shield,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
    books: {
        pending: number;
        approved: number;
        rejected: number;
        sold: number;
        total: number;
    };
    users: number;
    orders: {
        initiated: number;
        buyer_confirmed: number;
        completed: number;
        cancelled: number;
        total: number;
    };
    recentActivity: Array<{
        id: string;
        action: string;
        book_id: string;
        notes: string | null;
        created_at: string;
        moderator: { full_name: string | null } | null;
    }>;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        if (!isAdmin) {
            router.push('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                const result = await response.json();

                if (response.ok) {
                    setStats(result.data);
                } else {
                    setError(result.error || 'Failed to fetch stats');
                }
            } catch (err) {
                console.error('Fetch stats error:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, isAdmin, authLoading, router]);

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

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <Card className="max-w-md mx-auto border-red-200 bg-red-50">
                        <CardContent className="pt-6 text-center">
                            <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
                            <h2 className="text-xl font-semibold text-red-900 mb-2">Access Denied</h2>
                            <p className="text-red-700">You do not have permission to access the admin panel.</p>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <Card className="max-w-md mx-auto border-red-200 bg-red-50">
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
                            <p className="text-red-700">{error}</p>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'approve_book':
                return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
            case 'reject_book':
                return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
            case 'delete_book':
                return <Badge className="bg-gray-100 text-gray-800">Deleted</Badge>;
            default:
                return <Badge variant="secondary">{action}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                {/* Quick Action */}
                {stats && stats.books.pending > 0 && (
                    <Card className="mb-8 border-yellow-300 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-yellow-900">
                                            {stats.books.pending} Books Pending Review
                                        </h2>
                                        <p className="text-sm text-yellow-700">
                                            New book listings need your approval
                                        </p>
                                    </div>
                                </div>
                                <Link href="/admin/books?status=pending">
                                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                                        Review Now
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold">{stats?.books.pending || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="text-2xl font-bold">{stats?.books.approved || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Users</p>
                                    <p className="text-2xl font-bold">{stats?.users || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Sales</p>
                                    <p className="text-2xl font-bold">{stats?.orders.completed || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Links */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                                <div className="space-y-2">
                                    <Link href="/admin/books?status=pending">
                                        <Button variant="outline" className="w-full justify-between">
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                                                Pending Books
                                            </span>
                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                {stats?.books.pending || 0}
                                            </Badge>
                                        </Button>
                                    </Link>
                                    <Link href="/admin/books?status=approved">
                                        <Button variant="outline" className="w-full justify-between">
                                            <span className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                                Approved Books
                                            </span>
                                            <Badge className="bg-green-100 text-green-800">
                                                {stats?.books.approved || 0}
                                            </Badge>
                                        </Button>
                                    </Link>
                                    <Link href="/admin/books?status=rejected">
                                        <Button variant="outline" className="w-full justify-between">
                                            <span className="flex items-center">
                                                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                                Rejected Books
                                            </span>
                                            <Badge className="bg-red-100 text-red-800">
                                                {stats?.books.rejected || 0}
                                            </Badge>
                                        </Button>
                                    </Link>
                                    <Link href="/admin/books?status=all">
                                        <Button variant="outline" className="w-full justify-between">
                                            <span className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                All Books
                                            </span>
                                            <Badge variant="secondary">
                                                {stats?.books.total || 0}
                                            </Badge>
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="font-medium mb-3">Orders Overview</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Active Orders</span>
                                            <span className="font-medium">
                                                {(stats?.orders.initiated || 0) + (stats?.orders.buyer_confirmed || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Completed</span>
                                            <span className="font-medium text-green-600">{stats?.orders.completed || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cancelled</span>
                                            <span className="font-medium text-red-600">{stats?.orders.cancelled || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Recent Moderation Activity</h2>
                                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.recentActivity.map((log) => {
                                            const moderator = Array.isArray(log.moderator) ? log.moderator[0] : log.moderator;
                                            return (
                                                <div key={log.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">
                                                        {moderator?.full_name?.charAt(0) || 'A'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium">
                                                                {moderator?.full_name || 'Admin'}
                                                            </span>
                                                            {getActionBadge(log.action)}
                                                        </div>
                                                        {log.notes && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Notes: {log.notes}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>No moderation activity yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
