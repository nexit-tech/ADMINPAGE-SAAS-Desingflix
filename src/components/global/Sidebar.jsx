// src/components/global/Sidebar.jsx

import { NavLink } from 'react-router-dom';

const navbarStyle = {
  width: '100%',
  height: '65px',
  padding: '0 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#fff',
  borderBottom: '1px solid #e2e8f0',
};

const navLinksContainerStyle = {
  display: 'flex',
  gap: '1.5rem',
};

// Estilo base para todos os links
const linkStyle = {
  padding: '0.5rem 0',
  textDecoration: 'none',
  color: '#334155',
  fontWeight: '500',
  position: 'relative',
  transition: 'color 0.2s',
  borderBottom: '2px solid transparent', // Adiciona uma borda transparente
};

// Estilo que será aplicado APENAS quando o link estiver ativo
const activeLinkStyle = {
  color: '#3b82f6',
  borderBottom: '2px solid #3b82f6', // A borda se torna azul
};

export default function Navbar() {
  // A função agora é mais simples e é passada diretamente para a prop 'style'
  const getLinkStyle = ({ isActive }) => {
    return isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle;
  };

  return (
    <header style={navbarStyle}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin</h1>
      <nav style={navLinksContainerStyle}>
        {/* A lógica do sublinhado foi simplificada e movida para o CSS-in-JS */}
        <NavLink to="/" style={getLinkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/products" style={getLinkStyle}>
          Produtos
        </NavLink>
        <NavLink to="/product-groups" style={getLinkStyle}>
          Grupos
        </NavLink>
        <NavLink to="/customers" style={getLinkStyle}>
          Clientes
        </NavLink>
        <NavLink to="/financial" style={getLinkStyle}>
          Financeiro
        </NavLink>
      </nav>
    </header>
  );
}