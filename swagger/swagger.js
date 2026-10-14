const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Gastronomica',
    version: '1.0.0',
    description: 'API REST para la gestión de usuarios, categorías, productos, pedidos y suscripciones de la plataforma gastronomica.'
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Servidor local' }
  ],
  paths: {
    '/api/users': {
      get: {
        summary: 'Listar usuarios',
        responses: {
          200: { description: 'Lista de usuarios' },
          500: { description: 'Error interno' }
        }
      },
      post: {
        summary: 'Crear usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserInput'
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuario creado' },
          400: { description: 'Validación fallida' },
          409: { description: 'Usuario duplicado' }
        }
      }
    },
    '/api/users/login': {
      post: {
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@restaurante.com' },
                  password: { type: 'string', example: 'admin123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login exitoso' },
          400: { description: 'Datos incompletos' },
          401: { description: 'Credenciales inválidas' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        summary: 'Consultar usuario por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Usuario encontrado' }, 404: { description: 'No encontrado' } }
      },
      put: {
        summary: 'Actualizar usuario',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } }
        },
        responses: {
          200: { description: 'Usuario actualizado' },
          400: { description: 'Validación fallida' },
          404: { description: 'Usuario no existe' }
        }
      },
      delete: {
        summary: 'Eliminar usuario',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Usuario eliminado' }, 404: { description: 'No encontrado' } }
      }
    },
    '/api/categories': {
      get: { summary: 'Listar categorías', responses: { 200: { description: 'OK' } } },
      post: {
        summary: 'Crear categoría',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryInput' } } } },
        responses: { 201: { description: 'Categoría creada' }, 400: { description: 'Datos inválidos' } }
      }
    },
    '/api/categories/{id}': {
      get: { summary: 'Consultar categoría', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 404: { description: 'No existe' } } },
      put: { summary: 'Actualizar categoría', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryInput' } } } }, responses: { 200: { description: 'Actualizado' }, 404: { description: 'No existe' } } },
      delete: { summary: 'Eliminar categoría', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Eliminado' }, 404: { description: 'No existe' } } }
    },
    '/api/products': {
      get: { summary: 'Listar productos', responses: { 200: { description: 'OK' } } },
      post: {
        summary: 'Crear producto',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } },
        responses: { 201: { description: 'Producto creado' }, 400: { description: 'Datos inválidos' } }
      }
    },
    '/api/products/{id}': {
      get: { summary: 'Consultar producto', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 404: { description: 'No existe' } } },
      put: { summary: 'Actualizar producto', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } }, responses: { 200: { description: 'Actualizado' }, 404: { description: 'No existe' } } },
      delete: { summary: 'Eliminar producto', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Eliminado' }, 404: { description: 'No existe' } } }
    },
    '/api/orders': {
      get: { summary: 'Listar pedidos', responses: { 200: { description: 'OK' } } },
      post: {
        summary: 'Crear pedido',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderInput' } } } },
        responses: { 201: { description: 'Pedido creado' }, 400: { description: 'Datos inválidos' } }
      }
    },
    '/api/orders/{id}': {
      get: { summary: 'Consultar pedido', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 404: { description: 'No existe' } } },
      put: { summary: 'Actualizar pedido', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderInput' } } } }, responses: { 200: { description: 'Actualizado' }, 404: { description: 'No existe' } } },
      delete: { summary: 'Eliminar pedido', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Eliminado' }, 404: { description: 'No existe' } } }
    },
    '/api/subscriptions': {
      get: { summary: 'Listar suscripciones', responses: { 200: { description: 'OK' } } },
      post: {
        summary: 'Crear suscripción',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SubscriptionInput' } } } },
        responses: { 201: { description: 'Suscripción creada' }, 400: { description: 'Datos inválidos' } }
      }
    },
    '/api/subscriptions/{id}': {
      get: { summary: 'Consultar suscripción', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 404: { description: 'No existe' } } },
      put: { summary: 'Actualizar suscripción', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SubscriptionInput' } } } }, responses: { 200: { description: 'Actualizado' }, 404: { description: 'No existe' } } },
      delete: { summary: 'Eliminar suscripción', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Eliminado' }, 404: { description: 'No existe' } } }
    }
  },
  components: {
    schemas: {
      UserInput: {
        type: 'object',
        required: ['nombre', 'apellido', 'email', 'password'],
        properties: {
          nombre: { type: 'string', example: 'Ana' },
          apellido: { type: 'string', example: 'Cárdenas' },
          email: { type: 'string', example: 'ana@restaurante.com' },
          password: { type: 'string', example: 'cliente123' },
          rol: { type: 'string', example: 'cliente' },
          telefono: { type: 'string', example: '3001234567' },
          ciudad: { type: 'string', example: 'Bogotá' }
        }
      },
      CategoryInput: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', example: 'Entradas' },
          descripcion: { type: 'string', example: 'Platos para iniciar la experiencia' }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['nombre', 'categoria_id', 'precio'],
        properties: {
          nombre: { type: 'string', example: 'Lomo a la plancha' },
          descripcion: { type: 'string', example: 'Carne premium con papas' },
          precio: { type: 'number', example: 42000 },
          categoria_id: { type: 'integer', example: 2 },
          imagen: { type: 'string', example: 'lomo.jpg' },
          disponible: { type: 'boolean', example: true }
        }
      },
      OrderInput: {
        type: 'object',
        required: ['usuario_id', 'items'],
        properties: {
          usuario_id: { type: 'integer', example: 2 },
          estado: { type: 'string', example: 'pendiente' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['producto_id', 'cantidad', 'precio'],
              properties: {
                producto_id: { type: 'integer', example: 1 },
                cantidad: { type: 'integer', example: 2 },
                precio: { type: 'number', example: 27000 }
              }
            }
          }
        }
      },
      SubscriptionInput: {
        type: 'object',
        required: ['usuario_id', 'plan', 'fecha_inicio', 'fecha_fin'],
        properties: {
          usuario_id: { type: 'integer', example: 2 },
          plan: { type: 'string', example: 'Premium' },
          fecha_inicio: { type: 'string', format: 'date', example: '2026-10-01' },
          fecha_fin: { type: 'string', format: 'date', example: '2026-11-01' },
          estado: { type: 'string', example: 'activa' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
