const maintainerController = require('../maintainer.controller');
const prisma = require('../../server/prisma');

jest.mock('../../server/prisma');

describe('Maintainer Controller Tests', () => {
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
        test('should render maintainer home with required data', async () => {
            prisma.TipoEstamento.findMany.mockResolvedValue(['Estamento1']);
            prisma.TipoServicio.findMany.mockResolvedValue(['Servicio1']);
            prisma.TipoUnidad.findMany.mockResolvedValue(['Unidad1']);
            prisma.TipoVia.findMany.mockResolvedValue(['Via1']);
            prisma.TipoRegimen.findMany.mockResolvedValue(['Regimen1']);
            prisma.TipoFuncionario.findMany.mockResolvedValue(['TipoFuncionario1']);
            prisma.TipoContrato.findMany.mockResolvedValue(['Contrato1']);
            req.cookies['tipo_usuario'] = '1';

            await maintainerController.renderHome(req, res);

            expect(res.render).toHaveBeenCalledWith('maintainer/home', expect.objectContaining({
                tipoUsuario: 1,
                Estamento: ['Estamento1'],
                servicios: ['Servicio1'],
                Unidad: ['Unidad1'],
                Via: ['Via1'],
                Regimen: ['Regimen1'],
                TipoFuncionario: ['TipoFuncionario1'],
                Contrato: ['Contrato1']
            }));
        });
    });

    describe('getEstamento', () => {
        test('should return list of estamentos', async () => {
            prisma.TipoEstamento.findMany.mockResolvedValue(['Estamento1', 'Estamento2']);
            const result = await maintainerController.getEstamento();
            expect(result).toEqual(['Estamento1', 'Estamento2']);
        });

        test('should throw error if fetching estamentos fails', async () => {
            prisma.TipoEstamento.findMany.mockRejectedValue(new Error('Database error'));
            await expect(maintainerController.getEstamento()).rejects.toThrow('Error al obtener los Estamento: Database error');
        });
    });

    describe('createEstamento', () => {
        test('should create a new estamento', async () => {
            req.body.DescTipoEstamento = 'Nuevo Estamento';
            prisma.TipoEstamento.create.mockResolvedValue({ DescTipoEstamento: 'Nuevo Estamento' });

            await maintainerController.createEstamento(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ DescTipoEstamento: 'Nuevo Estamento' });
        });

        test('should handle error in createEstamento', async () => {
            prisma.TipoEstamento.create.mockRejectedValue(new Error('Database error'));
            await maintainerController.createEstamento(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el item: Database error' });
        });
    });

    describe('updateEstamento', () => {
        test('should update estamento if new value is different', async () => {
            req.params.id = '1';
            req.body.DescTipoEstamento = 'Updated Estamento';
            prisma.TipoEstamento.findUnique.mockResolvedValue({ DescTipoEstamento: 'Old Estamento' });
            prisma.TipoEstamento.update.mockResolvedValue({ DescTipoEstamento: 'Updated Estamento' });

            await maintainerController.updateEstamento(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ DescTipoEstamento: 'Updated Estamento' });
        });

        test('should return error if new value is the same as current', async () => {
            req.params.id = '1';
            req.body.DescTipoEstamento = 'Same Estamento';
            prisma.TipoEstamento.findUnique.mockResolvedValue({ DescTipoEstamento: 'Same Estamento' });

            await maintainerController.updateEstamento(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "El nuevo valor debe ser distinto al valor actual." });
        });

        test('should handle error in updateEstamento', async () => {
            prisma.TipoEstamento.update.mockRejectedValue(new Error('Database error'));

            await maintainerController.updateEstamento(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar el item: Database error' });
        });
    });

    describe('deleteRegimen', () => {
        test('should delete regimen by setting Habilitado to "N"', async () => {
            req.params.id = '1';
            prisma.TipoRegimen.update.mockResolvedValue({ Habilitado: 'N' });

            await maintainerController.deleteRegimen(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ Habilitado: 'N' });
        });

        test('should handle error in deleteRegimen', async () => {
            prisma.TipoRegimen.update.mockRejectedValue(new Error('Database error'));

            await maintainerController.deleteRegimen(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar el item: Database error' });
        });
    });
});
