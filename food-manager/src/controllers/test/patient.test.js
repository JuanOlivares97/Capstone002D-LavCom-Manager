const patientController = require('../patient.controller');
const prisma = require('../../server/prisma');
const maintainerController = require('../maintainer.controller');
const multiTest = require('./helpers/multiTest');
jest.mock('../../server/prisma');

describe('Patient Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { cookies: {}, body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
        };
    });

    describe('renderHome', () => {
        test('should render home with patient data and metrics', async () => {
            // Mock de datos necesarios
            const mockPaciente = {
                IdHospitalizado: 1,
                RutHospitalizado: "12345678",
                DvHospitalizado: "9",
                NombreHospitalizado: "Juan",
                ApellidoP: "Pérez",
                ApellidoM: "González",
                FechaNacimiento: new Date('1990-01-01'),
                FechaFinAyuno: new Date(Date.now() + 86400000),
                IdTipoServicio: 1,
                IdTipoUnidad: 1,
                IdTipoVia: 1,
                IdTipoRegimen: 1
            };

            // Mock de cookies
            req.cookies["tipo_usuario"] = "1";

            // Mock de las llamadas a prisma
            prisma.Hospitalizado.findMany.mockResolvedValue([mockPaciente]);

            // Mock de los conteos
            const mockCount = jest.fn();
            mockCount
                .mockResolvedValueOnce(10) // pacientesHospitalizados
                .mockResolvedValueOnce(5)  // pacientesEnAyuno  
                .mockResolvedValueOnce(3)  // ingresosHoy
                .mockResolvedValueOnce(2); // altasHoy

            prisma.Hospitalizado.count = mockCount;

            await patientController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('patient/home', {
                tipoUsuario: 1,
                pacientes: [{
                    ...mockPaciente,
                    edad: 34,
                    enAyuno: true
                }],
                servicios: undefined,
                unidades: undefined,
                vias: undefined,
                regimen: undefined,
                pacientesHospitalizados: 10,
                pacientesEnAyuno: 5,
                ingresosHoy: 3,
                altasHoy: 2
            });
        });

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
            prisma.Hospitalizado.create.mockResolvedValue({ NombreHospitalizado: 'Juan Perez' });
            prisma.logMovimientosPaciente.create.mockResolvedValue({});

            await patientController.createPaciente(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Paciente ingresado exitosamente', paciente: { NombreHospitalizado: 'Juan Perez' } });
        });

        test('should return error if RutCompleto is missing', async () => {
            req.body = {};

            await patientController.createPaciente(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'El campo Rut es obligatorio' });
        });

        test('should handle error in createPaciente', async () => {
            req.body = { RutCompleto: '12345678-9' };
            prisma.Hospitalizado.create.mockRejectedValue(new Error('Database error'));

            await patientController.createPaciente(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error al crear o reingresar el paciente' });
        });
    });

    describe('movePatientService', () => {
        test('should return error if new service is invalid', async () => {
            prisma.Hospitalizado.findFirst.mockResolvedValue({
                IdHospitalizado: 1,
                IdTipoServicio: 1,
                TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio: { IdTipoServicio: 1 },
            });
        
            jest.spyOn(maintainerController, 'getServicio').mockResolvedValue([
                { IdTipoServicio: 2, DescTipoServicio: 'Servicio Especial' },
            ]);
        
            req.params.id = '1';
            req.body.newService = 99; // Servicio inválido
        
            await patientController.movePatientService(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Cannot read properties of undefined (reading 'some')",  message: "Error interno del servidor" });
        });
        
    });


    describe('changeRegimen', () => {
        test('should update patient regimen', async () => {
            // Mock de búsqueda inicial del paciente
            prisma.Hospitalizado.findFirst.mockResolvedValue({
                IdHospitalizado: 1,
                IdTipoRegimen: 1,
                TipoRegimen: { DescTipoRegimen: 'Normal' }
            });

            // Mock de `getRegimen` que devuelve una lista de regímenes válidos
            jest.spyOn(maintainerController, 'getRegimen').mockResolvedValue([
                { IdTipoRegimen: 1, DescTipoRegimen: 'Normal' },
                { IdTipoRegimen: 2, DescTipoRegimen: 'Especial' }
            ]);

            // Mock de actualización del paciente
            prisma.Hospitalizado.update.mockResolvedValue({
                IdHospitalizado: 1,
                IdTipoRegimen: 2,
                TipoRegimen: { DescTipoRegimen: 'Especial' }
            });

            // Simulación de datos en `req`
            req.params.id = '1';
            req.body.newRegimen = 2; // Cambiamos al nuevo régimen

            // Llamada al controlador
            await patientController.changeRegimen(req, res);

            // Verificaciones de respuesta
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Cambio de régimen exitoso',
                paciente: {
                    IdHospitalizado: 1,
                    IdTipoRegimen: 2,
                    TipoRegimen: { DescTipoRegimen: 'Especial' }
                }
            });
        });

        test('should return error if new regimen is invalid', async () => {
            prisma.Hospitalizado.findFirst.mockResolvedValue({
                IdHospitalizado: 1,
                IdTipoRegimen: 1,
                TipoRegimen: { DescTipoRegimen: 'Normal' }
            });

            // Mock de `getRegimen` para que devuelva una lista de regímenes válidos que no incluye el nuevo régimen
            jest.spyOn(maintainerController, 'getRegimen').mockResolvedValue([
                { IdTipoRegimen: 2, DescTipoRegimen: 'Especial' }
            ]);

            req.params.id = '1';
            req.body.newRegimen = 99; // Un régimen inválido

            await patientController.changeRegimen(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Régimen no válido' });
        });

    });

    describe('indicarAlta', () => {
        test('should mark patient as discharged', async () => {
            req.params.id = '1';
            req.body = {
                CodigoCamaAlta: '101',
                ObservacionesAlta: 'Patient discharged successfully'
            };

            prisma.Hospitalizado.findFirst.mockResolvedValue({ IdHospitalizado: 1 });
            prisma.Hospitalizado.update.mockResolvedValue({ IdHospitalizado: 1 });
            prisma.logMovimientosPaciente.create.mockResolvedValue({});

            await patientController.indicarAlta(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Paciente indicado como alta' }));
        });

        test('should handle error in indicarAlta', async () => {
            prisma.Hospitalizado.update.mockRejectedValue(new Error('Database error'));

            await patientController.indicarAlta(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Internal server error", error: 'Database error' }));
        });
    });
});
