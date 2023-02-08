const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Token no encontrado.'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BBDD.'
            });
        }

        // Verificar si el uid tiene isActive en true
        if (!usuario.isActive) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no activo.'
            });
        }

        // incluir el usuario en el request.
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido.'
        })
    }

}

module.exports = {
    validarJWT
}