import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import MenuPage from './pages/MenuPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/new" element={<CreateOrderPage />} />
            <Route path="/users" element={<UsersPage />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: '14px' },
        }}
      />
    </BrowserRouter>
  );
}
