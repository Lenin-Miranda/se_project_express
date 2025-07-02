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
const { createUser, login } = require("./controllers/users");
const errorHandler = require("./middleware/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");

// Configuración de CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://wtwrle.ignorelist.com",
  "https://www.wtwrle.ignorelist.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Rutas públicas SIN auth
app.post("/signup", createUser);
app.post("/signin", login);

// Rutas protegidas
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// Ruta para recursos inexistentes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.use(requestLogger);

app.use(errorLogger);
// Middleware de errores de celebrate
app.use(errors());

// Middleware de manejo de errores
app.use(errorHandler);
//Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
