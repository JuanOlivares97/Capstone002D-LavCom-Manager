// Mockear Prisma
const mockPrisma = {
    usuarios: {
        findMany: jest.fn()
    },
    unidad_sigcom: {
        findMany: jest.fn()
    },
    articulo: {
        findMany: jest.fn(),
    },
    subgrupo_ropa: {
        findUnique: jest.fn(),
    }
};

const { renderHome, getArticulos } = require('../../src/controllers/articulos.controller');

// Reemplazar la importación real de Prisma con el mock
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrisma)
}));

describe('renderHome', () => {
    let req;
    let res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock request object
        req = {
            cookies: {
                rutLogueado: "12345678-9",
                nombreLogueado: "Juan Pérez",
                tipo_usuario: "1"
            }
        };

        // Mock response object
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should render home page with correct data when successful', async () => {
        // Mock data
        const mockUsuarios = [
            { id: 1, nombre: 'Usuario 1', borrado: false },
            { id: 2, nombre: 'Usuario 2', borrado: false }
        ];
        const mockUnidadesSigcom = [
            { id: 1, nombre: 'Unidad 1' },
            { id: 2, nombre: 'Unidad 2' }
        ];

        // Configure mocks to return data
        mockPrisma.usuarios.findMany.mockResolvedValue(mockUsuarios);
        mockPrisma.unidad_sigcom.findMany.mockResolvedValue(mockUnidadesSigcom);

        // Call the function
        await renderHome(req, res);

        // Assertions
        expect(mockPrisma.usuarios.findMany).toHaveBeenCalledWith({
            where: {
                borrado: false
            }
        });
        expect(mockPrisma.unidad_sigcom.findMany).toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith(
            "clothes/home",
            {
                usuarios: mockUsuarios,
                unidades_sigcom: mockUnidadesSigcom,
                tipo_usuario: 1,
                rutLogueado: "12345678-9",
                nombreLogueado: "Juan Pérez"
            }
        );
    });

    test('should return 500 status when an error occurs', async () => {
        // Mock database error
        mockPrisma.usuarios.findMany.mockRejectedValue(new Error('Database error'));

        // Call the function
        await renderHome(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
});

describe('getArticulos', () => {
    let req;
    let res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock request object
        req = {};

        // Mock response object
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should return articles with their subgroups when successful', async () => {
        // Mock data
        const mockArticulos = [
            { id: 1, nombre: 'Artículo 1', id_subgrupo_ropa: 1, borrado: false },
            { id: 2, nombre: 'Artículo 2', id_subgrupo_ropa: 2, borrado: false }
        ];

        const mockSubgrupos = {
            1: { id_subgrupo_ropa: 1, desc_subgrupo: 'Subgrupo 1' },
            2: { id_subgrupo_ropa: 2, desc_subgrupo: 'Subgrupo 2' }
        };

        // Configurar los mocks para devolver datos
        mockPrisma.articulo.findMany.mockResolvedValue(mockArticulos);
        mockPrisma.subgrupo_ropa.findUnique.mockImplementation(async ({ where }) => {
            return mockSubgrupos[where.id_subgrupo_ropa];
        });

        // Llamar a la función
        await getArticulos(req, res);

        // Verificaciones
        expect(mockPrisma.articulo.findMany).toHaveBeenCalledWith({
            where: {
                borrado: false
            }
        });

        // Verificar que se llamó a findUnique para cada artículo
        expect(mockPrisma.subgrupo_ropa.findUnique).toHaveBeenCalledTimes(2);

        // Verificar la respuesta final
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { ...mockArticulos[0], subgrupo: 'Subgrupo 1' },
            { ...mockArticulos[1], subgrupo: 'Subgrupo 2' }
        ]);
    });

    test('should handle empty articles list', async () => {
        // Mock artículos vacíos
        mockPrisma.articulo.findMany.mockResolvedValue([]);

        // Llamar a la función
        await getArticulos(req, res);

        // Verificaciones
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
        expect(mockPrisma.subgrupo_ropa.findUnique).not.toHaveBeenCalled();
    });

    test('should return 500 status when database error occurs', async () => {
        // Simular error en la base de datos
        const error = new Error('Database error');
        mockPrisma.articulo.findMany.mockRejectedValue(error);

        // Llamar a la función
        await getArticulos(req, res);

        // Verificaciones
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error", error
        });
    });

    test('should handle error when fetching subgroups', async () => {
        // Mock artículos exitoso pero error en subgrupos
        mockPrisma.articulo.findMany.mockResolvedValue([
            { id: 1, nombre: 'Artículo 1', id_subgrupo_ropa: 1, borrado: false }
        ]);

        const error = new Error('Subgroup fetch error');
        mockPrisma.subgrupo_ropa.findUnique.mockRejectedValue(error);

        // Llamar a la función
        await getArticulos(req, res);

        // Verificaciones
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error", error
        });
    });
});