const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpetaDestino = '' ) => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];

        //Validar la extension 
        if(!extensionesValidas.includes( extension )){
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }

        const nombreNuevo = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpetaDestino, nombreNuevo);

        archivo.mv(uploadPath, (error) => {
            if(error){
                return reject( error );
            }

            return resolve(nombreNuevo);
        });
    }); 
};

module.exports = {
    subirArchivo
};