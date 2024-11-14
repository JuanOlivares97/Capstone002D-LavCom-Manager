const employeeController = require('../employee.controller');
const prisma = require('../../server/prisma');
const bcrypt = require('bcrypt');
const { getContrato, getServicio, getUnidad, getEstamento, getTipoFuncionario } = require('../maintainer.controller');

jest.mock('../../server/prisma');
jest.mock('bcrypt');
jest.mock('../maintainer.controller');

describe('Employee Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
        };
    });

    describe('renderHome', () => {
        test('should render home with required data', async () => {
            getContrato.mockResolvedValue(['Contrato1']);
            getServicio.mockResolvedValue(['Servicio1']);
            getUnidad.mockResolvedValue(['Unidad1']);
            getEstamento.mockResolvedValue(['Estamento1']);
            getTipoFuncionario.mockResolvedValue(['TipoFuncionario1']);
            req.cookies['tipo_usuario'] = '1';

            await employeeController.renderHome(req, res);
            expect(res.render).toHaveBeenCalledWith('employee/home', {
                tipoUsuario: 1,
                contrato: ['Contrato1'],
                servicios: ['Servicio1'],
                unidades: ['Unidad1'],
                estamentos: ['Estamento1'],
                tipoFuncionario: ['TipoFuncionario1']
            });
        });

        test('should handle error', async () => {
            getContrato.mockRejectedValue(new Error('Database error'));
            await employeeController.renderHome(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });

    describe('getFuncionarios', () => {
        test('should return all enabled employees', async () => {
            prisma.Funcionario.findMany.mockResolvedValue([
                {
                    RutFuncionario: '12345678',
                    DvFuncionario: '9',
                    NombreFuncionario: 'Juan Perez',
                    correo: 'TEST@EXAMPLE.COM'
                }
            ]);

            await employeeController.getFuncionarios(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                {
                    RutFuncionario: '12345678',
                    DvFuncionario: '9',
                    NombreFuncionario: 'Juan Perez',
                    correo: 'test@example.com',
                    rut: '12345678-9',
                    NombreFuncionario: 'Juan Perez'  // formatted with capitalizeWords
                }
            ]);
        });

        test('should handle error', async () => {
            prisma.Funcionario.findMany.mockRejectedValue(new Error('Database error'));
            await employeeController.getFuncionarios(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error: Database error" });
        });
    });

    describe('createEmployee', () => {
        test('should create a new employee if does not exist', async () => {
            req.body = {
                nombre_usuario: 'Juan Perez',
                RutCompleto: '12345678-9',
                tipoEstamento: '1',
                tipoServicio: '2',
                tipoUnidad: '3',
                tipoContrato: '4',
                tipoFuncionario: '5',
                FechaInicioContrato: '2023-01-01',
                FechaTerminoContrato: '2023-12-31'
            };
            prisma.Funcionario.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            prisma.Funcionario.create.mockResolvedValue({ IdFuncionario: 1, NombreFuncionario: 'JUAN PEREZ' });

            await employeeController.createEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ IdFuncionario: 1, NombreFuncionario: 'JUAN PEREZ' });
        });

        test('should update employee if already exists', async () => {
            req.body = {
                nombre_usuario: 'Juan Perez',
                RutCompleto: '12345678-9'
            };
            const existingEmployee = { IdFuncionario: 1, Habilitado: 'N' };
            prisma.Funcionario.findUnique.mockResolvedValue(existingEmployee);
            prisma.Funcionario.update.mockResolvedValue({ IdFuncionario: 1, Habilitado: 'S' });

            await employeeController.createEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "El empleado ya existía y se actualizó su estado a 'Habilitado'.",
                empleado: { IdFuncionario: 1, Habilitado: 'S' }
            });
        });

        test('should handle invalid RUT format', async () => {
            req.body = { RutCompleto: '12345678' };
            await employeeController.createEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "El RUT debe estar en el formato correcto (12345678-9)." });
        });

        test('should handle error', async () => {
            prisma.Funcionario.create.mockRejectedValue(new Error('Database error'));
            await employeeController.createEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error: Database error" });
        });
    });

    describe('updateEmployee', () => {
        test('should update employee details', async () => {
            req.params.id = '1';
            req.body = {
                nombre_usuario: 'Juan Perez',
                rut_usuario: '12345678',
                dv_usuario: '9',
                tipoEstamento: '1',
                tipoServicio: '2',
                tipoUnidad: '3',
                tipoContrato: '4',
                tipoFuncionario: '5'
            };
            prisma.TipoFuncionario.findUnique.mockResolvedValue(true);
            prisma.Funcionario.update.mockResolvedValue({ IdFuncionario: 1, NombreFuncionario: 'Juan Perez' });

            await employeeController.updateEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ IdFuncionario: 1, NombreFuncionario: 'Juan Perez' });
        });

        test('should handle non-existing tipoFuncionario', async () => {
            req.params.id = '1';
            req.body.tipoFuncionario = '5';
            prisma.TipoFuncionario.findUnique.mockResolvedValue(null);

            await employeeController.updateEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error: El tipoFuncionario especificado no existe" });
        });

        test('should handle error', async () => {
            prisma.Funcionario.update.mockRejectedValue(new Error('Database error'));
            await employeeController.updateEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error: Database error" });
        });
    });

    describe('deleteEmployee', () => {
        test('should disable employee', async () => {
            req.params.id = '1';
            prisma.Funcionario.update.mockResolvedValue({ IdFuncionario: 1, Habilitado: 'N' });

            await employeeController.deleteEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ IdFuncionario: 1, Habilitado: 'N' });
        });

        test('should handle error', async () => {
            prisma.Funcionario.update.mockRejectedValue(new Error('Database error'));
            await employeeController.deleteEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error: Database error" });
        });
    });
});
