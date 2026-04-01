import { createContext, useContext, useState } from 'react';

type CartItem = {
    bookID: number;
    title: string;
    price: number;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    function addToCart(item: CartItem) {
        setCart((prevCart) => {
            const existing = prevCart.find((c) => c.bookID === item.bookID);
            if (existing) {
                return prevCart.map((c) =>
                    c.bookID === item.bookID ? { ...c, quantity: c.quantity + 1 } : c
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    }

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
