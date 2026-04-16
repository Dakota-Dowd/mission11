import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookListPage from './pages/BookListPage';
import CartPage from './pages/CartPages';
import AdminBooksPage from './pages/AdminBooksPage';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BookListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
