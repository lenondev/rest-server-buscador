const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero.',
        });
    }
    const {role, name} = req.usuario;
    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${name} no es Administrador. - No puede realizar esta acción.`,
        });
    }
    next()
}

const tieneRole = (...roles) => {
    
    return (req = request, res = response, next) => {
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero.',
            });
        }
        const {role, name} = req.usuario;
        if (!roles.includes(role)) {
            return res.status(401).json({
                msg: `${name} no tiene un rol válido. - No puede realizar esta acción.`,
            });
        }
        next();
    }

}


module.exports = {
    esAdminRole,
    tieneRole
}