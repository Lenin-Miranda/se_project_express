const express = require("express");
const mongoose = require("mongoose");
const { NOT_FOUND } = require("./utils/errors");
const cors = require("cors");
const app = express();

const { PORT = 3001 } = process.env;
const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/clothingItems");
const { auth } = require("./middleware/auth");
const { createUser, login } = require("./controllers/users");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Rutas públicas SIN auth
app.post("/signup", createUser);
app.post("/signin", login);

// Middleware de autenticación
app.use(auth);

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
