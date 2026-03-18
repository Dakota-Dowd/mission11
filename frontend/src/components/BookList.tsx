import { useEffect, useState } from 'react';

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

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetch(
            `http://localhost:5000/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`
        )
        .then((res) => res.json())
        .then((data) => {
            setBooks(data.books);
            setTotalItems(data.totalNumBooks);
        });
    }, [pageNum, pageSize, sortOrder]);

    return (
        <div className="container mt-4">
            <h1>Bookstore</h1>
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
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BookList;
