import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookData } from "@/types/book";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";

interface PhotoUploadStepProps {
    bookData: BookData;
    onUpdate: (data: Partial<BookData>) => void;
}

export default function PhotoUploadStep({ bookData, onUpdate }: PhotoUploadStepProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const remainingSlots = 5 - bookData.images.length;
        const filesToUpload = files.slice(0, remainingSlots);

        setIsUploading(true);
        setUploadError(null);

        try {
            const uploadPromises = filesToUpload.map(file => uploadToCloudinary(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            onUpdate({
                images: [...bookData.images, ...uploadedUrls]
            });
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError('Failed to upload images. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        onUpdate({
            images: bookData.images.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <Alert className="bg-purple-50 border-purple-200">
                <Camera className="w-4 h-4 text-purple-600" />
                <AlertDescription className="text-purple-900">
                    Quality photos increase your chances of selling by 70%
                </AlertDescription>
            </Alert>

            {uploadError && (
                <Alert variant="destructive">
                    <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
            )}

            <div>
                <label className="block mb-3 font-medium">Book Photos *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {bookData.images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="relative w-full h-40">
                                <Image
                                    src={image}
                                    alt={`Book ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeImage(index)}
                                    type="button"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Remove
                                </Button>
                            </div>
                            {index === 0 && (
                                <Badge className="absolute top-2 left-2 bg-blue-600">Cover</Badge>
                            )}
                        </div>
                    ))}

                    {bookData.images.length < 5 && (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="h-40 border-2 border-dashed hover:border-primary hover:bg-primary/5"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <div className="text-center">
                                    {isUploading ? (
                                        <>
                                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                            <span className="text-sm font-medium">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <span className="text-sm font-medium">Add Photo</span>
                                            <span className="text-xs text-gray-500 block mt-1">
                                                {bookData.images.length}/5
                                            </span>
                                        </>
                                    )}
                                </div>
                            </Button>
                        </>
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                    📸 Include: front cover, back cover, spine, and any damage or special features
                </p>
            </div>
        </div>
    );
}