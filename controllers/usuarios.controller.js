const {response} = require('express');        // Para importar el método de respuestas a peticiones de express
const Usuario = require('../models/usuario'); // Para importar modelo de creación de usuario
const bcryptjs = require('bcryptjs');         // Para encriptar contraseñas


const usuariosGet = async (req, res = response) => {
  const {limit = 5, desde = 0} = req.query;
  const query = { isActive : true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limit))
  ])

  res.json({
    total, 
    usuarios
  });
}

const usuariosPut = async (req, res = response) => {  
  const {id} = req.params; // Extraemos el id de los params.
  const { _id, password, google, email, ...resto } = req.body; // separamos del body los elementos que no permitiremos modificar.
  
  // Validación contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // vueltas a la contraseña
    resto.password = bcryptjs.hashSync(password, salt); // Encriptar la contraseña en una sola vía
  }
  // Update de los elementos incluidos en 'resto', de acuerdo al id que pasamos como parámetro en la url.
  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
  usuario
  });
}

const usuariosPost = async (req, res = response) => {

  const {name, email, password, role} = req.body;
  const usuario = new Usuario({name, email, password, role});
  
  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync(); // vueltas a la contraseña
  usuario.password = bcryptjs.hashSync(password, salt) // Encriptar la contraseña en una sola vía

  // Guardar en base de datos.
  await usuario.save();

  // Respuesta http
  res.status(201).json({
    usuario
  });
}

const usuariosDelete = async (req, res = response) => {
  
  const {id} = req.params;
  // Para borrar físicamente
  // const usuario = await Usuario.findByIdAndDelete(id);
  const usuario = await Usuario.findByIdAndUpdate(id, {isActive: false});
  
  res.json(usuario);
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}