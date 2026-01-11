import { Info, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookData, categories } from "@/types/book";

interface BookInfoStepProps {
  bookData: BookData;
  onUpdate: (data: Partial<BookData>) => void;
  validateISBN: (isbn: string) => boolean;
}

export default function BookInfoStep({ bookData, onUpdate, validateISBN }: BookInfoStepProps) {
  return (
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
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Author *</label>
          <Input
            placeholder="e.g., Thomas H. Cormen"
            value={bookData.author}
            onChange={(e) => onUpdate({ author: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">ISBN (Optional)</label>
          <Input
            placeholder="978-0-262-03384-8 or 0262033844"
            value={bookData.isbn}
            onChange={(e) => onUpdate({ isbn: e.target.value })}
            maxLength={17}
            className={bookData.isbn && !validateISBN(bookData.isbn) ? 'border-red-500' : ''}
          />
          {bookData.isbn && !validateISBN(bookData.isbn) && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              ISBN must be 10 or 13 digits (hyphens allowed)
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Usually found on the back cover. Format: 10 or 13 digits
          </p>
        </div>

        <div>
          <label className="block mb-2 font-medium">Category *</label>
          <Select value={bookData.category} onValueChange={(value) => onUpdate({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Choose the best category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div>
                    <div className="font-medium">{category.label}</div>
                    <div className="text-xs text-gray-500">{category.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Description *</label>
          <Textarea
            placeholder="Tell buyers more about your book - condition details, included materials, special features, etc."
            rows={4}
            value={bookData.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="resize-none"
            maxLength={500}
            required
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {(bookData.description || '').length}/500 characters (minimum 20)
          </p>
        </div>
      </div>
    </div>
  );
}