const totemController = require('../totem.controller');
const prisma = require('../../server/prisma');
jest.mock('../../server/prisma');

describe('Totem Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, app: { get: jest.fn() } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
            send: jest.fn(),
        };
    });

    describe('renderTotem', () => {
        test('should render totem home with default values', () => {
            totemController.renderTotem(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/home', {
                errorMessage: null,
                mostrarMenu: false,
                rutSolicitante: null,
                layout: false
            });
        });
    });

    describe('checkInLunch', () => {
        test('should check in lunch and render ticket if lunch is registered', async () => {
            req.body.rutSolicitante = '12345678-9';
            prisma.Funcionario.findUnique.mockResolvedValue({ Habilitado: 'S' });
            prisma.Colacion.findFirst.mockResolvedValue({ IdColacion: 1 });
            prisma.Colacion.update.mockResolvedValue({ IdColacion: 1, Estado: 1 });
            req.app.get.mockReturnValue({ emit: jest.fn() });

            await totemController.checkInLunch(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/ticket', { colacion: { IdColacion: 1, Estado: 1 }, layout: false });
        });

        test('should display error if rut format is invalid', async () => {
            req.body.rutSolicitante = 'invalid_rut';

            await totemController.checkInLunch(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/home', { errorMessage: 'El rut solicitante no es válido', mostrarMenu: false, layout: false });
        });

        test('should display error if employee is not enabled', async () => {
            req.body.rutSolicitante = '12345678-9';
            prisma.Funcionario.findUnique.mockResolvedValue({ Habilitado: 'N' });

            await totemController.checkInLunch(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/home', {
                errorMessage: 'Empleado no habilitado',
                mostrarMenu: false,
                rutSolicitante: null,
                layout: false
            });
        });

        test('should render menu if no lunch registered for today', async () => {
            req.body.rutSolicitante = '12345678-9';
            prisma.Funcionario.findUnique.mockResolvedValue({ Habilitado: 'S' });
            prisma.Colacion.findFirst.mockResolvedValue(null);

            await totemController.checkInLunch(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/home', { rutSolicitante: '12345678-9', mostrarMenu: true, layout: false });
        });
    });

    describe('registerLunchAtTotem', () => {
        test('should register lunch and render ticket if no lunch registered for today', async () => {
            req.body.rutSolicitante = '12345678-9';
            req.body.menu = '1';
            prisma.Colacion.findFirst.mockResolvedValue(null);
            prisma.Funcionario.findFirst.mockResolvedValue({ IdTipoUnidad: 1 });
            prisma.Colacion.create.mockResolvedValue({ IdColacion: 1, Estado: 1 });
            req.app.get.mockReturnValue({ emit: jest.fn() });

            await totemController.registerLunchAtTotem(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/ticket', { colacion: { IdColacion: 1, Estado: 1 }, layout: false });
        });

        test('should display error if lunch already registered for today', async () => {
            req.body.rutSolicitante = '12345678-9';
            prisma.Colacion.findFirst.mockResolvedValue({ IdColacion: 1 });

            await totemController.registerLunchAtTotem(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/home', { errorMessage: 'Ya has registrado una colación hoy', mostrarMenu: false, layout: false });
        });

        test('should handle error in registerLunchAtTotem', async () => {
            prisma.Colacion.findFirst.mockRejectedValue(new Error('Database error'));

            await totemController.registerLunchAtTotem(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al registrar la colación en el tótem Database error');
        });
    });
});
