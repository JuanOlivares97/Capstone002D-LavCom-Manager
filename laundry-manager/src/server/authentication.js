const jwt = require("jsonwebtoken");

async function loginRequired(req, res, next) {
    try {
        const loggedIn = req.cookies["logged-in"];

        if (!loggedIn) {
            return res.redirect("/auth/login");
        }

        const token = req.cookies["token"];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        if (!decoded) {
            return res.redirect("/auth/login");
        }

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginForbidden(req, res, next) {
    try {
        const loggedIn = req.cookies["logged-in"];

        if (loggedIn) {
            return res.redirect("/help/home");
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function rolesAllowed(roles) {
    return (req, res, next) => {
        try {
            const role = req.user.tipo_usuario;

            if (!roles.includes(role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = {
    loginRequired,
    loginForbidden,
    rolesAllowed
}