// Middleware que muestra por consola todas las solicitudes
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next()
}


// Middleware de ruta para validar el id en la ruta /api/productos/:id
const validateId = (req, res, next) => {
    const { id } = req.params;

    //Validar que el id sea un numero
    if (!id ||isNaN(id)) {
        return res.status(400).json({
            message : "El ID debe ser un número"
        });
    }

    //Convertimos el parametro id de un string a un numero entero
    req.id = parseInt(id, 10);

    console.log("Id validado: ", req.id);

    next();
}

// Middleware para verificar si hay una sesion creado, si no lo está, se redirige al login

const requireLogin = (req, res, next) => {
   
    if(!req.session.user) {
         return res.redirect("/login");
  }
    
    next();
}


export {
    loggerUrl,
    validateId,
    requireLogin
};