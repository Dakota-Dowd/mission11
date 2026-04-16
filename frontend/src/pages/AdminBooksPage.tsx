import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const emptyForm = {
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
};

function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBookId, setEditingBookId] = useState<number | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const navigate = useNavigate();

    const fetchBooks = () => {
        fetch('http://localhost:5000/books?pageSize=1000')
            .then((res) => res.json())
            .then((data) => setBooks(data.books));
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
        }));
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        fetch('http://localhost:5000/books/AddBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        }).then(() => {
            setFormData(emptyForm);
            setShowForm(false);
            fetchBooks();
        });
    };

    const handleEdit = (book: Book) => {
        setEditingBookId(book.bookID);
        setFormData({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            isbn: book.isbn,
            classification: book.classification,
            category: book.category,
            pageCount: book.pageCount,
            price: book.price,
        });
    };

    const handleUpdate = (bookId: number) => {
        fetch(`http://localhost:5000/books/UpdateBook/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        }).then(() => {
            setEditingBookId(null);
            setFormData(emptyForm);
            fetchBooks();
        });
    };

    const handleDelete = (bookId: number) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        fetch(`http://localhost:5000/books/DeleteBook/${bookId}`, {
            method: 'DELETE',
        }).then(() => fetchBooks());
    };

    const handleCancel = () => {
        setEditingBookId(null);
        setFormData(emptyForm);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Admin — Manage Books</h1>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
                    Back to Store
                </button>
            </div>

            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setShowForm(!showForm);
                    setFormData(emptyForm);
                }}
            >
                {showForm ? 'Cancel' : 'Add New Book'}
            </button>

            {showForm && (
                <form onSubmit={handleAdd} className="card p-3 mb-4">
                    <h5>Add a New Book</h5>
                    <div className="row g-2">
                        <div className="col-md-6">
                            <input className="form-control" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" name="publisher" placeholder="Publisher" value={formData.publisher} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" name="classification" placeholder="Classification" value={formData.classification} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" name="pageCount" type="number" placeholder="Page Count" value={formData.pageCount} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success mt-3">Add Book</button>
                </form>
            )}

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Pages</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) =>
                        editingBookId === book.bookID ? (
                            <tr key={book.bookID}>
                                <td><input className="form-control form-control-sm" name="title" value={formData.title} onChange={handleChange} /></td>
                                <td><input className="form-control form-control-sm" name="author" value={formData.author} onChange={handleChange} /></td>
                                <td><input className="form-control form-control-sm" name="publisher" value={formData.publisher} onChange={handleChange} /></td>
                                <td><input className="form-control form-control-sm" name="isbn" value={formData.isbn} onChange={handleChange} /></td>
                                <td><input className="form-control form-control-sm" name="classification" value={formData.classification} onChange={handleChange} /></td>
                                <td><input className="form-control form-control-sm" name="category" value={formData.category} onChange={handleChange} /></td>
                                <td><input className="form-control form-control-sm" name="pageCount" type="number" value={formData.pageCount} onChange={handleChange} /></td>
                                <td><input className="form-control form-control-sm" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} /></td>
                                <td>
                                    <button className="btn btn-success btn-sm me-1" onClick={() => handleUpdate(book.bookID)}>Save</button>
                                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={book.bookID}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{book.isbn}</td>
                                <td>{book.classification}</td>
                                <td>{book.category}</td>
                                <td>{book.pageCount}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(book)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.bookID)}>Delete</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminBooksPage;
