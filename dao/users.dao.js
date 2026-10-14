const db = require('../services/mysql.service');

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

const validateUserPayload = (payload, partial = false) => {
  const requiredFields = ['nombre', 'apellido', 'email', 'password'];
  const missing = requiredFields.filter((field) => !partial && !payload[field]);

  if (missing.length) {
    return `Faltan campos obligatorios: ${missing.join(', ')}`;
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return 'El correo electrónico no es válido.';
  }

  if (payload.password && payload.password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }

  return null;
};

const getAll = async (req, res) => {
  try {
    const users = await db.list('users');
    res.json(users.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await db.findById('users', req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(sanitizeUser(user));
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar usuario', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol = 'cliente', telefono = '', ciudad = '', estado = 'activo' } = req.body;

    const validationError = validateUserPayload({ nombre, apellido, email, password });
    if (validationError) return res.status(400).json({ message: validationError });

    const existing = await db.findByField('users', 'email', email);
    if (existing) return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });

    const newUser = await db.create('users', { nombre, apellido, email, password, rol, telefono, ciudad, estado });
    return res.status(201).json({ message: 'Usuario creado correctamente', user: sanitizeUser(newUser) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existingUser = await db.findById('users', req.params.id);
    if (!existingUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    const updatedPayload = { ...existingUser, ...req.body };
    const validationError = validateUserPayload(updatedPayload, true);
    if (validationError) return res.status(400).json({ message: validationError });

    if (req.body.email && req.body.email !== existingUser.email) {
      const emailUsed = await db.findByField('users', 'email', req.body.email);
      if (emailUsed && Number(emailUsed.id) !== Number(req.params.id)) {
        return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
      }
    }

    const updated = await db.update('users', req.params.id, updatedPayload);
    return res.json({ message: 'Usuario actualizado correctamente', user: sanitizeUser(updated) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await db.remove('users', req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await db.findByField('users', 'email', email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    return res.json({
      message: 'Inicio de sesión exitoso',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove, login };
