const {Router} = require ('express');
const { check } = require('express-validator');

const {validarCampos, 
        validarJWT, 
        esAdminRole, 
        tieneRole} = require('../middlewares');
const { esRolValido, emailExiste, existeUsuarioById } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete } = require('../controllers/usuarios.controller');

const router = Router();

router.get("/", usuariosGet );

router.put("/:id", [
        check('id', 'El id introducido no es válido.').isMongoId(), // Verifica que el id sea uno de Mongo.
        check('id').custom(existeUsuarioById), // Verifica que el id introducido pertenezca a algún usuario creado.
        check('name', 'Debe introducir un nombre.').not().isEmpty(),
        check('role').custom(esRolValido),
        validarCampos
], usuariosPut);

router.post("/", [
        check('name', 'Debe introducir un nombre.').not().isEmpty(),
        check('email', 'Debe introducir un email válido.').isEmail(),
        check('email').custom(emailExiste),
        check('password', 'El password debe contener más de 6 letras.').isLength({min:6}),
        // check('role', 'No es un rol permitido.').isIn('ADMIN_ROLE', 'USER_ROLE'),
        check('role').custom(esRolValido),
        validarCampos
], usuariosPost);

router.delete("/:id", [
        validarJWT,
        //esAdminRole, // validador estricto.
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'GOKU_ROLE'),// validador pasando los roles permitidos como parámetro.
        check('id', 'El id introducido no es válido.').isMongoId(), // Verifica que el id sea uno de Mongo.
        check('id').custom(existeUsuarioById), // Verifica que el id introducido pertenezca a algún usuario creado.,
        validarCampos
] ,usuariosDelete);


module.exports = router;