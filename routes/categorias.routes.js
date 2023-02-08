const {Router} = require ('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    borrarCategoria 
} = require('../controllers/categorias.controller');

const { existeCategoriaById } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorías - público
router.get('/', obtenerCategorias);

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un id de mongo.').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], obtenerCategoria);

// Crear una nueva categoría - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'Debe introducir un nombre').notEmpty(),
    validarCampos
], crearCategoria);

// Actualizar un registro por id - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'el nombre es obligatorio').notEmpty(),
    check('id').custom(existeCategoriaById),
    validarCampos
], actualizarCategoria);

// Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo.').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], borrarCategoria);

module.exports = router;