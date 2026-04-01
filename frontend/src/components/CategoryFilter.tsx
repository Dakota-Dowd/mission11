import { useEffect, useState } from 'react';

function CategoryFilter({ selectedCategory, onCategoryChange }: {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/books/GetBookCategories')
            .then((res) => res.json())
            .then((data) => setCategories(data));
    }, []);

    return (
        <div>
            <h5>Categories</h5>
            <button
                className={`btn btn-sm mb-1 w-100 ${selectedCategory === '' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onCategoryChange('')}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`btn btn-sm mb-1 w-100 ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => onCategoryChange(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;
