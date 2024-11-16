const articulosController = require("../src/controllers/articulos.controller");
const { PrismaClient } = require("@prisma/client");
const multiTest = require("./helpers/multiTest");

jest.mock('@prisma/client', () => {
    const mockPrisma = require("./helpers/mockPrisma");
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

describe('renderHome', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: '12345678-9',
                nombreLogueado: 'John Doe'
            },
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    test('should render the home page with the correct data', async () => {
        // Mocking Prisma data
        prisma.usuarios.findMany.mockResolvedValue([{ id_usuario: 1, nombre: 'User1' }]);
        prisma.unidad_sigcom.findMany.mockResolvedValue([{ id: 1, name: 'Unit 1' }]);
        
        await articulosController.renderHome(req, res);

        multiTest([
            () => expect(prisma.usuarios.findMany).toHaveBeenCalledWith({ where: { borrado: false } }),
            () => expect(prisma.unidad_sigcom.findMany).toHaveBeenCalled(),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () =>expect(res.render).toHaveBeenCalledWith("clothes/home", {
                usuarios: [{ id_usuario: 1, nombre: 'User1' }],
                unidades_sigcom: [{ id: 1, name: 'Unit 1' }],
                tipo_usuario: 1,
                rutLogueado: "12345678-9",
                nombreLogueado: "John Doe",
            })
        ])
    });

    test('should return a 500 error if there is an exception', async () => {
        prisma.usuarios.findMany.mockRejectedValue(new Error('Database error'));
        
        await articulosController.renderHome(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" })
        ])
    });
});

describe('getArticulos', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: '12345678-9',
                nombreLogueado: 'John Doe'
            },
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should return a list of articulos with subgrupo information', async () => {
        prisma.articulo.findMany.mockResolvedValue([{ id_articulo: 1, id_subgrupo_ropa: 1, nombre_articulo: 'Articulo1' }]);
        prisma.subgrupo_ropa.findUnique.mockResolvedValue({ id_subgrupo_ropa: 1, desc_subgrupo: 'Subgrupo1' });
        
        await articulosController.getArticulos(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith([
                { id_articulo: 1, id_subgrupo_ropa: 1, nombre_articulo: 'Articulo1', subgrupo: 'Subgrupo1' }
            ])
        ])
    });

    test('should return a 500 error if there is an exception', async () => {
        prisma.articulo.findMany.mockRejectedValue(new Error('Database error'));

        await articulosController.getArticulos(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" })
        ])
    });
});

describe('createArticulo', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: '12345678-9',
                nombreLogueado: 'John Doe'
            },
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should create an articulo and return it', async () => {
        req.body = { nombre: 'Articulo1', stock: '10', subgrupo: '1' };
        prisma.articulo.create.mockResolvedValue({ id_articulo: 1, nombre_articulo: 'Articulo1', stock: 10, id_subgrupo_ropa: 1 });

        await articulosController.createArticulo(req, res);

        multiTest([
            () => expect(prisma.articulo.create).toHaveBeenCalledWith({
                data: {
                    nombre_articulo: 'Articulo1',
                    stock: 10,
                    id_subgrupo_ropa: 1,
                    borrado: false,
                },
                include: {
                    subgrupo_ropa: true,
                }
            }),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Articulo creado exitosamente", success: true, articulo: { id_articulo: 1, nombre_articulo: 'Articulo1', stock: 10, id_subgrupo_ropa: 1 } })
        ])
    });

    test('should return a 500 error if there is an exception', async () => {
        req.body = { nombre: 'Articulo1', stock: '10', subgrupo: '1' };
        prisma.articulo.create.mockRejectedValue(new Error('Database error'));

        await articulosController.createArticulo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server  error", success: false });
    });
});

describe('updateArticulo', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: '12345678-9',
                nombreLogueado: 'John Doe'
            },
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should update an articulo and return it', async () => {
        req.body = { id_articulo: '1', nombre: 'ArticuloUpdated', stock: '20', subgrupo: '2' };
        prisma.articulo.update.mockResolvedValue({ id_articulo: 1, nombre_articulo: 'ArticuloUpdated', stock: 20, id_subgrupo_ropa: 2 });

        await articulosController.updateArticulo(req, res);

        multiTest([
            () => expect(prisma.articulo.update).toHaveBeenCalledWith({
                where: {
                    id_articulo: 1,
                },
                data: {
                    nombre_articulo: 'ArticuloUpdated',
                    stock: 20,
                    id_subgrupo_ropa: 2,
                    borrado: false,
                },
                include: {
                    subgrupo_ropa: true,
                }
            }),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Artículo actualizado exitosamente", success: true, articulo_actualizado: { id_articulo: 1, nombre_articulo: 'ArticuloUpdated', stock: 20, id_subgrupo_ropa: 2 } })
        ])
    });

    test('should return a 500 error if there is an exception', async () => {
        req.body = { id_articulo: '1', nombre: 'ArticuloUpdated', stock: '20', subgrupo: '2' };
        prisma.articulo.update.mockRejectedValue(new Error('Database error'));

        await articulosController.updateArticulo(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Internal server error", success: false, }),
        ])
    });
});

describe('deleteArticulo', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: '12345678-9',
                nombreLogueado: 'John Doe'
            },
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should mark an articulo as deleted', async () => {
        req.body = { id_articulo: '1' };
        prisma.articulo.update.mockResolvedValue({ id_articulo: 1, borrado: true });

        await articulosController.deleteArticulo(req, res);

        multiTest([
            () => expect(prisma.articulo.update).toHaveBeenCalledWith({
                where: { id_articulo: 1 },
                data: { borrado: true },
            }),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Articulo eliminado exitosamente", success: true })
        ])
    });

    test('should return a 500 error if there is an exception', async () => {
        req.body = { id_articulo: '1' };
        prisma.articulo.update.mockRejectedValue(new Error('Database error'));

        await articulosController.deleteArticulo(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () =>expect(res.json).toHaveBeenCalledWith({ message: "Internal server error", success: false })
        ])
    });
});