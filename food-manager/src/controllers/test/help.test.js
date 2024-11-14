const helpController = require('../help.controller');

describe('Help Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { cookies: {} };
        res = {
            render: jest.fn(),
        };
    });

    describe('renderHome', () => {
        test('should render the home page with tipoUsuario as integer', async () => {
            req.cookies['tipo_usuario'] = '1';

            await helpController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('help/home', { tipoUsuario: 1 });
        });

        test('should render the home page with tipoUsuario as NaN if not provided', async () => {
            req.cookies['tipo_usuario'] = undefined;

            await helpController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('help/home', { tipoUsuario: NaN });
        });

        test('should render the home page with tipoUsuario parsed to integer', async () => {
            req.cookies['tipo_usuario'] = '2';

            await helpController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('help/home', { tipoUsuario: 2 });
        });
    });
});
