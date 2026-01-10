'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
    const [email, setEmail] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [error, setError] = useState('');

    const supabase = createClient();

    useEffect(() => {
        // Get user email from session
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setEmail(user.email);
            }
        };
        getUser();
    }, [supabase.auth]);

    const handleResend = async () => {
        if (!email) return;
        
        setResending(true);
        setError('');
        setResent(false);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });

            if (error) throw error;
            setResent(true);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to resend email';
            setError(errorMessage);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FAF7F2' }}>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-blue-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
                    <p className="text-gray-600 mb-6">
                        We&apos;ve sent a verification link to{' '}
                        {email ? <strong>{email}</strong> : 'your email address'}.
                        <br />
                        Please check your inbox and click the link to verify your account.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200">
                            {error}
                        </div>
                    )}

                    {resent && (
                        <div className="mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-600 border border-green-200 flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Verification email sent!
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            onClick={handleResend}
                            disabled={resending || !email}
                            variant="outline"
                            className="w-full"
                        >
                            {resending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Resend verification email
                                </>
                            )}
                        </Button>

                        <Link href="/login" className="block">
                            <Button variant="ghost" className="w-full text-gray-600">
                                Back to login
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                        <p className="text-sm text-gray-500">
                            Didn&apos;t receive the email? Check your spam folder or try a different email address.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
