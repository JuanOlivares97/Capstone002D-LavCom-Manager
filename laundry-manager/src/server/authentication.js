const jwt = require("jsonwebtoken");
const prisma = require("../server/prisma");

// MIDDLEWARE PARA VERIFICAR LA AUTENTICACIÓN
async function loginRequired(req, res, next) {
    try {
        // Obtener el token JWT de las cookies
        const token = req.cookies["token"];

        // Verificar si el token no existe
        if (!token) {
            // Si no existe, redirigir al usuario a la página de login
            return res.redirect("/laundry-manager/auth/login");
        }

        // Verificar y decodificar el token JWT usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Si el token no es válido o no puede ser decodificado, redirigir al login
        if (!decoded) {
            return res.redirect("/laundry-manager/auth/login");
        }

        // Buscar el usuario en la base de datos usando el id_usuario decodificado del token
        const user = await prisma.usuarios.findUnique({
            where: { id_usuario: decoded.id_usuario },
        });

        // Si el usuario no se encuentra en la base de datos, redirigir al login
        if (!user) {
            return res.redirect("/laundry-manager/auth/login");
        }

        // Agregar los datos del usuario al objeto `req.user` para que esté disponible en las siguientes funciones
        req.user = {
            rutLogueado: user.rut_usuario,
            nombreLogueado: user.nombre,
            tipo_usuario: user.id_tipo_usuario,
            id_usuario: user.id_usuario
        };
        
        // Continuar con la siguiente función en el middleware stack
        next();
    } catch (error) {
        // Responder con un error 401 (no autorizado) si la autenticación falla
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

// FUNCIONES AUXILIARES PARA VALIDAR EL RUT, OBTENIDAS DE INTERNET
var Fn = {
	// Valida el rut con su cadena completa "XXXXXXXX-X"
	validaRut : function (rutCompleto) {
		rutCompleto = rutCompleto.replace("‐","-");
		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
			return false;
		var tmp 	= rutCompleto.split('-');
		var digv	= tmp[1]; 
		var rut 	= tmp[0];
		if ( digv == 'K' ) digv = 'k' ;
		
		return (Fn.dv(rut) == digv );
	},
	dv : function(T){
		var M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'k';
	}
}

// Función para verificar el rol del usuario
function rolesAllowed(roles) {
    return (req, res, next) => {
        try {
            const role = req.user.tipo_usuario;
            console.log(role);
            

            if (!roles.includes(role)) {
                return res.status(403).render("error", {layout: false, message: "No tienes suficientes permisos para acceder a esta ruta"});
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

// EXPORTAR FUNCIONES
module.exports = {
    loginRequired,
    Fn,
    rolesAllowed
};
