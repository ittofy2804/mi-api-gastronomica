const db = require('../services/mysql.service');

const validateCategory = (payload) => {
  if (!payload.nombre || !payload.nombre.trim()) {
    return 'El nombre de la categoría es obligatorio';
  }

  return null;
};

const getAll = async (req, res) => {
  try {
    const categories = await db.list('categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar categorías', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const category = await db.findById('categories', req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar categoría', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const validationError = validateCategory(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const newCategory = await db.create('categories', {
      nombre: req.body.nombre.trim(),
      descripcion: req.body.descripcion || ''
    });

    return res.status(201).json({ message: 'Categoría creada correctamente', category: newCategory });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await db.findById('categories', req.params.id);
    if (!existing) return res.status(404).json({ message: 'Categoría no encontrada' });

    const payload = { ...existing, ...req.body, nombre: req.body.nombre ? req.body.nombre.trim() : existing.nombre };
    const validationError = validateCategory(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    const updated = await db.update('categories', req.params.id, payload);
    return res.json({ message: 'Categoría actualizada correctamente', category: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await db.remove('categories', req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Categoría no encontrada' });
    return res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
