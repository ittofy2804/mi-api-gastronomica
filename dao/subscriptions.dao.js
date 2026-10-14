const db = require('../services/mysql.service');

const validateSubscription = (payload) => {
  if (!payload.usuario_id) return 'El usuario es obligatorio';
  if (!payload.plan || !payload.plan.trim()) return 'El plan es obligatorio';
  if (!payload.fecha_inicio) return 'La fecha de inicio es obligatoria';
  if (!payload.fecha_fin) return 'La fecha de fin es obligatoria';
  return null;
};

const getAll = async (req, res) => {
  try {
    const subscriptions = await db.list('subscriptions');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar suscripciones', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const subscription = await db.findById('subscriptions', req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Suscripción no encontrada' });
    return res.json(subscription);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar suscripción', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const payload = {
      usuario_id: Number(req.body.usuario_id),
      plan: req.body.plan,
      fecha_inicio: req.body.fecha_inicio,
      fecha_fin: req.body.fecha_fin,
      estado: req.body.estado || 'activa'
    };

    const validationError = validateSubscription(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    const newSubscription = await db.create('subscriptions', payload);
    return res.status(201).json({ message: 'Suscripción creada correctamente', subscription: newSubscription });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear suscripción', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await db.findById('subscriptions', req.params.id);
    if (!existing) return res.status(404).json({ message: 'Suscripción no encontrada' });

    const payload = { ...existing, ...req.body };
    const validationError = validateSubscription(payload);
    if (validationError) return res.status(400).json({ message: validationError });

    const updated = await db.update('subscriptions', req.params.id, payload);
    return res.json({ message: 'Suscripción actualizada correctamente', subscription: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar suscripción', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await db.remove('subscriptions', req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Suscripción no encontrada' });
    return res.json({ message: 'Suscripción eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar suscripción', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
