const reportesController = require("../src/controllers/reportes.controller");
const { PrismaClient } = require("@prisma/client");
const multiTest = require("./helpers/multiTest");

jest.mock('@prisma/client', () => {
    const mockPrisma = require("./helpers/mockPrisma");
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

describe('renderHome', () => {
    let req, res;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            user: {
                tipo_usuario: '1',
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
    test('should render the home page with tipo_usuario', () => {
        reportesController.renderHome(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.render).toHaveBeenCalledWith('reports/home', { tipo_usuario: 1 }),
        ])
    });

    test('should handle errors and return 500 status', () => {
        req.user = undefined;

        reportesController.renderHome(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' }),
        ])
    });
});

describe('getFullReport', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    test('should return a formatted full report', async () => {
        const mockResult = [
            { f0: 1, f1: 'Camisa', f2: 10, f3: 5, f4: 7, f5: 3, f6: 2, f7: 1 },
        ];
        prisma.$queryRaw.mockResolvedValue(mockResult);

        await reportesController.getFullReport(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith([
                {
                    id_articulo: 1,
                    nombre_articulo: 'Camisa',
                    roperia_limpio: 10,
                    ropa_servicios: 5,
                    roperia_sucio: 7,
                    en_lavanderia: 3,
                    perdidas_totales: 2,
                    bajas_totales: 1,
                },
            ])
        ])
    });

    test('should handle errors and return 500 status', async () => {
        prisma.$queryRaw.mockRejectedValue(new Error('Database Error'));

        await reportesController.getFullReport(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' }),
        ])
    });
});

describe('getServicesReport', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should return a formatted services report', async () => {
        const mockResult = [
            { f0: 1, f1: 'Pantalón', f2: 'Unidad A', f3: 8 },
        ];
        prisma.$queryRaw.mockResolvedValue(mockResult);

        await reportesController.getServicesReport(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () =>expect(res.json).toHaveBeenCalledWith([
                {
                    id_articulo: 1,
                    nombre_articulo: 'Pantalón',
                    unidad_sigcom: 'Unidad A',
                    ropa_servicios: 8,
                },
            ])
        ])
    });

    test('should handle errors and return 500 status', async () => {
        prisma.$queryRaw.mockRejectedValue(new Error('Database Error'));

        await reportesController.getServicesReport(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' }),
        ])
    });
});

describe('getBajasyPerdidas', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should return formatted bajas y perdidas report', async () => {
        const mockData = [
            { f0: 1, f1: 'Sábanas', f2: 4, f3: 2, f4: 6, f5: 1, f6: 3, f7: 4 }
        ];
        prisma.$queryRaw.mockResolvedValue(mockData);

        await reportesController.getBajasyPerdidas(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith([
                {
                    id_articulo: 1,
                    nombre_articulo: 'Sábanas',
                    perdidas_externas: 4,
                    perdidas_internas: 2,
                    perdidas_totales: 6,
                    bajas_servicio: 1,
                    bajas_roperia: 3,
                    bajas_totales: 4,
                },
            ])
        ])
    });

    test('should handle errors and return 500 status', async () => {
        prisma.$queryRaw.mockRejectedValue(new Error('Database Error'));

        await reportesController.getBajasyPerdidas(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' }),
        ])
    });
});

describe('getServicesDownReport', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should return formatted services down report', async () => {
        const mockData = [
            { f0: '2024-11', f1: 1, f2: 'Toallas', f3: 'Unidad B', f4: 9 }
        ];
        prisma.$queryRaw.mockResolvedValue(mockData);

        await reportesController.getServicesDownReport(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith([
                {
                    mes_anio: '2024-11',
                    id_articulo: 1,
                    nombre_articulo: 'Toallas',
                    unidad_sigcom: 'Unidad B',
                    ropa_baja_servicios: 9,
                },
            ])
        ])
    });

    test('should handle errors and return 500 status', async () => {
        prisma.$queryRaw.mockRejectedValue(new Error('Database Error'));

        await reportesController.getServicesDownReport(req, res);

        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' }),
        ])
    });
});