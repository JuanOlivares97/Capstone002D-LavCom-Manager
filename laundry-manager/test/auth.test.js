const authController = require("../src/controllers/auth.controller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const multiTest = require("./helpers/multiTest");
const {enviarCorreo} = require("../src/server/mailer");

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    hashSync: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));

jest.mock('@prisma/client', () => {
    const mockPrisma = require("./helpers/mockPrisma");
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

jest.mock("../src/server/mailer", () => ({
    enviarCorreo: jest.fn()
}))

describe("renderLogin", () => {
    let req, res;
    beforeEach(() => {
        req = {};
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test("should render login page", () => {
        authController.renderLogin(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.render).toHaveBeenCalledWith("auth/login", { layout: false }),
        ])
    });
});

describe("renderRecuperarContrasenaForm", () => {
    let req, res;
    beforeEach(() => {
        req = {};
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test("should render recuperar contrasena form page", () => {
        authController.renderRecuperarContrasenaForm(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.render).toHaveBeenCalledWith("auth/recuperar_pwd_form", { layout: false }),
        ])
    });
});

describe("renderRecuperarContrasenaInfo", () => {
    let req, res;
    beforeEach(() => {
        req = {};
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test("should render recuperar contrasena info page", () => {
        authController.renderRecuperarContrasenaInfo(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.render).toHaveBeenCalledWith("auth/recuperar_pwd_info", { layout: false }),
        ])
    });
});

describe("login", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                username: "username",
                pwd: "password",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
    });

    test("Should login correctly", async () => {
        const mockUser = {
            id_usuario: 1,
            rut_usuario: 12345678,
            dv_usuario: "k",
            nombre: "John Doe",
            id_servicio: 1,
            id_tipo_contrato: 1,
            id_unidad_sigcom: null,
            id_estamento: 1,
            id_tipo_usuario: 1,
            username: "username",
            pwd: "hashedPwd",
            borrado: false,
            email: null,
        };

        prisma.usuarios.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("token");

        await authController.login(req, res);

        multiTest([
            () => expect(res.cookie).toHaveBeenCalledTimes(1),
            () => expect(res.cookie).toHaveBeenCalledWith("token", "token", { path: "/laundry-manager", httpOnly: true }),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Has iniciado sesión, bienvenido",
                success: true,
                emailValidation: {
                    hasEmail: false,
                    id_usuario: 1
                },
            }),
        ])
    });

    test("sould return 401 if user not found", async () => {
        prisma.usuarios.findUnique.mockResolvedValue(null || undefined);
        await authController.login(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(401),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Usuario o contraseña incorrectos",
                success: false,
            }),
        ])
    });

    test("sould return 401 if password is incorrect", async () => {
        const mockUser = {
            id_usuario: 1,
            rut_usuario: 12345678,
            dv_usuario: "k",
            nombre: "John Doe",
            id_servicio: 1,
            id_tipo_contrato: 1,
            id_unidad_sigcom: null,
            id_estamento: 1,
            id_tipo_usuario: 1,
            username: "username",
            pwd: "hashedPwd",
            borrado: false,
            email: null,
        };

        prisma.usuarios.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);
        await authController.login(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(401),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Usuario o contraseña incorrectos",
                success: false,
            }),
        ])
    });

    test("sould return 500 if a database error occurs", async () => {
        prisma.usuarios.findUnique.mockRejectedValue(new Error("Database error"));
        await authController.login(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                success: false,
            }),
        ])
    });

    test("sould return 500 if a jwt error occurs", async () => {
        jwt.sign.mockRejectedValue(new Error("JWT error"));
        await authController.login(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                success: false,
            }),
        ])
    });

    test("sould return 500 if a bcrypt error occurs", async () => {
        bcrypt.compare.mockRejectedValue(new Error("Bcrypt error"));
        await authController.login(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                success: false,
            }),
        ])
    });
});

describe("setEmail", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                id_usuario: 1,  
                email: "j8t2j@example.com",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test("Should set email correctly", async () => {
        prisma.usuarios.findUnique.mockResolvedValue({ id_usuario: 1 });
        prisma.usuarios.update.mockResolvedValue({
            id_usuario: 1,
            email: "j8t2j@example.com",
        });
        await authController.setEmail(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Correo electrónico establecido",
                success: true,
            }),
        ])
    });

    test("sould return 500 if a database error occurs", async () => {
        prisma.usuarios.findUnique.mockRejectedValue(new Error("Database error"));
        await authController.setEmail(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                success: false,
            }),
        ])
    });

    test("should return 500 if update user is null", async () => {
        prisma.usuarios.findUnique.mockResolvedValue({ id_usuario: 1 });
        prisma.usuarios.update.mockResolvedValue(null);
        await authController.setEmail(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Error al actualizar el correo electrónico",
                success: false,
            }),
        ])
    });

    test("should return 401 if user not found", async () => {
        prisma.usuarios.findUnique.mockResolvedValue(null || undefined);
        await authController.setEmail(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(401),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Usuario no encontrado",
                success: false,
            }),
        ])
    });
})

describe("sendPwdEmail", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                email: "j8t2j@example.com",
                username: "username",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            redirect: jest.fn(),
        };
    });

    test("Should send email correctly", async () => {
        prisma.usuarios.findUnique.mockResolvedValue({ id_usuario: 1 });

        // Mock de bcrypt para simular el hash de un código
        const mockCodeHash = 'hashedCode';
        bcrypt.hashSync.mockReturnValue(mockCodeHash);

        enviarCorreo.mockResolvedValue(true);
        await authController.sendPwdEmail(req, res);
        multiTest([
            () => expect(prisma.usuarios.findUnique).toHaveBeenCalledWith({
                where: {
                    username: 'username',
                    email: 'j8t2j@example.com'
                }
            }),
            () => expect(res.cookie).toHaveBeenCalledWith("pwdcode", mockCodeHash, { path: "/laundry-manager", httpOnly: true }),
            () => expect(res.cookie).toHaveBeenCalledWith("username", 'username', { path: "/laundry-manager", httpOnly: true }),
            () => expect(enviarCorreo).toHaveBeenCalledWith('j8t2j@example.com', expect.any(String)),
            () => expect(res.redirect).toHaveBeenCalledWith("/auth/recuperar-pwd-info")
        ]);
    });

    test("sould return 401 if user is not found", async () => {
        prisma.usuarios.findUnique.mockResolvedValue(null || undefined);
        await authController.sendPwdEmail(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(401),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Usuario no encontrado",
                success: false,
            }),
        ])
    });

    test("sould return 500 if a database error occurs", async () => {
        prisma.usuarios.findUnique.mockRejectedValue(new Error("Database error"));
        await authController.sendPwdEmail(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                success: false,
            }),
        ])
    });
})

describe("changePwd", () => {
    let req, res, prisma;

    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                code: "1234", // Código enviado por el usuario
                pwd: "newPassword123", // Nueva contraseña
            },
            cookies: {
                pwdcode: "$2b$10$hashedCodeExample", // Código hasheado en la cookie
                username: "testUser",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn(),
        };
    });

    test("Should change password successfully", async () => {
        // Mock de funciones de bcrypt
        bcrypt.compare.mockResolvedValue(true); // Simula que el código es válido
        bcrypt.hashSync.mockReturnValue("hashedNewPassword");

        // Mock de actualización de usuario en Prisma
        prisma.usuarios.update.mockResolvedValue({ username: "testUser" });

        await authController.changePwd(req, res);

        multiTest([
            () => expect(bcrypt.compare).toHaveBeenCalledWith("1234", "$2b$10$hashedCodeExample"),
            () => expect(bcrypt.hashSync).toHaveBeenCalledWith("newPassword123", 10),
            () => expect(prisma.usuarios.update).toHaveBeenCalledWith({
                where: {
                    username: "testUser",
                },
                data: {
                    pwd: "hashedNewPassword",
                },
            }),
            () => expect(res.clearCookie).toHaveBeenCalledWith("pwdcode"),
            () => expect(res.clearCookie).toHaveBeenCalledWith("username"),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ success: true, message: "Contraseña actualizada" }),
        ]);
    });

    test("Should return error if code is invalid", async () => {
        // Mock de código inválido
        bcrypt.compare.mockResolvedValue(false);

        await authController.changePwd(req, res);

        multiTest([
            () => expect(bcrypt.compare).toHaveBeenCalledWith("1234", "$2b$10$hashedCodeExample"),
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ success: false, message: "Código inválido, intente nuevamente" }),
        ]);
    });

    test("Should return error if hashed code is not found", async () => {
        req.cookies.pwdcode = null;

        await authController.changePwd(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ success: false, message: "Código no encontrado" }),
        ]);
    });
});

describe("logout", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {};
        res = {
            clearCookie: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test("Should clear session cookies", async () => {
        await authController.logout(req, res);

        multiTest([
            () => expect(res.clearCookie).toHaveBeenCalledWith("token"),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ success: true, message: "Has cerrado sesión" }),
        ]);
    });
});