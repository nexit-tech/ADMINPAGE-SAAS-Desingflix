import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/global/MainLayout';

// Importação das páginas
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import ProductGroups from '../pages/ProductGroups';
import Customers from '../pages/Customers';
import Financial from '../pages/Financial';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-groups" element={<ProductGroups />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/financial" element={<Financial />} />
      </Route>
    </Routes>
  );
}