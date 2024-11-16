const articulosController = require("../src/controllers/articulos.controller");
const { PrismaClient } = require("@prisma/client");
const tempo = require("@formkit/tempo");
const multiTest = require("./helpers/multiTest");

jest.mock('@prisma/client', () => {
    const mockPrisma = require("./helpers/mockPrisma");
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

jest.mock('@formkit/tempo', () => ({
    format: jest.fn(),
}));

describe('renderHome', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: 12345678,
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
                rutLogueado: 12345678,
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
                rutLogueado: 12345678,
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
                rutLogueado: 12345678,
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
                rutLogueado: 12345678,
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

describe('entregarUnidadSigcom', () => {
    let req, res, prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
        req = {
            user: {
                tipo_usuario: 1,
                rutLogueado: 12345678,
                nombreLogueado: 'John Doe'
            },
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should create a registro successfully', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate);

        const mockData = {
            rut_usuario_2: '87654321',
            id_unidad_sigcom: '1',
            articulos: [
                { id_articulo: '1', cantidad: '5' },
                { id_articulo: '2', cantidad: '3' },
            ],
        };

        req.body = mockData

        prisma.registro.create.mockResolvedValue({ id: 1 });

        await articulosController.entregarUnidadSigcom(req, res);

        multiTest([
            () => expect(tempo.format).toHaveBeenCalledWith(expect.any(Date), "YYYY-MM-DD HH:mm:ss A", "cl"),
            () => expect(prisma.registro.create).toHaveBeenCalledWith({
                data: {
                    rut_usuario_1: 12345678,
                    rut_usuario_2: 87654321,
                    id_unidad_sigcom: 1,
                    id_tipo_registro: 1,
                    detalle_registro: {
                        create: [
                            { cantidad: 5, id_articulo: 1 },
                            { cantidad: 3, id_articulo: 2 },
                        ]
                    },
                    cantidad_total: 8,
                    fecha: mockDate,
                },
            }),
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Registro creado exitosamente", success: true })
        ])
    });

    test('should handle error creating registro', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock de tempo.format

        req.body = {
            rut_usuario_2: '12345678',
            id_unidad_sigcom: '1',
            articulos: [
                { id_articulo: '1', cantidad: '5' }
            ],
        }

        prisma.registro.create.mockResolvedValue(null);

        await articulosController.entregarUnidadSigcom(req, res);

        multiTest([
            () => expect(prisma.registro.create).toHaveBeenCalled(),
            () => expect(res.status).toHaveBeenCalledWith(400),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Error creando registro", success: false }),
        ])
    });

    test('should handle internal server error', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate);

        req.body = {
                rut_usuario_2: '12345678',
                id_unidad_sigcom: '1',
                articulos: [
                    { id_articulo: '1', cantidad: '5' }
                ],
            }
        // Mock de error al ejecutar prisma.registro.create
        prisma.registro.create.mockRejectedValue(new Error('Database Error'));

        await articulosController.entregarUnidadSigcom(req, res);

        // Verificar que la respuesta maneja un error del servidor interno
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({message: "Internal server error", success: false})
        ])
    });
});

describe('darRopaDeBaja', () => {
    let req, res, prisma;

    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                tipo_dada_de_baja: '8',
                observaciones: 'Observación de prueba',
                id_unidad_sigcom: '2',
                articulos: [
                    { id_articulo: '1', cantidad: '10' },
                    { id_articulo: '2', cantidad: '5' },
                ]
            },
            user: {
                rutLogueado: 12345678,
                nombreLogueado: 'John Doe',
                tipo_usuario: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should create a registro and update stocks successfully', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Mock para la transacción de prisma
        prisma.$transaction.mockImplementation(async (callback) => {
            return await callback(prisma); // Ejecuta el callback con el mock de prisma
        });

        // Mock de la creación del registro
        prisma.registro = {
            create: jest.fn().mockResolvedValue({ id: 1 })
        };

        // Mock de la actualización del stock
        prisma.articulo.update.mockResolvedValue(true);

        await articulosController.darRopaDeBaja(req, res);

        multiTest([
            () => expect(tempo.format).toHaveBeenCalledWith(expect.any(Date), "YYYY-MM-DD HH:mm:ss A", "cl"),

            // Verificar que prisma.registro.create se llama correctamente
            () => expect(prisma.registro.create).toHaveBeenCalledWith({
                data: {
                    rut_usuario_1: 12345678,
                    id_tipo_registro: 8,
                    id_unidad_sigcom: null, // Debe ser null si tipo_dada_de_baja es "8"
                    observacion: 'Observación de prueba',
                    cantidad_total: 15, // Suma de las cantidades de los artículos
                    detalle_registro: {
                        create: [
                            { cantidad: 10, id_articulo: 1 },
                            { cantidad: 5, id_articulo: 2 },
                        ]
                    },
                    fecha: mockDate,
                }
            }),

            // Verificar que prisma.articulo.update se llama para cada artículo
            () => expect(prisma.articulo.update).toHaveBeenCalledTimes(2),
            () => expect(prisma.articulo.update).toHaveBeenCalledWith({
                where: { id_articulo: 1 },
                data: { stock: { decrement: 10 } }
            }),
            () => expect(prisma.articulo.update).toHaveBeenCalledWith({
                where: { id_articulo: 2 },
                data: { stock: { decrement: 5 } }
            }),

            // Verificar que la respuesta es exitosa
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Registro creado exitosamente", success: true })
        ])
    });

    test('should handle error creating registro', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Simular un error en la transacción
        prisma.$transaction.mockImplementation(async () => null);

        await articulosController.darRopaDeBaja(req, res);

        // Verificar que prisma.$transaction se llamó
        multiTest([
            () => expect(prisma.$transaction).toHaveBeenCalled(),
        // Verificar que la respuesta indica un error en la creación del registro
            () => expect(res.status).toHaveBeenCalledWith(400),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Error creando registro", success: false })
        ])
    });

    test('should handle internal server error', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Simular un error al ejecutar prisma
        prisma.$transaction.mockRejectedValue(new Error('Database Error'));

        await articulosController.darRopaDeBaja(req, res);

        // Verificar que prisma.$transaction se llamó
        multiTest([
            () => expect(prisma.$transaction).toHaveBeenCalled(),

            // Verificar que la respuesta maneja un error del servidor interno
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                success: false
            })
        ])
    });
});

describe('declararPerdida', () => {
    let req, res, prisma;

    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                tipo_perdida: '5',
                observaciones: 'Observación de pérdida',
                id_unidad_sigcom: '3',
                articulos: [
                    { id_articulo: '1', cantidad: '7' },
                    { id_articulo: '2', cantidad: '12' },
                ]
            },
            user: {
                rutLogueado: 12345678,
                nombreLogueado: 'John Doe',
                tipo_usuario: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should create a registro and update stocks successfully', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Mock para la transacción de prisma
        prisma.$transaction.mockImplementation(async (callback) => {
            return await callback(prisma); // Ejecuta el callback con el mock de prisma
        });

        // Mock de la creación del registro
        prisma.registro = {
            create: jest.fn().mockResolvedValue({ id: 2 })
        };

        // Mock de la actualización del stock
        prisma.articulo.update.mockResolvedValue(true);

        await articulosController.declararPerdida(req, res);

        multiTest([
            // Verificar que tempo.format se llama con los parámetros correctos
            () => expect(tempo.format).toHaveBeenCalledWith(expect.any(Date), "YYYY-MM-DD HH:mm:ss A", "cl"),

            // Verificar que prisma.registro.create se llama correctamente
            () => expect(prisma.registro.create).toHaveBeenCalledWith({
                data: {
                    rut_usuario_1: 98765432,
                    id_tipo_registro: 5,
                    id_unidad_sigcom: null, // Debe ser null si tipo_perdida es "5"
                    observacion: 'Observación de pérdida',
                    cantidad_total: 19, // Suma de las cantidades de los artículos
                    detalle_registro: {
                        create: [
                            { cantidad: 7, id_articulo: 1 },
                            { cantidad: 12, id_articulo: 2 },
                        ]
                    },
                    fecha: mockDate,
                }
            }),

            // Verificar que prisma.articulo.update se llama para cada artículo
            () =>expect(prisma.articulo.update).toHaveBeenCalledTimes(2),
            () => expect(prisma.articulo.update).toHaveBeenCalledWith({
                where: { id_articulo: 1 },
                data: { stock: { decrement: 7 } }
            }),
            () => expect(prisma.articulo.update).toHaveBeenCalledWith({
                where: { id_articulo: 2 },
                data: { stock: { decrement: 12 } }
            }),

            // Verificar que la respuesta es exitosa
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Registro creado exitosamente", success: true }),
        ])
    });

    test('should handle error creating registro', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Simular un error en la transacción
        prisma.$transaction.mockImplementation(async () => null);

        await articulosController.declararPerdida(req, res);

        multiTest([
            // Verificar que prisma.$transaction se llamó
            () => expect(prisma.$transaction).toHaveBeenCalled(),

            // Verificar que la respuesta indica un error en la creación del registro
            () => expect(res.status).toHaveBeenCalledWith(400),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Error creando registro", success: false }),
        ])
    });

    test('should handle internal server error', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Simular un error al ejecutar prisma
        prisma.$transaction.mockRejectedValue(new Error('Database Error'));

        await articulosController.declararPerdida(req, res);

        // Verificar que prisma.$transaction se llamó
        multiTest([
            () => expect(prisma.$transaction).toHaveBeenCalled(),

        // Verificar que la respuesta maneja un error del servidor interno
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                error: expect.any(Error),
                success: false
            }),
        ])
    });
});

describe('recibirSuciaUnidadSigcom', () => {
    let req, res, prisma;

    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                rut_usuario_2: '12345678',
                id_unidad_sigcom: '4',
                articulos: [
                    { id_articulo: '1', cantidad: '10' },
                    { id_articulo: '2', cantidad: '5' },
                ]
            },
            user: {
                rutLogueado: 98765432,
                nombreLogueado: 'John Doe',
                tipo_usuario: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should create a registro successfully', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Mock de la creación del registro
        prisma.registro.create.mockResolvedValue({ id: 3 });

        await articulosController.recibirSuciaUnidadSigcom(req, res);

        multiTest([
            // Verificar que tempo.format se llama con los parámetros correctos
            () => expect(tempo.format).toHaveBeenCalledWith(expect.any(Date), "YYYY-MM-DD HH:mm:ss A", "cl"),

            // Verificar que prisma.registro.create se llama correctamente
            () => expect(prisma.registro.create).toHaveBeenCalledWith({
                data: {
                    rut_usuario_1: 98765432,
                    rut_usuario_2: 12345678,
                    id_unidad_sigcom: 4,
                    id_tipo_registro: 2,
                    detalle_registro: {
                        create: [
                            { cantidad: 10, id_articulo: 1 },
                            { cantidad: 5, id_articulo: 2 },
                        ]
                    },
                    cantidad_total: 15, // Suma de las cantidades de los artículos
                    fecha: mockDate,
                }
            }),

            // Verificar que la respuesta es exitosa
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Registro creado exitosamente", success: true })
        ]);
    });

    test('should handle error creating registro', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Simular un error en la creación del registro
        prisma.registro.create.mockResolvedValue(null);

        await articulosController.recibirSuciaUnidadSigcom(req, res);

        multiTest([
            // Verificar que prisma.registro.create se llamó
            () => expect(prisma.registro.create).toHaveBeenCalled(),

            // Verificar que la respuesta indica un error en la creación del registro
            () => expect(res.status).toHaveBeenCalledWith(400),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Error creando registro", success: false })
        ]);
    });

    test('should handle internal server error', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Simular un error al ejecutar prisma
        prisma.registro.create.mockRejectedValue(new Error('Database Error'));

        await articulosController.recibirSuciaUnidadSigcom(req, res);

        multiTest([
            // Verificar que prisma.registro.create se llamó
            () => expect(prisma.registro.create).toHaveBeenCalled(),

            // Verificar que la respuesta maneja un error del servidor interno
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error ",
                success: false
            })
        ]);
    });
});

describe('remesaRopaSucia', () => {
    let req, res, prisma;

    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                articulos: [
                    { id_articulo: '1', cantidad: '10' },
                    { id_articulo: '2', cantidad: '5' },
                ]
            },
            user: {
                rutLogueado: 98765432,
                nombreLogueado: 'John Doe',
                tipo_usuario: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should create a registro successfully', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate); // Mock del formateo de la fecha

        // Mock de la creación del registro
        prisma.registro.create.mockResolvedValue({ id: 4 });

        await articulosController.remesaRopaSucia(req, res);

        multiTest([
            // Verificar que tempo.format se llama con los parámetros correctos
            () => expect(tempo.format).toHaveBeenCalledWith(expect.any(Date), "YYYY-MM-DD HH:mm:ss A", "cl"),

            // Verificar que prisma.registro.create se llama correctamente
            () => expect(prisma.registro.create).toHaveBeenCalledWith({
                data: {
                    rut_usuario_1: 98765432,
                    rut_usuario_2: null,
                    id_unidad_sigcom: null,
                    id_tipo_registro: 3,
                    detalle_registro: {
                        create: [
                            { cantidad: 10, id_articulo: 1 },
                            { cantidad: 5, id_articulo: 2 },
                        ]
                    },
                    cantidad_total: 15,
                    fecha: mockDate,
                }
            }),

            // Verificar que la respuesta es exitosa
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Registro creado exitosamente", success: true })
        ]);
    });

    test('should handle error creating registro', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate);

        prisma.registro.create.mockResolvedValue(null);

        await articulosController.remesaRopaSucia(req, res);

        multiTest([
            () => expect(prisma.registro.create).toHaveBeenCalled(),
            () => expect(res.status).toHaveBeenCalledWith(400),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Error creando registro", success: false })
        ]);
    });

    test('should handle internal server error', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate);

        prisma.registro.create.mockRejectedValue(new Error('Database Error'));

        await articulosController.remesaRopaSucia(req, res);

        multiTest([
            () => expect(prisma.registro.create).toHaveBeenCalled(),
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                success: false
            })
        ]);
    });
});

describe('recibirRopaLimpia', () => {
    let req, res, prisma;

    beforeEach(() => {
        jest.clearAllMocks();

        prisma = new PrismaClient();
        req = {
            body: {
                articulos: [
                    { id_articulo: '1', cantidad: '10' },
                    { id_articulo: '2', cantidad: '5' },
                ]
            },
            user: {
                rutLogueado: 98765432,
                nombreLogueado: 'John Doe',
                tipo_usuario: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    
    test('should create a registro successfully', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate);

        prisma.registro.create.mockResolvedValue({ id: 5 });

        await articulosController.recibirRopaLimpia(req, res);

        multiTest([
            () => expect(tempo.format).toHaveBeenCalledWith(expect.any(Date), "YYYY-MM-DD HH:mm:ss A", "cl"),

            () => expect(prisma.registro.create).toHaveBeenCalledWith({
                data: {
                    rut_usuario_1: 98765432,
                    id_tipo_registro: 4,
                    detalle_registro: {
                        create: [
                            { cantidad: 10, id_articulo: 1 },
                            { cantidad: 5, id_articulo: 2 },
                        ]
                    },
                    cantidad_total: 15,
                    fecha: mockDate,
                }
            }),

            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Registro creado exitosamente", success: true })
        ]);
    });

    test('should handle error creating registro', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate);

        prisma.registro.create.mockResolvedValue(null);

        await articulosController.recibirRopaLimpia(req, res);

        multiTest([
            () => expect(prisma.registro.create).toHaveBeenCalled(),
            () => expect(res.status).toHaveBeenCalledWith(400),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Error creando registro", success: false })
        ]);
    });

    test('should handle internal server error', async () => {
        const mockDate = '2024-11-15 10:00:00 AM';
        tempo.format.mockReturnValue(mockDate);

        prisma.registro.create.mockRejectedValue(new Error('Database Error'));

        await articulosController.recibirRopaLimpia(req, res);

        multiTest([
            () => expect(prisma.registro.create).toHaveBeenCalled(),
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
                error: expect.any(Error),
                success: false
            })
        ]);
    });
});