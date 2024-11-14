const dashboardController = require('../dashboard.controller');
const prisma = require('../../server/prisma'); // Asegúrate de que esta ruta sea correcta
const moment = require('moment');

jest.mock('../../server/prisma');

describe('Dashboard Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
        };
    });

    describe('renderDashboard', () => {
        test('should render the dashboard with all metrics', async () => {
            // Mocks de los métodos de Prisma para simular valores de retorno
            prisma.Funcionario.count.mockResolvedValueOnce(10);
            prisma.Colacion.count.mockResolvedValueOnce(5).mockResolvedValueOnce(3).mockResolvedValueOnce(2);
            prisma.Hospitalizado.count.mockResolvedValueOnce(15)
                .mockResolvedValueOnce(8)
                .mockResolvedValueOnce(4)
                .mockResolvedValueOnce(2);

            const days = Array.from({ length: 7 }, (_, i) => moment().subtract(i, 'days').format('YYYY-MM-DD'));

            prisma.Colacion.count.mockResolvedValue(1); // Para cada día en tendenciasColaciones
            prisma.Hospitalizado.count.mockResolvedValue(2); // Para cada día en tendenciasColaciones

            prisma.Hospitalizado.groupBy.mockResolvedValue([
                { IdTipoRegimen: 1, _count: { IdTipoRegimen: 4 } },
                { IdTipoRegimen: 2, _count: { IdTipoRegimen: 6 } },
            ]);

            req.cookies = { tipo_usuario: '1', tipo_usuarioStr: 'Admin', NombreUsuario: 'Juan' };

            await dashboardController.renderDashboard(req, res);

            expect(res.render).toHaveBeenCalledWith('dashboard/home', expect.objectContaining({
                tipoUsuario: 1,
                funcionariosHabilitados: 10,
                funcionariosSolicitados: 5,
                funcionariosConfirmados: 3,
                funcionariosAlmorzaron: 2,
                pacientesHospitalizados: 15,
                pacientesEnAyuno: 8,
                ingresosHoy: 4,
                altasHoy: 2,
                days,
                tendenciasColaciones: expect.any(Array),
                ingresosAltasSemana: expect.any(Array),
                distribucionRegimen: [
                    { IdTipoRegimen: 1, count: 4 },
                    { IdTipoRegimen: 2, count: 6 },
                ],
                tipoUsuariostr: 'Admin',
                nombreUsuario: 'Juan'
            }));
        });

        test('should handle error', async () => {
            prisma.Funcionario.count.mockRejectedValue(new Error('Database error'));

            await dashboardController.renderDashboard(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });
});
