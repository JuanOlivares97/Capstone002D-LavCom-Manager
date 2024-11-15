const userController = require("../src/controllers/user.controller");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const multiTest = require("./helpers/multiTest");

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    hashSync: jest.fn(),
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

describe("getUsuarios", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test("should return all users", async () => {
        prisma.usuarios.findMany.mockResolvedValue([
            { id_usuario: 1, username: "user1" },
            { id_usuario: 2, username: "user2" },
        ]);
        await userController.getUsuarios(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith([
                { id_usuario: 1, username: "user1" },
                { id_usuario: 2, username: "user2" },
            ]),
        ]);
    });

    test("should return 500 if an error occurs", async () => {
        prisma.usuarios.findMany.mockRejectedValue(new Error("Database error"));
        await userController.getUsuarios(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" }),
        ]);
    });

    test("should return 401 if user is not found or length is 0", async () => {
        prisma.usuarios.findMany.mockResolvedValue([] || null);
        await userController.getUsuarios(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(401),
            () => expect(res.json).toHaveBeenCalledWith({ message: "No se encontraron usuarios" }),
        ]);
    })
})

describe("createUser", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            body: {
                pwd: 'password123',
                rut_usuario: '12345678-9',
                nombre: 'Test User',
                servicio: '1',
                tipo_contrato: '2',
                estamento: '3',
                tipo_usuario: '4',
                username: 'testuser',
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test('should create a new user successfully', async () => {
        // Datos de entrada simulados
        // Simular que la creación del usuario fue exitosa
        prisma.usuarios.create.mockResolvedValue({
            id_usuario: 1,
            rut_usuario: 12345678,
            dv_usuario: '9',
            nombre: 'Test User',
            id_servicio: 1,
            id_tipo_contrato: 2,
            id_estamento: 3,
            id_tipo_usuario: 4,
            username: 'testuser',
        });

        await userController.createUsuario(req, res);

        // Verificar que la respuesta tenga el status correcto
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({
                message: 'Usuario creado exitosamente',
                success: true,
                user: {
                    id_usuario: 1,
                    rut_usuario: 12345678,
                    dv_usuario: '9',
                    nombre: 'Test User',
                    id_servicio: 1,
                    id_tipo_contrato: 2,
                    id_estamento: 3,
                    id_tipo_usuario: 4,
                    username: 'testuser'
                }
            }),
        ])
    });

    test('should return 500 if an error occurs', async () => {
        prisma.usuarios.create.mockRejectedValue(new Error('Database error'));
        await userController.createUsuario(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', success: false }),
        ]);
    });
});

describe("updateUser", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            body: {
                id_usuario: 1,
                epwd: 'newpassword123',
                erut_usuario: '12345678-9',
                enombre: 'Updated User',
                eservicio: '2',
                etipo_contrato: '3',
                eestamento: '4',
                etipo_usuario: '5',
                eusername: 'updateduser',
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test('should update a user successfully', async () => {
        // Datos de entrada simulados
        // Simular que la actualización del usuario fue exitosa
        prisma.usuarios.update.mockResolvedValue({
            id_usuario: 1,
            rut_usuario: 12345678,
            dv_usuario: '9',
            nombre: 'Updated User',
            id_servicio: 2,
            id_tipo_contrato: 3,
            id_estamento: 4,
            id_tipo_usuario: 5,
            username: 'updateduser',
        });

        await userController.updateUsuario(req, res);

        // Verificar que la respuesta tenga el status correcto
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({
                message: 'Usuario actualizado exitosamente',
                success: true,
                usuario_actualizado: {
                    id_usuario: 1,
                    rut_usuario: 12345678,
                    dv_usuario: '9',
                    nombre: 'Updated User',
                    id_servicio: 2,
                    id_tipo_contrato: 3,
                    id_estamento: 4,
                    id_tipo_usuario: 5,
                    username: 'updateduser'
                }
            }),
        ])
    });

    test('should return 500 if an error occurs', async () => {
        prisma.usuarios.update.mockRejectedValue(new Error('Database error'));
        await userController.updateUsuario(req, res);
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', success: false }),
        ]);
    });
})

describe("deleteUser", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            body: {
                id_usuario: 1
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test('should delete a user successfully', async () => {
        // Datos de entrada simulados
        // Simular que la eliminación del usuario fue exitosa
        prisma.usuarios.update.mockResolvedValue({
            id_usuario: 1,
            rut_usuario: 12345678,
            dv_usuario: '9',
            nombre: 'deleted User',
            id_servicio: 2,
            id_tipo_contrato: 3,
            id_estamento: 4,
            id_tipo_usuario: 5,
            username: 'deleteduser',
        });

        await userController.deleteUsuario(req, res);

        // Verificar que la respuesta tenga el status correcto
        multiTest([
            () => expect(prisma.usuarios.update).toHaveBeenCalledWith({ where: { id_usuario: 1 }, data: { borrado: true } }),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({
                message: 'Usuario eliminado exitosamente',
                success: true
            }),
        ])
    });
})

describe("renderHome", () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: '12345678-9',
                nombreLogueado: 'Test User'
            },
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test('should render the home page with correct data', async () => {
        // Mocking Prisma data
        prisma.servicio.findMany.mockResolvedValue([{ id: 1, name: 'Servicio 1' }, { id: 2, name: 'Servicio 2' }]);
        prisma.estamento.findMany.mockResolvedValue([{ id: 1, name: 'Estamento 1' }]);
        prisma.tipo_contrato.findMany.mockResolvedValue([{ id: 1, name: 'Contrato 1' }]);
        prisma.tipo_usuario.findMany.mockResolvedValue([{ id: 1, name: 'Usuario 1' }]);

        await userController.renderHome(req, res);

        // Verifying the correct rendering
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.render).toHaveBeenCalledWith('users/home', {
                tipo_usuario: 1,
                servicios: [{ id: 1, name: 'Servicio 1' }, { id: 2, name: 'Servicio 2' }],
                estamentos: [{ id: 1, name: 'Estamento 1' }],
                tipo_contrato: [{ id: 1, name: 'Contrato 1' }],
                tipos_usuario: [{ id: 1, name: 'Usuario 1' }]
            }),
        ])
    });
})