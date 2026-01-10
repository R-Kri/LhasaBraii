'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import {
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Shield,
    Eye,
    Check,
    X,
    Loader2,
    User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    description: string | null;
    category: string;
    condition: string;
    price: number;
    images: string[];
    status: string;
    created_at: string;
    seller: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        email: string | null;
    } | null;
}

interface Counts {
    pending: number;
    approved: number;
    rejected: number;
    sold: number;
    all: number;
}

export default function AdminBooksPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAdmin, loading: authLoading } = useAuth();
    
    const [books, setBooks] = useState<Book[]>([]);
    const [counts, setCounts] = useState<Counts | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'pending');
    
    // Action states
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [reason, setReason] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const fetchBooks = async (status: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/books?status=${status}`);
            const result = await response.json();

            if (response.ok) {
                setBooks(result.data || []);
                setCounts(result.counts);
                setError(null);
            } else {
                setError(result.error || 'Failed to fetch books');
            }
        } catch (err) {
            console.error('Fetch books error:', err);
            setError('Failed to load books');
        } finally {
            setLoading(false);
        }
    };

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

        fetchBooks(activeTab);
    }, [user, isAdmin, authLoading, router, activeTab]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/admin/books?status=${tab}`, { scroll: false });
    };

    const openActionDialog = (book: Book, action: 'approve' | 'reject') => {
        setSelectedBook(book);
        setActionType(action);
        setReason('');
        setShowDialog(true);
    };

    const handleAction = async () => {
        if (!selectedBook || !actionType) return;

        setActionLoading(selectedBook.id);
        setShowDialog(false);

        try {
            const response = await fetch(`/api/admin/books/${selectedBook.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: actionType,
                    reason: reason || null,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Remove book from current list
                setBooks(prev => prev.filter(b => b.id !== selectedBook.id));
                // Refresh counts
                fetchBooks(activeTab);
            } else {
                setError(result.error || 'Action failed');
            }
        } catch (err) {
            console.error('Action error:', err);
            setError('Failed to process action');
        } finally {
            setActionLoading(null);
            setSelectedBook(null);
            setActionType(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
            case 'sold':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Sold</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (authLoading) {
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
                            <p className="text-red-700">You do not have permission to access this page.</p>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                {/* Back Link */}
                <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold">Book Moderation</h1>
                </div>

                {error && (
                    <Card className="mb-6 border-red-200 bg-red-50">
                        <CardContent className="pt-4 pb-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-red-700">{error}</p>
                            <Button size="sm" variant="outline" onClick={() => setError(null)} className="ml-auto">
                                Dismiss
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="pending" className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Pending
                            {counts && counts.pending > 0 && (
                                <Badge className="bg-yellow-600 text-white ml-1">{counts.pending}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Approved
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Rejected
                        </TabsTrigger>
                        <TabsTrigger value="all">All Books</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab}>
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        ) : books.length === 0 ? (
                            <Card>
                                <CardContent className="pt-8 pb-8 text-center">
                                    <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h2 className="text-xl font-semibold mb-2">No Books</h2>
                                    <p className="text-gray-600">
                                        {activeTab === 'pending'
                                            ? 'No books pending review. Great job!'
                                            : `No ${activeTab} books found.`}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {books.map((book) => {
                                    const seller = Array.isArray(book.seller) ? book.seller[0] : book.seller;
                                    const isProcessing = actionLoading === book.id;

                                    return (
                                        <Card key={book.id} className={`transition-opacity ${isProcessing ? 'opacity-50' : ''}`}>
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col lg:flex-row gap-4">
                                                    {/* Book Image */}
                                                    <div className="w-full lg:w-32 h-40 lg:h-44 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                                                        {book.images && book.images.length > 0 ? (
                                                            <Image
                                                                src={book.images[0]}
                                                                alt={book.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <BookOpen className="w-10 h-10" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Book Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg">{book.title}</h3>
                                                                <p className="text-gray-600">{book.author}</p>
                                                            </div>
                                                            {getStatusBadge(book.status)}
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                                                            <div>
                                                                <p className="text-gray-500">Price</p>
                                                                <p className="font-semibold text-green-600">₹{book.price}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Condition</p>
                                                                <p className="font-medium">{book.condition}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Category</p>
                                                                <p className="font-medium">{book.category}</p>
                                                            </div>
                                                            {book.isbn && (
                                                                <div>
                                                                    <p className="text-gray-500">ISBN</p>
                                                                    <p className="font-mono text-xs">{book.isbn}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {book.description && (
                                                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                                {book.description}
                                                            </p>
                                                        )}

                                                        {/* Seller Info */}
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                                            <User className="w-4 h-4" />
                                                            <span>
                                                                Seller: {seller?.first_name} {seller?.last_name}
                                                                {seller?.email && <span className="text-gray-400 ml-2">({seller.email})</span>}
                                                            </span>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t">
                                                            <p className="text-xs text-gray-500">
                                                                Submitted {new Date(book.created_at).toLocaleDateString()}
                                                            </p>
                                                            <div className="flex-1" />
                                                            
                                                            <Link href={`/books/${book.id}`} target="_blank">
                                                                <Button size="sm" variant="outline">
                                                                    <Eye className="w-3 h-3 mr-1" />
                                                                    Preview
                                                                </Button>
                                                            </Link>

                                                            {book.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => openActionDialog(book, 'reject')}
                                                                        disabled={isProcessing}
                                                                        variant="outline"
                                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    >
                                                                        {isProcessing ? (
                                                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                                        ) : (
                                                                            <X className="w-3 h-3 mr-1" />
                                                                        )}
                                                                        Reject
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => openActionDialog(book, 'approve')}
                                                                        disabled={isProcessing}
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        {isProcessing ? (
                                                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                                        ) : (
                                                                            <Check className="w-3 h-3 mr-1" />
                                                                        )}
                                                                        Approve
                                                                    </Button>
                                                                </>
                                                            )}
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

            {/* Action Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'approve' ? 'Approve Book' : 'Reject Book'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve'
                                ? `Are you sure you want to approve "${selectedBook?.title}"? It will be visible to all users.`
                                : `Are you sure you want to reject "${selectedBook?.title}"? The seller will be notified.`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <label className="block text-sm font-medium mb-2">
                            {actionType === 'approve' ? 'Note (optional)' : 'Reason for rejection'}
                        </label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={actionType === 'approve'
                                ? 'Add any notes...'
                                : 'Explain why this book is being rejected...'}
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAction}
                            className={actionType === 'approve'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'}
                        >
                            {actionType === 'approve' ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve Book
                                </>
                            ) : (
                                <>
                                    <X className="w-4 h-4 mr-2" />
                                    Reject Book
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
