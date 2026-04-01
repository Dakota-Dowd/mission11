import { useEffect, useState } from 'react';
import { useCart } from '../CartContext';


type Book = {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
};

function BookList({ selectedCategory }: { selectedCategory: string }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        let url = `http://localhost:5000/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
        if (selectedCategory) {
            url += `&category=${selectedCategory}`;
        }
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setBooks(data.books);
                setTotalItems(data.totalNumBooks);
            });
    }, [pageNum, pageSize, sortOrder, selectedCategory]);

    useEffect(() => {
        setPageNum(1);
    }, [selectedCategory]);
    const { addToCart } = useCart();


    return (
        <div>
            <button className="btn btn-outline-secondary mb-3" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
            {books.map((book) => (
                <div className="card mb-3" key={book.bookID}>
                    <div className='card-body'>
                        <h5 className='card-title'>{book.title}</h5>
                        <p className='card-text'>Author: {book.author}</p>
                        <p className='card-text'>Publisher: {book.publisher}</p>
                        <p className='card-text'>ISBN: {book.isbn}</p>
                        <p className='card-text'>Classification: {book.classification}</p>
                        <p className='card-text'>Category: {book.category}</p>
                        <p className='card-text'>Pages: {book.pageCount}</p>
                        <p className='card-text'>Price: ${book.price.toFixed(2)}</p>
                        <button className="btn btn-success btn-sm mt-2" onClick={() => addToCart({ bookID: book.bookID, title: book.title, price: book.price, quantity: 1 })}> Add to Cart </button>

                    </div>
                </div>
            ))}
            <div className="mb-3">
                <label>Results per page: </label>
                <select value={pageSize} onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNum(1);
                }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <div>
                <button className="btn btn-secondary me-1" disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
                    Previous
                </button>
            </div>
            {Array.from({ length: Math.ceil(totalItems / pageSize) }, (_, i) => (
                <button key={i + 1} className={`btn me-1 ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPageNum(i + 1)}>
                    {i + 1}
                </button>
            ))}
            <button className="btn btn-secondary ms-1" disabled={pageNum === Math.ceil(totalItems / pageSize)} onClick={() => setPageNum(pageNum + 1)}>
                Next
            </button>
        </div>
    );
}

export default BookList;
