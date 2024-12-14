const dashboardController = require('../dashboard.controller');
const prisma = require('../../server/prisma'); // Asegúrate de que esta ruta sea correcta
const moment = require('moment');
const multiTest = require('./helpers/multiTest');

jest.mock('../../server/prisma', () => ({
    Funcionario: {
        count: jest.fn(),
    },
    Colacion: {
        count: jest.fn(),
    },
    Hospitalizado: {
        count: jest.fn(),
        groupBy: jest.fn(),
    },
}));

describe('Dashboard Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {
                tipo_usuario: '1',
                tipo_usuarioStr: 'Admin',
                NombreUsuario: 'Juan'
            },
            user: {
                tipo_usuario: 1
            }
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(), // Agregar status
            json: jest.fn()                     // Agregar json
        };
        jest.clearAllMocks();
    });

    test('should render the dashboard with all metrics', async () => {
        // Mock fecha fija
        const mockDate = new Date('2024-10-09');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        // Mock de datos
        prisma.Funcionario.count.mockResolvedValue(10);
        
        // Modificar la generación de días para que coincida con el controlador
        const days = [];
        const currentDate = moment(mockDate);
        for (let i = 0; i < 7; i++) {
            days.push(currentDate.clone().subtract(i, 'days').format('YYYY-MM-DD'));
        }

        const mockTendencias = days.map(day => ({
            day,
            confirmados: 5,
            ayuno: 8
        }));

        const mockIngresos = days.map(day => ({
            day,
            ingresos: 4,
            altas: 2
        }));

        prisma.Colacion.count.mockImplementation((query) => {
            if (query?.where?.Estado === 1) return Promise.resolve(3);
            if (query?.where?.Estado === 2) return Promise.resolve(2);
            return Promise.resolve(5);
        });

        prisma.Hospitalizado.count.mockImplementation((query) => {
            if (query?.where?.Estado === 1) return Promise.resolve(0);
            if (query?.where?.FechaFinAyuno) return Promise.resolve(8);
            if (query?.where?.FechaIngreso) return Promise.resolve(4);
            if (query?.where?.FechaAlta) return Promise.resolve(2);
            return Promise.resolve(0);
        });

        prisma.Hospitalizado.groupBy.mockResolvedValue([
            { IdTipoRegimen: 1, count: 4 },
            { IdTipoRegimen: 2, count: 6 }
        ]);

        // Ejecutar controlador
        await dashboardController.renderDashboard(req, res);

        // Verificar la llamada a render con expect.objectContaining
        multiTest([
            () => expect(res.render).toHaveBeenCalledWith(
                'dashboard/home',
                expect.objectContaining({
                    tipoUsuario: 1,
                    funcionariosHabilitados: 10,
                    funcionariosSolicitados: 5,
                    funcionariosConfirmados: 3,
                    funcionariosAlmorzaron: 2,
                    pacientesHospitalizados: 0,
                    pacientesEnAyuno: 8,
                    ingresosHoy: 4,
                    altasHoy: 2,
                    distribucionRegimen: [
                        { IdTipoRegimen: 1, count: 4 },
                        { IdTipoRegimen: 2, count: 6 }
                    ]
                })
            ),
            () => expect(prisma.Funcionario.count).toHaveBeenCalled(),
            () => expect(prisma.Colacion.count).toHaveBeenCalled(),
            () => expect(prisma.Hospitalizado.count).toHaveBeenCalled(),
            () => expect(prisma.Hospitalizado.groupBy).toHaveBeenCalled()
        ]);

        jest.spyOn(global, 'Date').mockRestore();
    });
});