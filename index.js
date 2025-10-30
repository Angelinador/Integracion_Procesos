const express = require("express");
const sequelize = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// rutas
const {
  userRoute,
  recordRoute,
  logRoute,
  videoReferenceRoute,
  youtubeRoutes,
  imageRoutes,
  googleRoute
} = require("./src/routes/index.route");

// modelos
const {
  Usuario,
  Historial,
  VideoReferencia
} = require("./src/models/index.model");

// relaciones
const asignarRelaciones = require("./src/models/relations");

// middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const { validarToken } = require("./src/middlewares/validarToken.middleware");

app.listen(3000, () => {
  console.log("escuchando en el puerto 3000");
});

// endpoints
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use("/api", logRoute);
app.use("/api/usuarios", userRoute);
app.use("/api/historiales", validarToken, recordRoute);
app.use("/api/referencias", validarToken, videoReferenceRoute);
app.use("/api/youtube", validarToken, youtubeRoutes);
app.use("/api/images", validarToken, imageRoutes);

//router.post("/auth/google", googleRoute);

sequelize
  .sync({ alter: true })
  .then(async () => {
    await Usuario.sync();
    await Historial.sync();
    await VideoReferencia.sync();

    asignarRelaciones()
    console.log("base de datos sincronizada");
  })
  .catch((err) => console.error("error al sincronizar:", err));
