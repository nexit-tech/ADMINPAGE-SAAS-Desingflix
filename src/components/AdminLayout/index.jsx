// src/components/AdminLayout/index.jsx

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, Users, DollarSign, LogOut } from 'lucide-react';
import styles from './style.module.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <h2></h2>
          </div>
          
          <div className={styles.navLinks}>
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/admin/produtos"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              <Package size={20} />
              <span>Produtos</span>
            </NavLink>

            <NavLink 
              to="/admin/grupos"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              <FolderTree size={20} />
              <span>Grupos</span>
            </NavLink>

            <NavLink 
              to="/admin/clientes"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              <Users size={20} />
              <span>Clientes</span>
            </NavLink>

            <NavLink 
              to="/admin/financeiro"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              <DollarSign size={20} />
              <span>Financeiro</span>
            </NavLink>
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}