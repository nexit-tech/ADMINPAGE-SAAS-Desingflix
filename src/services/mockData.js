// src/services/mockData.js

export const MOCKED_GROUPS = [
  { id: 1, name: 'Smartphones' },
  { id: 2, name: 'Notebooks' },
  { id: 3, name: 'Fones de Ouvido' },
  { id: 4, name: 'Monitores' },
];

export const MOCKED_PRODUCTS = [
  {
    id: 101,
    name: 'Galaxy Zold 5',
    // price: 9799.99, <-- REMOVIDO
    groupId: 1,
    imageUrl: 'https://images.samsung.com/br/smartphones/galaxy-z-fold5/buy/product_color_carousel_cream.png'
  },
  {
    id: 102,
    name: 'Macbook Pro 14"',
    // price: 14499.00, <-- REMOVIDO
    groupId: 2,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200'
  },
  {
    id: 103,
    name: 'Sony WH-1000XM5',
    // price: 2250.00, <-- REMOVIDO
    groupId: 3,
    imageUrl: 'https://ecom-media.croma.com/croma/image/upload/v1669022633/Croma%20Assets/Entertainment/Headphones%20and%20Earphones/Images/258215_x2ns2l.png'
  },
];

export const MOCKED_CUSTOMERS = [
  { id: 201, name: 'Ana Silva', email: 'ana.silva@email.com', subscription: 'premium', joinDate: '2024-08-10', expirationDate: '2025-08-10' },
  { id: 202, name: 'Bruno Costa', email: 'bruno.c@email.com', subscription: 'basic', joinDate: '2024-09-05', expirationDate: null },
  { id: 203, name: 'Carla Dias', email: 'carla.dias@email.com', subscription: 'premium', joinDate: '2024-09-22', expirationDate: '2025-09-22' },
  { id: 204, name: 'Daniel Alves', email: 'daniel.a@email.com', subscription: 'premium', joinDate: '2025-01-15', expirationDate: '2026-01-15' },
  { id: 205, name: 'Eduarda Lima', email: 'eduarda.lima@email.com', subscription: 'basic', joinDate: '2025-02-20', expirationDate: null },
  { id: 206, name: 'Fábio Souza', email: 'fabio.s@email.com', subscription: 'basic', joinDate: '2025-03-11', expirationDate: null },
];

export const MOCKED_TRANSACTIONS = [
  { id: 301, date: '2025-09-25', description: 'Assinatura Premium - Ana Silva', amount: 29.90 },
  { id: 302, date: '2025-09-22', description: 'Assinatura Premium - Carla Dias', amount: 29.90 },
  { id: 303, date: '2025-09-20', description: 'Venda Produto "Galaxy Zold 5"', amount: 9799.99 },
  { id: 304, date: '2025-08-15', description: 'Assinatura Premium - Daniel Alves', amount: 29.90 },
  { id: 305, date: '2025-08-10', description: 'Assinatura Premium - Ana Silva', amount: 29.90 },
  { id: 306, date: '2025-08-01', description: 'Venda Produto "Macbook Pro 14"', amount: 14499.00 },
  { id: 307, date: '2025-07-25', description: 'Assinatura Premium - Carla Dias', amount: 29.90 },
  { id: 308, date: '2025-07-15', description: 'Assinatura Premium - Daniel Alves', amount: 29.90 },
];