const createId = (collection) => {
  const ids = collection.map((item) => Number(item.id) || 0);
  return ids.length ? Math.max(...ids) + 1 : 1;
};

const data = {
  users: [
    {
      id: 1,
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@restaurante.com',
      password: 'admin123',
      rol: 'admin',
      telefono: '555000111',
      ciudad: 'Bogotá',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Ana',
      apellido: 'Cárdenas',
      email: 'ana@restaurante.com',
      password: 'cliente123',
      rol: 'cliente',
      telefono: '555000222',
      ciudad: 'Medellín',
      estado: 'activo'
    }
  ],
  categories: [
    { id: 1, nombre: 'Entradas', descripcion: 'Platos para iniciar la experiencia.' },
    { id: 2, nombre: 'Principales', descripcion: 'Especialidades del chef.' },
    { id: 3, nombre: 'Postres', descripcion: 'Opciones dulces.' }
  ],
  products: [
    { id: 1, nombre: 'Ceviche de mariscos', descripcion: 'Mariscos frescos con cítricos.', precio: 27000, categoria_id: 1, imagen: 'ceviche.jpg', disponible: true },
    { id: 2, nombre: 'Lomo a la plancha', descripcion: 'Carne premium con papas.', precio: 42000, categoria_id: 2, imagen: 'lomo.jpg', disponible: true },
    { id: 3, nombre: 'Tiramisu', descripcion: 'Postre clásico con café.', precio: 18000, categoria_id: 3, imagen: 'tiramisu.jpg', disponible: true }
  ],
  orders: [
    { id: 1, usuario_id: 2, fecha: '2026-10-14T12:00:00.000Z', total: 70000, estado: 'pendiente', items: [{ producto_id: 1, cantidad: 1, precio: 27000 }, { producto_id: 3, cantidad: 1, precio: 18000 }] }
  ],
  subscriptions: [
    { id: 1, usuario_id: 2, plan: 'Premium', fecha_inicio: '2026-10-01', fecha_fin: '2026-11-01', estado: 'activa' }
  ]
};

const list = (table) => [...(data[table] || [])];

const getById = (table, id) => {
  const collection = data[table] || [];
  return collection.find((item) => Number(item.id) === Number(id)) || null;
};

const findOneByField = (table, fieldName, value) => {
  const collection = data[table] || [];
  return collection.find((item) => String(item[fieldName]) === String(value)) || null;
};

const create = (table, payload) => {
  const collection = data[table] || [];
  const newItem = { id: createId(collection), ...payload };
  collection.push(newItem);
  data[table] = collection;
  return newItem;
};

const update = (table, id, payload) => {
  const collection = data[table] || [];
  const index = collection.findIndex((item) => Number(item.id) === Number(id));
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...payload };
  data[table] = collection;
  return collection[index];
};

const remove = (table, id) => {
  const collection = data[table] || [];
  const index = collection.findIndex((item) => Number(item.id) === Number(id));
  if (index === -1) return false;
  collection.splice(index, 1);
  data[table] = collection;
  return true;
};

const findByEmail = (email) => findOneByField('users', 'email', email);

module.exports = {
  data,
  list,
  getById,
  findOneByField,
  create,
  update,
  remove,
  findByEmail
};
