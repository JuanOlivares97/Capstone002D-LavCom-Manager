const lunchController = require('../lunch.controller');
const prisma = require('../../server/prisma');
const moment = require('moment');

jest.mock('../../server/prisma');

describe('Lunch Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { cookies: {}, body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
            send: jest.fn(),
        };
    });

    describe('renderHome', () => {
        test('should render lunch home with menu if no lunch exists', async () => {
            req.cookies['rutLogueado'] = '12345678';
            req.cookies['dvLogueado'] = '9';
            req.cookies['tipo_usuario'] = '1';

            prisma.Colacion.findFirst.mockResolvedValue(null);

            await lunchController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('lunch/home', {
                tipoUsuario: 1,
                mostrarMenu: true
            });
        });

        test('should render lunch home with message if lunch already exists', async () => {
            req.cookies['rutLogueado'] = '12345678';
            req.cookies['dvLogueado'] = '9';
            req.cookies['tipo_usuario'] = '1';

            prisma.Colacion.findFirst.mockResolvedValue({});

            await lunchController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('lunch/home', {
                tipoUsuario: 1,
                Message: 'Ya has registrado una colación hoy',
                mostrarMenu: false
            });
        });

        test('should handle error in renderHome', async () => {
            prisma.Colacion.findFirst.mockRejectedValue(new Error('Database error'));

            await lunchController.renderHome(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });

    describe('registrationLunch', () => {
        test('should register a new lunch if valid menu is provided', async () => {
            req.body.menu = '1';
            req.cookies['rutLogueado'] = '12345678';
            req.cookies['dvLogueado'] = '9';

            prisma.Funcionario.findFirst.mockResolvedValue({ IdTipoUnidad: 1, Habilitado: 'S' });
            prisma.Colacion.create.mockResolvedValue({});

            await lunchController.registrationLunch(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Colacion Ingresada exitosamente' });
        });

        test('should return error if menu is invalid', async () => {
            req.body.menu = 'abc';

            await lunchController.registrationLunch(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Menu selection is invalid" });
        });

        test('should return error if funcionario is not enabled', async () => {
            req.body.menu = '1';
            req.cookies['rutLogueado'] = '12345678';
            req.cookies['dvLogueado'] = '9';

            prisma.Funcionario.findFirst.mockResolvedValue({ Habilitado: 'N' });

            await lunchController.registrationLunch(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Funcionario no habilitado" });
        });

        test('should handle error in registrationLunch', async () => {
            prisma.Funcionario.findFirst.mockRejectedValue(new Error('Database error'));

            await lunchController.registrationLunch(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al registrar la colación: Database error');
            expect(res.status).toHaveBeenCalledWith(404);

        });
    });

    describe('renderLunchList', () => {
        test('should render the list of confirmed lunches for today', async () => {
            req.cookies['tipo_usuario'] = '1';
            const today = moment().format('YYYY-MM-DD');

            prisma.Colacion.findMany.mockResolvedValue([
                { RutSolicitante: '12345678-9', FechaSolicitud: new Date(today), Estado: 1 }
            ]);

            await lunchController.renderLunchList(req, res);

            expect(res.render).toHaveBeenCalledWith('totem/LunchList', {
                lunches: [{ RutSolicitante: '12345678-9', FechaSolicitud: new Date(today), Estado: 1 }],
                tipoUsuario: 1
            });
        });

        test('should handle error in renderLunchList', async () => {
            prisma.Colacion.findMany.mockRejectedValue(new Error('Database error'));

            await lunchController.renderLunchList(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al cargar el listado de colaciones');
        });
    });

    describe('registrarColacionRetirada', () => {
        test('should update lunch status to "Retirada" if lunch exists', async () => {
            req.params.id = '1';
            prisma.Colacion.findFirst.mockResolvedValue({ IdColacion: 1 });
            prisma.Colacion.update.mockResolvedValue({ Estado: 2 });

            await lunchController.registrarColacionRetirada(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Colación retirada exitosamente' });
        });

        test('should return 404 if lunch not found', async () => {
            req.params.id = '1';
            prisma.Colacion.findFirst.mockResolvedValue(null);

            await lunchController.registrarColacionRetirada(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Colación no encontrada" });
        });

        test('should handle error in registrarColacionRetirada', async () => {
            prisma.Colacion.findFirst.mockRejectedValue(new Error('Database error'));

            await lunchController.registrarColacionRetirada(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error al retirar la colación ' });
        });
    });
});
