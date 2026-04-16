import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import { useCart } from '../CartContext';

function BookListPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const { cart } = useCart();
    const navigate = useNavigate();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Bookstore</h1>
                <div>
                    <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/adminbooks')}>
                        Admin
                    </button>
                    <button className="btn btn-outline-success position-relative" onClick={() => navigate('/cart')}>
                        Cart — ${totalCost.toFixed(2)}
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {totalItems}
                        </span>
                    </button>
                </div>

            </div>
            <div className="row">
                <div className="col-3">
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onCategoryChange={(cat) => setSelectedCategory(cat)}
                    />
                </div>
                <div className="col-9">
                    <BookList selectedCategory={selectedCategory} />
                </div>
            </div>
        </div>
    );
}

export default BookListPage;
