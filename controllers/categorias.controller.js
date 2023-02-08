const { Categoria } = require("../models")


//obtenerCategorías - paginado - total - populate
const obtenerCategorias = async(req, res) => {
    try {
        const {limit = 10, after = 0} = req.query;
        const activas = {estado : true};
        
        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(activas),
            Categoria.find(activas)
                .populate('usuario', 'name')
                .skip(Number(after))
                .limit(Number(limit))
        ]);
    
        res.status(200).json({
            total, 
            categorias
        });        
        
    } catch (error) {
        res.status(401).json({
            msg: 'No ha sido posible obtener las categorías.',
            error
        });
    }
}

//obtenerCategoría - populate
const obtenerCategoria = async(req, res) => {
    try {
        const {id} = req.params;
        const categoria = await Categoria.findById(id)
            .populate('usuario', 'name');

        res.status(200).json({
            categoria
        });

    } catch (error) {
        res.status(401).json({
            msg: 'No ha sido posible obtener la categoría.',
            error
        });
    }    
}

const crearCategoria =  async(req, res) => {
    try {    
        const nombre = req.body.nombre.toUpperCase();
        const categoriaDB = await Categoria.findOne({nombre});
        
        // Validar si ya existe la categoría
        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoría ${categoriaDB.nombre}, ya existe.`
            });
        }

        // Generar la data a guardar
        const data = {
            nombre,
            usuario:req.usuario._id,
        }

        // Generar nueva categoría
        const categoria = new Categoria(data);

        // Guardar en base de datos
        await categoria.save();
   
        res.status(201).json({
            msg: `Se ha creado la nueva categoría: ${nombre}`,
            categoria
        });
    
    } catch (error) {
        res.status(401).json({
            msg: 'No ha sido posible crear la nueva categoría.',
            error
        });
    }
}

// actualizarCategoria
const actualizarCategoria = async(req, res) => {
    try {
        const {id} = req.params;
        const {usuario, estado, ...data} = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuario._id;

        const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
        
        res.status(201).json({
            categoria
        });

    } catch (error) {
        res.status(401).json({
            msg: 'No ha sido posible actualizar la categoría.',
            error
        });
    }
}

// borrarCategoria - estado: false
const borrarCategoria = async(req, res) => {
    try {        
        const {id} = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})

        res.status(201).json({
            msg: 'Categoría deshabilitada.',
            categoria
        });

    } catch (error) {
        res.status(401).json({
            msg: 'No ha sido posible eliminar la categoría.',
            error
        });
    }
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}