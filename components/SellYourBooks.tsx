"use client";

import { useState, useCallback } from "react";
import { Upload, Camera, Plus, X, DollarSign, BookOpen, Check, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const conditions = [
  { value: "new", label: "New", description: "Brand new, never used", discount: 5 },
  { value: "like-new", label: "Like New", description: "Minimal wear, excellent condition", discount: 15 },
  { value: "very-good", label: "Very Good", description: "Light wear, all pages intact", discount: 25 },
  { value: "good", label: "Good", description: "Moderate wear, readable condition", discount: 40 },
  { value: "fair", label: "Fair", description: "Heavy wear but still usable", discount: 60 }
];

const categories = [
  "Academic Textbooks",
  "Fiction & Literature",
  "Self-Help & Growth",
  "Business & Economics",
  "Science & Technology",
  "Children's Books",
  "Art & Design",
  "History & Biography",
  "Other"
];

export default function SellYourBooks() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    condition: "",
    price: "",
    description: "",
    images: [] as string[]
  });

  const handleImageUpload = useCallback(() => {
    const imageUrls = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=300&fit=crop",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=300&fit=crop"
    ];
    setBookData(prev => {
      const newImage = imageUrls[prev.images.length % imageUrls.length];
      return {
        ...prev,
        images: [...prev.images, newImage]
      };
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setBookData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const getSuggestedPrice = useCallback(() => {
    const condition = conditions.find(c => c.value === bookData.condition);
    if (!condition) return null;

    const basePrice = 50;
    const min = Math.floor(basePrice * (100 - condition.discount - 10) / 100);
    const max = Math.floor(basePrice * (100 - condition.discount) / 100);

    return { min, max, text: `$${min} - $${max}` };
  }, [bookData.condition]);

  const canProceed = useCallback(() => {
    if (step === 1) return bookData.title && bookData.author && bookData.category;
    if (step === 2) return bookData.condition && bookData.price && parseFloat(bookData.price) > 0;
    if (step === 3) return bookData.images.length > 0;
    return true;
  }, [step, bookData.title, bookData.author, bookData.category, bookData.condition, bookData.price, bookData.images.length]);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  }, []);

  const resetForm = useCallback(() => {
    setBookData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      condition: "",
      price: "",
      description: "",
      images: []
    });
    setStep(1);
    setShowSuccess(false);
  }, []);

  if (showSuccess) {
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
                      <span>Our team will review your listing within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>You'll receive an email once your book is live</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Buyers can contact you through our secure messaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>We handle payment processing for your safety</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetForm} size="lg" className="bg-green-600 hover:bg-green-700">
                    List Another Book
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
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

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sell Your Books
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Turn your books into cash! List them in minutes and reach thousands of eager readers.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex justify-center items-center">
              {[
                { num: 1, label: "Details" },
                { num: 2, label: "Pricing" },
                { num: 3, label: "Photos" },
                { num: 4, label: "Review" }
              ].map((stepInfo, index) => (
                <div key={stepInfo.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step > stepInfo.num
                          ? 'bg-green-600 text-white'
                          : step === stepInfo.num
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step > stepInfo.num ? <Check className="w-5 h-5" /> : stepInfo.num}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= stepInfo.num ? 'text-gray-900' : 'text-gray-400'}`}>
                      {stepInfo.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all duration-300 ${
                      step > stepInfo.num ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-xl">
                Step {step} of 4: {
                  step === 1 ? "Book Information" :
                  step === 2 ? "Condition & Pricing" :
                  step === 3 ? "Photos & Description" :
                  "Review & Submit"
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Step 1: Book Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      Provide accurate information to help buyers find your book easily
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4">
                    <div>
                      <label className="block mb-2 font-medium">Book Title *</label>
                      <Input
                        placeholder="e.g., Introduction to Algorithms"
                        value={bookData.title}
                        onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Author *</label>
                      <Input
                        placeholder="e.g., Thomas H. Cormen"
                        value={bookData.author}
                        onChange={(e) => setBookData(prev => ({ ...prev, author: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">ISBN (Optional)</label>
                      <Input
                        placeholder="978-0-262-03384-8"
                        value={bookData.isbn}
                        onChange={(e) => setBookData(prev => ({ ...prev, isbn: e.target.value }))}
                        maxLength={17}
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Usually found on the back cover or first few pages
                      </p>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Category *</label>
                      <Select value={bookData.category} onValueChange={(value) =>
                        setBookData(prev => ({ ...prev, category: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose the best category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Condition & Pricing */}
              {step === 2 && (
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
                          className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                            bookData.condition === condition.value
                              ? 'ring-2 ring-primary border-primary shadow-md'
                              : ''
                          }`}
                          onClick={() => setBookData(prev => ({ ...prev, condition: condition.value }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{condition.label}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    ~{condition.discount}% off retail
                                  </Badge>
                                </div>
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
                    <label className="block mb-2 font-medium">Your Asking Price *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-10 text-lg"
                        value={bookData.price}
                        onChange={(e) => setBookData(prev => ({ ...prev, price: e.target.value }))}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {bookData.condition && getSuggestedPrice() && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-900 font-medium">
                          💡 Suggested price range: {getSuggestedPrice()?.text}
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          Based on typical {conditions.find(c => c.value === bookData.condition)?.label.toLowerCase()} condition pricing
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Photos & Description */}
              {step === 3 && (
                <div className="space-y-6">
                  <Alert className="bg-purple-50 border-purple-200">
                    <Camera className="w-4 h-4 text-purple-600" />
                    <AlertDescription className="text-purple-900">
                      Quality photos increase your chances of selling by 70%
                    </AlertDescription>
                  </Alert>

                  <div>
                    <label className="block mb-3 font-medium">Book Photos *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {bookData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Book ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index)}
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
                        <Button
                          variant="outline"
                          className="h-40 border-2 border-dashed hover:border-primary hover:bg-primary/5"
                          onClick={handleImageUpload}
                        >
                          <div className="text-center">
                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <span className="text-sm font-medium">Add Photo</span>
                            <span className="text-xs text-gray-500 block mt-1">
                              {bookData.images.length}/5
                            </span>
                          </div>
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      📸 Include: front cover, back cover, spine, and any damage or special features
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Additional Details (Optional)</label>
                    <Textarea
                      placeholder="Example: Includes study guide. Some highlighting in chapter 3. Dust jacket included. Non-smoking home..."
                      rows={4}
                      value={bookData.description}
                      onChange={(e) => setBookData(prev => ({ ...prev, description: e.target.value }))}
                      className="resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {bookData.description.length}/500 characters
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
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
                            {categories.find(c => c.toLowerCase().replace(/\s+/g, '-') === bookData.category) || bookData.category}
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
                          <span className="text-2xl font-bold text-green-600">${parseFloat(bookData.price).toFixed(2)}</span>
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
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      By submitting, you agree to our seller terms and confirm all information is accurate.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

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
                        Submitting...
                      </span>
                    ) : (
                      "Submit Listing ✓"
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