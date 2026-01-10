import { BookOpen, Camera, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookData, categories, conditions } from "@/types/book";

interface ReviewStepProps {
    bookData: BookData;
}

export default function ReviewStep({ bookData }: ReviewStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Review Your Listing</h3>
                <p className="text-gray-600">
                    Double-check everything looks good before submitting
                </p>
            </div>

            <Card className="border-2">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-600">Title:</span>
                            <span className="text-right font-semibold max-w-[60%]">{bookData.title}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-600">Author:</span>
                            <span className="text-right">{bookData.author}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Category:</span>
                            <Badge variant="secondary">
                                {categories.find(c => c.value === bookData.category)?.label}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Condition:</span>
                            <Badge variant="outline" className="font-semibold">
                                {conditions.find(c => c.value === bookData.condition)?.label}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Price:</span>
                            <span className="text-2xl font-bold text-green-600">₹{parseFloat(bookData.price).toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Photos:</span>
                            <span className="flex items-center gap-1">
                                <Camera className="w-4 h-4" />
                                {bookData.images.length} uploaded
                            </span>
                        </div>
                        {bookData.isbn && (
                            <>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">ISBN:</span>
                                    <span className="font-mono text-sm">{bookData.isbn}</span>
                                </div>
                            </>
                        )}
                        {bookData.description && (
                            <>
                                <Separator />
                                <div>
                                    <span className="font-medium text-gray-600 block mb-2">Description:</span>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{bookData.description}</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                    Your listing will be reviewed by our team before going live. We will notify you once it is approved or if any changes are needed.
                </AlertDescription>
            </Alert>
        </div>
    );
}