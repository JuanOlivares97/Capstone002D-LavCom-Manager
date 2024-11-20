const jwt = require("jsonwebtoken");
const prisma = require("../server/prisma");

async function loginRequired(req, res, next) {
    try {
        const token = req.cookies["token"];
        if (!token) {
            return res.redirect("/laundry-manager/auth/login");
        }

        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.redirect("/laundry-manager/auth/login");
        }

        // Buscar el usuario en la base de datos
        const user = await prisma.usuarios.findUnique({
            where: { id_usuario: decoded.id_usuario },
        });

        if (!user) {
            return res.redirect("/laundry-manager/auth/login");
        }

        req.user = {
            rutLogueado: user.rut_usuario,
            nombreLogueado: user.nombre,
            tipo_usuario: user.id_tipo_usuario,
            id_usuario: user.id_usuario
        } 
        
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

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

module.exports = {
    loginRequired,
    Fn
};
