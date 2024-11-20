const totemController = require('../totem.controller');
const prisma = require('../../server/prisma');
jest.mock('../../server/prisma');

describe('Totem Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            cookies: {},
            app: {
                get: jest.fn()
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
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
            expect(res.json).toHaveBeenCalledWith({ message: 'Error al registrar la colación en el tótem' });
        });
    });
});
