const db = require('../services/mysql.service');

const validateOrder = (payload) => {
  if (!payload.usuario_id) return 'El usuario del pedido es obligatorio';
  if (!Array.isArray(payload.items) || payload.items.length === 0) return 'Debe incluir al menos un producto en el pedido';

  for (const item of payload.items) {
    if (!item.producto_id || !item.cantidad || Number(item.cantidad) <= 0) {
      return 'Cada item del pedido debe incluir producto_id y cantidad válida';
    }
  }

  return null;
};

const getAll = async (req, res) => {
  try {
    const orders = await db.list('orders');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar pedidos', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const order = await db.findById('orders', req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar pedido', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const items = req.body.items || [];
    const total = items.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.cantidad || 0), 0);

    const payload = {
      usuario_id: Number(req.body.usuario_id),
      fecha: new Date().toISOString(),
      total,
      estado: req.body.estado || 'pendiente',
      items
    };

    const validationError = validateOrder(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    const newOrder = await db.create('orders', payload);
    return res.status(201).json({ message: 'Pedido creado correctamente', order: newOrder });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear pedido', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await db.findById('orders', req.params.id);
    if (!existing) return res.status(404).json({ message: 'Pedido no encontrado' });

    const updatedPayload = {
      ...existing,
      ...req.body,
      items: Array.isArray(req.body.items) ? req.body.items : existing.items,
      total: req.body.total !== undefined ? Number(req.body.total) : existing.total
    };

    const validationError = validateOrder(updatedPayload);
    if (validationError) return res.status(400).json({ message: validationError });

    const updated = await db.update('orders', req.params.id, updatedPayload);
    return res.json({ message: 'Pedido actualizado correctamente', order: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await db.remove('orders', req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Pedido no encontrado' });
    return res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar pedido', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
