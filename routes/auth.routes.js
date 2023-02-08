const {Router} = require ('express');
const { check } = require('express-validator');


const { login, googleSignIn } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post("/login", [
    check('email', 'Debe introducir un email válido.').isEmail(),
    check('password', 'La contraseña es obligatoria.').notEmpty(),
    validarCampos
] ,login);

router.post("/google", [
    check('id_token', 'id_token de google es necesario').notEmpty(),
    validarCampos
] ,googleSignIn);

module.exports = router;