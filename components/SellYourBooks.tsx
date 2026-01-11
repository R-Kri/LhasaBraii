"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookData } from "@/types/book";
import ProgressSteps from "@/components/sell/ProgressSteps";
import BookInfoStep from "@/components/sell/BookInfoStep";
import PricingStep from "@/components/sell/PricingStep";
import PhotoUploadStep from "@/components/sell/PhotoUploadStep";
import ReviewStep from "@/components/sell/ReviewStep";
import SuccessMessage from "@/components/sell/SuccessMessage";

const INITIAL_BOOK_DATA: BookData = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  condition: "",
  price: "",
  description: "",
  images: []
};

export default function SellYourBooks() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookData, setBookData] = useState<BookData>(INITIAL_BOOK_DATA);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!!editId);

  // Load book data for editing
  useEffect(() => {
    if (editId) {
      const fetchBook = async () => {
        try {
          const response = await fetch(`/api/books/${editId}`);
          const result = await response.json();

          if (!response.ok) {
            setEditError(result.error || 'Failed to load book');
            setIsLoading(false);
            return;
          }

          const book = result.data;
          setBookData({
            title: book.title || "",
            author: book.author || "",
            isbn: book.isbn || "",
            category: book.category || "",
            condition: book.condition || "",
            price: book.price?.toString() || "",
            description: book.description || "",
            images: book.images || []
          });
          setEditError(null);
        } catch (err) {
          console.error('Error fetching book:', err);
          setEditError(err instanceof Error ? err.message : 'Failed to load book');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBook();
    }
  }, [editId]);

  const updateBookData = useCallback((data: Partial<BookData>) => {
    setBookData(prev => ({ ...prev, ...data }));
  }, []);

  const validateISBN = useCallback((isbn: string): boolean => {
    if (!isbn) return true;
    const cleaned = isbn.replace(/-/g, '');
    return cleaned.length === 10 || cleaned.length === 13;
  }, []);

  const canProceed = useCallback(() => {
    if (step === 1) {
      const isISBNValid = !bookData.isbn || validateISBN(bookData.isbn);
      const hasDescription = bookData.description && bookData.description.trim().length >= 20;
      return bookData.title && bookData.author && bookData.category && isISBNValid && hasDescription;
    }
    if (step === 2) return bookData.condition && bookData.price && parseFloat(bookData.price) > 0;
    if (step === 3) return bookData.images.length > 0;
    return true;
  }, [step, bookData, validateISBN]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const bookRecord = {
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn || null,
        description: bookData.description || null,
        price: parseFloat(bookData.price),
        condition: bookData.condition,
        category: bookData.category,
        images: bookData.images,
      };

      const url = isEditing && editId ? `/api/books/${editId}` : '/api/books';
      const method = isEditing && editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookRecord)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error}\n${result.details || ''}`);
        setIsSubmitting(false);
        return;
      }

      // Success - show the success message
      setShowSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Failed to submit listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
  }, [bookData, isEditing, editId]);

  const resetForm = useCallback(() => {
    setBookData(INITIAL_BOOK_DATA);
    setStep(1);
    setShowSuccess(false);
    setIsSubmitting(false);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-gray-600">Loading book details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (editError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold">{editError}</p>
            <Button className="mt-4" onClick={() => window.location.href = '/my-books'}>
              Back to My Books
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSuccess) {
    return <SuccessMessage bookData={bookData} onReset={resetForm} />;
  }

  const stepTitles = {
    1: "Book Information",
    2: "Condition & Pricing",
    3: "Upload Photos",
    4: "Review & Submit"
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isEditing ? 'Edit Your Book' : 'Sell Your Books'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isEditing
                ? 'Update your book listing details'
                : 'Turn your books into cash! List them in minutes and reach thousands of eager readers.'
              }
            </p>
          </div>

          <ProgressSteps currentStep={step} />

          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-xl">
                Step {step} of 4: {stepTitles[step as keyof typeof stepTitles]}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {step === 1 && (
                <BookInfoStep
                  bookData={bookData}
                  onUpdate={updateBookData}
                  validateISBN={validateISBN}
                />
              )}

              {step === 2 && (
                <PricingStep
                  bookData={bookData}
                  onUpdate={updateBookData}
                />
              )}

              {step === 3 && (
                <PhotoUploadStep
                  bookData={bookData}
                  onUpdate={updateBookData}
                />
              )}

              {step === 4 && <ReviewStep bookData={bookData} />}

              <Separator className="my-8" />

              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  size="lg"
                >
                  ← Previous
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={() => setStep(Math.min(4, step + 1))}
                    disabled={!canProceed()}
                    size="lg"
                    className="min-w-[120px]"
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 min-w-[160px]"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isEditing ? 'Updating...' : 'Submitting...'}
                      </span>
                    ) : (
                      isEditing ? "Update Book ✓" : "Submit Listing ✓"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}