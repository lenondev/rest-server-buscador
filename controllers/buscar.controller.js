
const {ObjectId} = require('mongoose').Types;

const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            result: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{isActive: true}]
    });

    /*CONTEO*/
    // const usuarios = await Usuario.count({
    //     $or: [{name: regex}, {email: regex}, {isActive: true}],
    //     $and: [{isActive: true}]
    // });

    return res.json({
        results: usuarios
    });
}

const buscarCategorias = async( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            result: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado: true});

    return res.json({
        results: categorias
    });
}

const buscarProductos = async( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino);
        return res.json({
            result: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({nombre: regex, estado: true});

    return res.json({
        results: productos
    });
}

const buscar = async(req, res = response) => {


    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Error del servidor - Controlador de buscar'
            });
            break;
    }
}

module.exports = {
    buscar,
}