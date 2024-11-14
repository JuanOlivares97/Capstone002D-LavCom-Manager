const patientController = require('../patient.controller');
const prisma = require('../../server/prisma');
const moment = require('moment-timezone');
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
            prisma.Hospitalizado.findMany.mockResolvedValue([]);
            prisma.Hospitalizado.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5).mockResolvedValueOnce(3).mockResolvedValueOnce(2);
            
            await patientController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('patient/home', expect.objectContaining({
                tipoUsuario: 1,
                pacientes: expect.any(Array),
                pacientesHospitalizados: 10,
                pacientesEnAyuno: 5,
                ingresosHoy: 3,
                altasHoy: 2,
            }));
        });

        test('should handle error in renderHome', async () => {
            prisma.Hospitalizado.findMany.mockRejectedValue(new Error('Database error'));

            await patientController.renderHome(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error: Database error' });
        });
    });

    describe('getPacientes', () => {
        test('should return a list of patients', async () => {
            prisma.Hospitalizado.findMany.mockResolvedValue([{ NombreHospitalizado: 'Juan Perez' }]);

            await patientController.getPacientes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ NombreHospitalizado: 'Juan Perez' }]);
        });

        test('should handle error in getPacientes', async () => {
            prisma.Hospitalizado.findMany.mockRejectedValue(new Error('Database error'));

            await patientController.getPacientes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error Database error' });
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
            prisma.Hospitalizado.create.mockRejectedValue(new Error('Database error'));

            await patientController.createPaciente(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error al crear o reingresar el paciente: Database error' });
        });
    });

    describe('movePatientService', () => {
        test('should update patient service', async () => {
            req.params.id = '1';
            req.body.newService = '2';

            prisma.Hospitalizado.findFirst.mockResolvedValue({ IdHospitalizado: 1, IdTipoServicio: 1 });
            prisma.Hospitalizado.update.mockResolvedValue({});
            prisma.logMovimientosPaciente.create.mockResolvedValue({});

            await patientController.movePatientService(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Movimiento al Servicio', movimiento: expect.any(Object) });
        });

        test('should return error if new service is invalid', async () => {
            req.params.id = '1';
            req.body.newService = '999'; // Invalid service

            prisma.Hospitalizado.findFirst.mockResolvedValue({ IdHospitalizado: 1, IdTipoServicio: 1 });

            await patientController.movePatientService(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Servicio no válido' });
        });
    });

    describe('changeRegimen', () => {
        test('should update patient regimen', async () => {
            req.params.id = '1';
            req.body.newRegimen = '2';

            prisma.Hospitalizado.findFirst.mockResolvedValue({ IdHospitalizado: 1, IdTipoRegimen: 1 });
            prisma.Hospitalizado.update.mockResolvedValue({});
            prisma.logMovimientosPaciente.create.mockResolvedValue({});

            await patientController.changeRegimen(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Movimiento de régimen exitoso', movimiento: expect.any(Object) });
        });

        test('should return error if new regimen is invalid', async () => {
            req.params.id = '1';
            req.body.newRegimen = '999'; // Invalid regimen

            prisma.Hospitalizado.findFirst.mockResolvedValue({ IdHospitalizado: 1, IdTipoRegimen: 1 });

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
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error interno del servidor", error: 'Database error' }));
        });
    });
});
