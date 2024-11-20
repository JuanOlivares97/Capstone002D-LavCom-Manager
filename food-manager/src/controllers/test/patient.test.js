const patientController = require('../patient.controller');
const prisma = require('../../server/prisma');
const maintainerController = require('../maintainer.controller');
const multiTest = require('./helpers/multiTest');
jest.mock('../../server/prisma', () => ({
    Hospitalizado: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn()  // Agregar el método create
    },
    TipoServicio: {
        findMany: jest.fn()
    },
    TipoUnidad: {
        findMany: jest.fn()
    },
    TipoVia: {
        findMany: jest.fn()
    },
    TipoRegimen: {
        findMany: jest.fn()
    },
    logMovimientosPaciente: {
        create: jest.fn()
    }
}));
jest.mock('../maintainer.controller', () => ({
    getRegimen: jest.fn(),
    getServicio: jest.fn()
}));

describe('Patient Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        // Configurar req y res antes de cada test
        req = {
            cookies: {},
            body: {},
            params: {},
            user: { tipo_usuario: "1" }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('renderHome', () => {
        test('should handle error in renderHome', async () => {
            // Mock de las llamadas a prisma que fallarán
            prisma.Hospitalizado.findMany.mockRejectedValue(new Error('Database error'));
            prisma.TipoServicio.findMany.mockRejectedValue(new Error('Database error'));
            prisma.TipoUnidad.findMany.mockRejectedValue(new Error('Database error'));
            prisma.TipoVia.findMany.mockRejectedValue(new Error('Database error'));
            prisma.TipoRegimen.findMany.mockRejectedValue(new Error('Database error'));

            // Mock de cookies
            req.cookies["tipo_usuario"] = "1";

            await patientController.renderHome(req, res);

            // Verificar que se maneja el error correctamente
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('getPacientes', () => {
        test('should return a list of patients', async () => {
            // Simula una lista de pacientes con las relaciones necesarias
            prisma.Hospitalizado.findMany.mockResolvedValue([
                {
                    IdHospitalizado: 1,
                    RutHospitalizado: "12345678",
                    DvHospitalizado: "9",
                    NombreHospitalizado: "Juan",
                    ApellidoP: "Perez",
                    ApellidoM: "Gonzalez",
                    FechaNacimiento: new Date("1990-01-01"),
                    TipoRegimen: { DescTipoRegimen: "Normal" },
                    TipoUnidad: { DescTipoUnidad: "Unidad A" },
                    TipoVia: { DescTipoVia: "Oral" },
                    logMovimientosPaciente: []
                },
                {
                    IdHospitalizado: 2,
                    RutHospitalizado: "87654321",
                    DvHospitalizado: "K",
                    NombreHospitalizado: "Maria",
                    ApellidoP: "Lopez",
                    ApellidoM: "Martinez",
                    FechaNacimiento: new Date("1985-05-15"),
                    TipoRegimen: { DescTipoRegimen: "Especial" },
                    TipoUnidad: { DescTipoUnidad: "Unidad B" },
                    TipoVia: { DescTipoVia: "Parenteral" },
                    logMovimientosPaciente: []
                }
            ]);

            await patientController.getPacientes(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                {
                    IdHospitalizado: 1,
                    RutHospitalizado: "12345678",
                    DvHospitalizado: "9",
                    NombreHospitalizado: "Juan",
                    ApellidoP: "Perez",
                    ApellidoM: "Gonzalez",
                    FechaNacimiento: new Date("1990-01-01"),
                    TipoRegimen: { DescTipoRegimen: "Normal" },
                    TipoUnidad: { DescTipoUnidad: "Unidad A" },
                    TipoVia: { DescTipoVia: "Oral" },
                    logMovimientosPaciente: []
                },
                {
                    IdHospitalizado: 2,
                    RutHospitalizado: "87654321",
                    DvHospitalizado: "K",
                    NombreHospitalizado: "Maria",
                    ApellidoP: "Lopez",
                    ApellidoM: "Martinez",
                    FechaNacimiento: new Date("1985-05-15"),
                    TipoRegimen: { DescTipoRegimen: "Especial" },
                    TipoUnidad: { DescTipoUnidad: "Unidad B" },
                    TipoVia: { DescTipoVia: "Parenteral" },
                    logMovimientosPaciente: []
                }
            ]);
        });



        test('should handle error in getPacientes', async () => {
            prisma.Hospitalizado.findMany.mockRejectedValue(new Error('Database error'));

            await patientController.getPacientes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('createPaciente', () => {
        test('should create a new patient', async () => {
            req.body = {
                RutCompleto: '12345678-9',
                NombreHospitalizado: 'Juan Perez',
                FechaNacimiento: '1990-01-01'
            };
    
            prisma.Hospitalizado.findFirst.mockResolvedValue(null);
            prisma.Hospitalizado.create.mockResolvedValue({ 
                NombreHospitalizado: 'Juan Perez' 
            });
            prisma.logMovimientosPaciente.create.mockResolvedValue({});
    
            await patientController.createPaciente(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'Paciente ingresado exitosamente', 
                paciente: { NombreHospitalizado: 'Juan Perez' } 
            });
        });

        test('should return error if RutCompleto is missing', async () => {
            req.body = {};

            await patientController.createPaciente(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'El campo Rut es obligatorio' });
        });

        test('should handle error in createPaciente', async () => {
            // Configurar el request
            req.body = { RutCompleto: '12345678-9' };
            
            // Mock del error en findFirst
            prisma.Hospitalizado.findFirst.mockResolvedValue(null);
            
            // Mock del error en create
            prisma.Hospitalizado.create.mockRejectedValue(new Error('Database error'));
    
            // Ejecutar el controlador
            await patientController.createPaciente(req, res);
    
            // Verificar que se maneja el error correctamente
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'Error al crear o reingresar el paciente' 
            });
        });
    });

    describe('movePatientService', () => {
        test('should return error if new service is invalid', async () => {
            // Mock del paciente
            prisma.Hospitalizado.findFirst.mockResolvedValue({
                IdHospitalizado: 1,
                IdTipoServicio: 1,
                TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio: { 
                    IdTipoServicio: 1 
                }
            });
    
            // Mock de los servicios disponibles
            maintainerController.getServicio.mockResolvedValue([
                { IdTipoServicio: 2, DescTipoServicio: 'Servicio Especial' }
            ]);
    
            // Configurar request
            req.params.id = '1';
            req.body = {
                newService: 99, // Servicio inválido
                observaciones: 'Cambio de servicio'
            };
    
            // Ejecutar controlador
            await patientController.movePatientService(req, res);
    
            // Actualizar las verificaciones para coincidir con la implementación real
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Servicio no válido'
            });
        });
    
        // Opcional: Agregar test para el caso exitoso
        test('should successfully move patient to new service', async () => {
            // Mock del paciente
            prisma.Hospitalizado.findFirst.mockResolvedValue({
                IdHospitalizado: 1,
                IdTipoServicio: 1,
                TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio: { 
                    IdTipoServicio: 1 
                }
            });
    
            // Mock de los servicios disponibles
            maintainerController.getServicio.mockResolvedValue([
                { IdTipoServicio: 1, DescTipoServicio: 'Servicio Actual' },
                { IdTipoServicio: 2, DescTipoServicio: 'Servicio Especial' }
            ]);
    
            // Mock de la actualización
            const mockPacienteActualizado = {
                IdHospitalizado: 1,
                IdTipoServicio: 2
            };
            prisma.Hospitalizado.update.mockResolvedValue(mockPacienteActualizado);
    
            // Configurar request
            req.params.id = '1';
            req.body = {
                newService: 2,
                observaciones: 'Cambio de servicio'
            };
    
            // Ejecutar controlador
            await patientController.movePatientService(req, res);
    
            // Verificar respuesta exitosa
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Movimiento al Servicio exitoso',
                paciente: mockPacienteActualizado
            });
        });
    });

    describe('changeRegimen', () => {
        test('should update patient regimen', async () => {
            // Mock data
            const mockPaciente = {
                IdHospitalizado: 1,
                IdTipoRegimen: 1,
                TipoRegimen: { DescTipoRegimen: 'Normal' },
                Estado: 1,
                FechaFinAyuno: null
            };
    
            const mockRegimens = [
                { IdTipoRegimen: 1, DescTipoRegimen: 'Normal' },
                { IdTipoRegimen: 2, DescTipoRegimen: 'Especial' }
            ];
    
            const mockPacienteActualizado = {
                ...mockPaciente,
                IdTipoRegimen: 2,
                TipoRegimen: { DescTipoRegimen: 'Especial' }
            };
    
            // Configure mocks
            prisma.Hospitalizado.findFirst.mockResolvedValue(mockPaciente);
            maintainerController.getRegimen.mockResolvedValue(mockRegimens);
            prisma.Hospitalizado.update.mockResolvedValue(mockPacienteActualizado);
            prisma.logMovimientosPaciente.create.mockResolvedValue({});
    
            // Configure request
            req.params.id = '1';
            req.body = {
                newRegimen: 2,
                observaciones: 'Cambio de régimen'
            };
    
            // Execute controller
            await patientController.changeRegimen(req, res);
    
            // Verify calls
            expect(prisma.Hospitalizado.findFirst).toHaveBeenCalledWith({
                where: { IdHospitalizado: 1 },
                include: { TipoRegimen: true }
            });
    
            expect(maintainerController.getRegimen).toHaveBeenCalled();
    
            // Actualizar esta expectativa para que coincida con la implementación real
            expect(prisma.Hospitalizado.update).toHaveBeenCalledWith({
                where: { IdHospitalizado: 1 },
                data: { IdTipoRegimen: 2 }
            });
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Cambio de régimen exitoso',
                paciente: mockPacienteActualizado
            });
        });
    });

    describe('indicarAlta', () => {
        test('should mark patient as discharged', async () => {
            // Mock fecha fija para pruebas
            const mockDate = new Date('2024-11-20T19:08:38.194Z');
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
            const mockPaciente = {
                IdHospitalizado: 1,
                Estado: 1
            };
    
            const mockPacienteActualizado = {
                ...mockPaciente,
                Estado: 0,
                FechaAlta: mockDate,
                CodigoCamaAlta: 101,
                ObservacionesAlta: 'Alta médica',
                ServicioAlta: null
            };
    
            // Configure mocks
            prisma.Hospitalizado.findFirst.mockResolvedValue(mockPaciente);
            prisma.Hospitalizado.update.mockResolvedValue(mockPacienteActualizado);
            prisma.logMovimientosPaciente.create.mockResolvedValue({});
    
            // Configure request
            req.params.id = '1';
            req.body = {
                CodigoCamaAlta: 101,
                ObservacionesAlta: 'Alta médica'
            };
    
            // Execute controller
            await patientController.indicarAlta(req, res);
    
            // Verify
            expect(prisma.Hospitalizado.update).toHaveBeenCalledWith({
                where: { IdHospitalizado: 1 },
                data: {
                    CodigoCamaAlta: 101,
                    FechaAlta: mockDate,
                    ObservacionesAlta: 'Alta médica',
                    ServicioAlta: null
                }
            });
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Paciente indicado como alta',
                paciente: mockPacienteActualizado
            });
    
            // Restaurar Date original
            jest.spyOn(global, 'Date').mockRestore();
        });
    });
});
