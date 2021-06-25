const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Error: Se quiere validar un role sin antes hacer la validación del token'
        });
    }
    
    const { rol, nombre } = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ nombre } no tiene permisos para realizar esta accion`
        });
    }

    next();
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {

        if(!req.usuario){
            return res.status(500).json({
                msg: 'Error: Se quiere validar un role sin antes hacer la validación del token'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El usuario no tiene asociado alguno de los siguientes roles: ${roles}`
            });
        }

        next();
    };
}

module.exports = {
    esAdminRole,
    tieneRole
}