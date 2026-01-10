import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookData } from "@/types/book";

interface SuccessMessageProps {
    bookData: BookData;
    onReset: () => void;
}

export default function SuccessMessage({ bookData, onReset }: SuccessMessageProps) {
    return (
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-green-200 shadow-lg">
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <Check className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-green-900">Listing Submitted!</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Your book "{bookData.title}" has been submitted for review.
                            </p>

                            <div className="bg-white rounded-lg p-6 mb-6 text-left">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-600" />
                                    What happens next?
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Your listing is pending admin review</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>You'll be notified once it's approved and live</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>If rejected, you'll receive the reason and can resubmit</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Buyers can contact you through our secure messaging</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <Button onClick={onReset} size="lg" className="bg-green-600 hover:bg-green-700">
                                    List Another Book
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => window.location.href = '/my-books'}>
                                    View My Listings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}