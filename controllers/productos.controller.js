const { response } = require("express");
const { Producto, Categoria } = require("../models");


const obtenerProductos = async(req, res = response) => {
    try {
        const {after = 0 , limit = 10} = req.query;
        const activas = {estado : true};

        const [total, productos] = await Promise.all([
            Producto.countDocuments(activas),
            Producto.find(activas)
                .populate('usuario', ' -_id name')
                .populate('categoria', '-_id nombre')
                .skip(Number(after))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            total, 
            productos
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Error al tratar de obtener todos los productos.',
            error
        });
    }
}

const obtenerProducto = async(req, res = response) => {
    try {
        const {id} = req.params;
        const producto = await Producto.findById(id)
            .populate('usuario', ' -_id name')
            .populate('categoria', '-_id nombre');

        res.status(200).json({
            producto
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Error al tratar de obtener el producto especificado.',
            error
        });
    }
}

const crearProducto = async(req, res = response) => {
    try {
        const nombre = req.body.nombre.toUpperCase();
        // const categoria = req.body.categoria.toUpperCase();

        const productoDB = await Producto.findOne({nombre});
        // const categoriaDB = await Categoria.findOne({nombre: categoria});

        // Validar si el producto existe o no en la base de datos.
        if (productoDB) {
            return res.status(400).json({msg: `El producto ${nombre} ya existe.`});
        }
        // if (!categoriaDB) {
        //     return res.status(400).json({ msg: `La categoría ${categoria} no existe. Se recomienda crear primero la categoría.`});
        // }

        // Definir la data del nuevo producto
        const data = {
            nombre,
            usuario: req.usuario._id,
            precio: req.body.precio,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion,
        }

        // Instanciar el nuevo producto
        const producto = new Producto(data);

        // Guardar en base de datos
        await producto.save();

        res.status(201).json({
            producto
        });
        
    } catch (error) {
        res.status(400).json({
            msg: 'Error al tratar de crear la categoría.',
            error
        });
    }
}

const actualizarProducto = async(req, res = response) => {
    try {
        const {id} = req.params;
        const {usuario, estado, ...data} = req.body;

        if (data.nombre) {
            data.nombre = data.nombre.toUpperCase();
        }
        
        data.usuario = req.usuario._id;
        
        const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

        res.status(201).json({
            producto
        });

    } catch (error) {
        res.status(401).json({
            msg: 'No ha sido posible actualizar el producto.',
            error
        });
    }

}

const borrarProducto = async(req, res = response) => {
    try {        
        const {id} = req.params;
        const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})

        res.status(201).json({
            msg: 'Producto deshabilitado.',
            producto
        });

    } catch (error) {
        res.status(401).json({
            msg: 'No ha sido posible eliminar el producto.',
            error
        });
    }
}

module.exports = {
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    borrarProducto
}