// Mockear Prisma para testear controlador de artículos GET
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

// Importar las funciones a testear
const { renderHome, getArticulos } = require('../../src/controllers/articulos.controller');

// Reemplazar la importación real de Prisma con el mock
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrisma)
}));

// Tests para renderizar la página de inicio
describe('renderHome', () => {
    // Variables req y res para las funciones
    let req;
    let res;

    // Configuración inicial previa a cada test
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

    // Test para renderizar la página de inicio correctamente
    test('should render home page with correct data when successful', async () => {
        // Mock data para usuarios y unidades sigcom
        const mockUsuarios = [
            { id: 1, nombre: 'Usuario 1', borrado: false },
            { id: 2, nombre: 'Usuario 2', borrado: false }
        ];
        const mockUnidadesSigcom = [
            { id: 1, nombre: 'Unidad 1' },
            { id: 2, nombre: 'Unidad 2' }
        ];

        // Configurar los mocks para devolver datos de usuarios y unidades sigcom
        mockPrisma.usuarios.findMany.mockResolvedValue(mockUsuarios);
        mockPrisma.unidad_sigcom.findMany.mockResolvedValue(mockUnidadesSigcom);

        // Llamar a la función
        await renderHome(req, res);

        // Validación de llamada a bd (usuarios)
        expect(mockPrisma.usuarios.findMany).toHaveBeenCalledWith({
            where: {
                borrado: false
            }
        });

        // Validación de llamada a bd (unidades sigcom)
        expect(mockPrisma.unidad_sigcom.findMany).toHaveBeenCalled();

        // Validar que se renderizó la página con los datos correctos
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

    // Test para manejar un error en el servidor (error de llama a bd)
    test('should return 500 status when an error occurs', async () => {
        // Mock database error
        mockPrisma.usuarios.findMany.mockRejectedValue(new Error('Database error'));

        // LLamar a la función
        await renderHome(req, res);

        // Validación de error 500
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// Tests para obtener artículos
describe('getArticulos', () => {
    // Variables req y res para las funciones
    let req;
    let res;

    // Configuración inicial previa a cada test
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

    // Test para obtener artículos correctamente
    test('should return articles with their subgroups when successful', async () => {
        // Mock data para artículos y subgrupos
        const mockArticulos = [
            { id: 1, nombre: 'Artículo 1', id_subgrupo_ropa: 1, borrado: false },
            { id: 2, nombre: 'Artículo 2', id_subgrupo_ropa: 2, borrado: false }
        ];
        const mockSubgrupos = {
            1: { id_subgrupo_ropa: 1, desc_subgrupo: 'Subgrupo 1' },
            2: { id_subgrupo_ropa: 2, desc_subgrupo: 'Subgrupo 2' }
        };

        // Configurar los mocks para devolver datos de artículos y subgrupos
        mockPrisma.articulo.findMany.mockResolvedValue(mockArticulos);
        mockPrisma.subgrupo_ropa.findUnique.mockImplementation(async ({ where }) => {
            return mockSubgrupos[where.id_subgrupo_ropa];
        });

        // Llamar a la función
        await getArticulos(req, res);

        // Verificación de llamada a bd (artículos)
        expect(mockPrisma.articulo.findMany).toHaveBeenCalledWith({
            where: {
                borrado: false
            }
        });

        // Verificación de llamada a bd (subgrupos)
        expect(mockPrisma.subgrupo_ropa.findUnique).toHaveBeenCalledTimes(2);

        // Verificación de codigo http 200
        expect(res.status).toHaveBeenCalledWith(200);

        // Verificación de respuesta json con artículos y subgrupos
        expect(res.json).toHaveBeenCalledWith([
            { ...mockArticulos[0], subgrupo: 'Subgrupo 1' },
            { ...mockArticulos[1], subgrupo: 'Subgrupo 2' }
        ]);
    });

    // Test para manejar artículos vacíos
    test('should handle empty articles list', async () => {
        // Mock artículos vacíos
        mockPrisma.articulo.findMany.mockResolvedValue([]);

        // Llamar a la función
        await getArticulos(req, res);

        // Verificación de codigo http 200
        expect(res.status).toHaveBeenCalledWith(200);

        // Verificación de respuesta json con lista vacía
        expect(res.json).toHaveBeenCalledWith([]);

        // Verificación de no llamada a bd (subgrupos)
        expect(mockPrisma.subgrupo_ropa.findUnique).not.toHaveBeenCalled();
    });

    // Test para manejar error en la base de datos
    test('should return 500 status when database error occurs', async () => {
        // Simular error en la base de datos
        const error = new Error('Database error');
        mockPrisma.articulo.findMany.mockRejectedValue(error);

        // Llamar a la función
        await getArticulos(req, res);

        // Verificacion de error 500
        expect(res.status).toHaveBeenCalledWith(500);
    });

    // Test para manejar error al obtener subgrupos
    test('should handle error when fetching subgroups', async () => {
        // Mock artículos exitoso
        mockPrisma.articulo.findMany.mockResolvedValue([
            { id: 1, nombre: 'Artículo 1', id_subgrupo_ropa: 1, borrado: false }
        ]);

        // Simular error al obtener subgrupos
        const error = new Error('Subgroup fetch error');
        mockPrisma.subgrupo_ropa.findUnique.mockRejectedValue(error);

        // Llamar a la función
        await getArticulos(req, res);

        // Verificacion de error 500
        expect(res.status).toHaveBeenCalledWith(500);
    });
});