const response = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        /*---> Validaciones <---*/

        // Si el email existe
        const usuario = await Usuario.findOne({email})
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            });
        }

        // Si el usuario está activo.
        if (!usuario.isActive) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - isActive: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Algo salió mal, hable con el administrador.',
        })
    }
}

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        const {name, email, picture} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({email});

        if (!usuario) {
            // Tengo que crearlo
            const data = {
                name,
                email,
                password: ':P',
                role: 'USER_ROLE',
                picture,
                google: true
                
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en BD está inactivo
        if (!usuario.isActive) {
            return res.status(401).json({
                msg: 'Usuario inactivo. Contacte con el administrador del sistema.'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Todo bien.',
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar.',
            error
        });
    }


}



module.exports = {
    login,
    googleSignIn
}