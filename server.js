const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger");

const userRoutes = require("./routes/users.routes");
const categoryRoutes = require("./routes/categories.routes");
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const subscriptionRoutes = require("./routes/subscriptions.routes");

const PORT = process.env.PORT || 5000;
const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(express.static("public"));

api.get("/", (req, res) => {
  res.json({
    name: "API gastronomica",
    version: "1.0.0",
    docs: "/api-docs",
    resources: ["/api/users", "/api/categories", "/api/products", "/api/orders", "/api/subscriptions"]
  });
});

api.use("/api/users", userRoutes);
api.use("/api/categories", categoryRoutes);
api.use("/api/products", productRoutes);
api.use("/api/orders", orderRoutes);
api.use("/api/subscriptions", subscriptionRoutes);
api.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

api.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger: http://localhost:${PORT}/api-docs`);
});