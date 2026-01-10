export interface BookData {
    title: string;
    author: string;
    isbn?: string;
    category: string;
    condition: string;
    price: string;
    description?: string;
    images: string[];
}

export interface Condition {
    value: string;
    label: string;
    description: string;
}

export interface Category {
    value: string;
    label: string;
    description: string;
}

export const conditions: Condition[] = [
    { value: "new", label: "New", description: "Brand new, never used (5-10% off retail)" },
    { value: "like_new", label: "Like New", description: "Minimal wear, excellent condition (15-20% off retail)" },
    { value: "good", label: "Good", description: "Moderate wear, readable condition (30-40% off retail)" },
    { value: "fair", label: "Fair", description: "Heavy wear but still usable (50-60% off retail)" }
];

export const categories: Category[] = [
    { value: "academic", label: "Academic Textbooks", description: "College & university textbooks" },
    { value: "competitive", label: "Competitive Exams", description: "Preparation books for exams" },
    { value: "literature", label: "Literature & Fiction", description: "Novels, poetry, classics" },
    { value: "reference", label: "Reference Books", description: "Dictionaries, encyclopedias, guides" }
];