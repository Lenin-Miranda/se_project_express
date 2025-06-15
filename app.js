const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Variables o constantes globales
const { NOT_FOUND } = require("./utils/errors");

// App e imports locales
const app = express();
const { PORT = 3001 } = process.env;
const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/clothingItems");
const { auth } = require("./middleware/auth");
const { createUser, login } = require("./controllers/users");
// Configuración de CORS
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Rutas públicas SIN auth
app.post("/signup", createUser);
app.post("/signin", login);

// Middleware de autenticación
// app.use(auth);

// Rutas protegidas
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// Ruta para recursos inexistentes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
