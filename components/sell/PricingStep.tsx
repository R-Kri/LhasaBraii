import { Info, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookData, conditions } from "@/types/book";

interface PricingStepProps {
    bookData: BookData;
    onUpdate: (data: Partial<BookData>) => void;
}

export default function PricingStep({ bookData, onUpdate }: PricingStepProps) {
    return (
        <div className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
                <Info className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                    Be honest about condition - it builds trust with buyers
                </AlertDescription>
            </Alert>

            <div>
                <label className="block mb-3 font-medium">Book Condition *</label>
                <div className="grid gap-3">
                    {conditions.map((condition) => (
                        <Card
                            key={condition.value}
                            className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${bookData.condition === condition.value
                                ? 'ring-2 ring-primary border-primary shadow-md'
                                : ''
                                }`}
                            onClick={() => onUpdate({ condition: condition.value })}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <h4 className="font-semibold mb-1">{condition.label}</h4>
                                        <p className="text-sm text-gray-600">{condition.description}</p>
                                    </div>
                                    {bookData.condition === condition.value && (
                                        <Check className="w-5 h-5 text-primary ml-4 flex-shrink-0" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <label className="block mb-2 font-medium">Your Asking Price (₹) *</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8 text-lg"
                        value={bookData.price}
                        onChange={(e) => onUpdate({ price: e.target.value })}
                        step="0.01"
                        min="0"
                    />
                </div>
            </div>
        </div>
    );
}