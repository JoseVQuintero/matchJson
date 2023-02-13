const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

const apiRouter = require("../middlewares/api.js");

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


router.use("/api", apiRouter);

module.exports = router;