// src/pages/Customers/index.jsx

import { useState, useEffect } from 'react';
import styles from './style.module.css';
import { supabase } from '../../supabaseClient';

import CustomerTable from './components/CustomerTable';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_customers_with_details');

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      setLoading(false);
      return;
    }

    const formattedCustomers = data.map(customer => {
      let expirationDate = null;
      
      // Se for assinante e tiver data de início...
      if (customer.is_subscribed && customer.subscribed_since) {
        const joinDate = new Date(customer.subscribed_since);
        
        // =========================================================
        // === MUDANÇA AQUI: Calculando +30 dias para a expiração ===
        // =========================================================
        expirationDate = new Date(joinDate.setDate(joinDate.getDate() + 30)).toISOString();
      }

      return {
        id: customer.id,
        name: customer.full_name,
        email: customer.email,
        subscription: customer.is_subscribed ? 'premium' : 'basic',
        joinDate: customer.subscribed_since,
        expirationDate: expirationDate,
      };
    });

    setCustomers(formattedCustomers);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>Clientes</h1>
        <p className={styles.description}>Lista de todos os clientes cadastrados na plataforma.</p>
      </div>

      {loading ? (
        <p>Carregando clientes...</p>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </div>
  );
}