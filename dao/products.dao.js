const db = require('../services/mysql.service');

const validateProduct = (payload) => {
  if (!payload.nombre || !payload.nombre.trim()) return 'El nombre del producto es obligatorio';
  if (!payload.categoria_id) return 'La categoría del producto es obligatoria';
  if (!payload.precio || Number(payload.precio) <= 0) return 'El precio debe ser mayor a 0';
  return null;
};

const getAll = async (req, res) => {
  try {
    const products = await db.list('products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar productos', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const product = await db.findById('products', req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar producto', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const payload = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || '',
      precio: Number(req.body.precio),
      categoria_id: Number(req.body.categoria_id),
      imagen: req.body.imagen || '',
      disponible: req.body.disponible !== undefined ? Boolean(req.body.disponible) : true
    };

    const validationError = validateProduct(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    const newProduct = await db.create('products', payload);
    return res.status(201).json({ message: 'Producto creado correctamente', product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await db.findById('products', req.params.id);
    if (!existing) return res.status(404).json({ message: 'Producto no encontrado' });

    const payload = {
      ...existing,
      ...req.body,
      precio: req.body.precio !== undefined ? Number(req.body.precio) : existing.precio,
      categoria_id: req.body.categoria_id !== undefined ? Number(req.body.categoria_id) : existing.categoria_id,
      disponible: req.body.disponible !== undefined ? Boolean(req.body.disponible) : existing.disponible
    };

    const validationError = validateProduct(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    const updated = await db.update('products', req.params.id, payload);
    return res.json({ message: 'Producto actualizado correctamente', product: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await db.remove('products', req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    return res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
