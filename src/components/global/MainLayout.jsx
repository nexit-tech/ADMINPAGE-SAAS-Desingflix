// src/components/global/MainLayout.jsx

import { Outlet } from 'react-router-dom';
// O import funciona normalmente, mesmo com o nome de arquivo 'Sidebar'
import Navbar from './Sidebar'; 

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column', // A MUDANÇA PRINCIPAL: de linha para coluna
  height: '100vh',
};

const contentStyle = {
  flexGrow: 1,
  padding: '2rem',
  overflowY: 'auto',
  backgroundColor: '#f8f9fa', // Cor de fundo que estava no body
};

export default function MainLayout() {
  return (
    <div style={layoutStyle}>
      <Navbar /> {/* Usamos nosso novo componente Navbar */}
      <main style={contentStyle}>
        <Outlet />
      </main>
    </div>
  );
}