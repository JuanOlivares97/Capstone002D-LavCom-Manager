const reportController = require("../report.controller");
const prisma = require("../../server/prisma");
jest.mock("../../server/prisma");

describe("Report Controller Tests", () => {
    let req, res;

    beforeEach(() => {
        req = { cookies: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
        };
    });

    describe("renderHome", () => {
        test("should render home with reports and user type", async () => {
            const mockReports = [{ Mes: 10, Anio: 2024 }];
            prisma.Reportes.findMany.mockResolvedValue(mockReports);
            req.user = { tipo_usuario: "1" };

            await reportController.renderHome(req, res);

            expect(prisma.Reportes.findMany).toHaveBeenCalledWith({
                where: {
                    Anio: expect.any(Number),
                    Mes: expect.any(Number),
                },
                include: {
                    TipoUnidad: true,
                },
            });
            expect(res.render).toHaveBeenCalledWith("report/home", {
                reportes: mockReports,
                tipoUsuario: 1,
            });
        });         
    });

    describe("fillTable", () => {
        test("should fill the table by calling stored procedure and respond with success message", async () => {
            // Mock the $queryRaw function to resolve with some value
            prisma.$queryRaw = jest.fn().mockResolvedValue([{ IdReporte: 1 }]);

            await reportController.fillTable(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Tabla generada con éxito",
            });
        });

        test("should handle error in fillTable", async () => {
            // Mock the $queryRaw function to reject with an error
            prisma.$queryRaw = jest
                .fn()
                .mockRejectedValue(new Error("Database error"));

            await reportController.fillTable(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error al obtener los datos",
            });
        });
    });

    describe("reportHospitalizadoDiario", () => {
        test("should return daily report of hospitalized patients by unit", async () => {
            req.query.page = "1";
            req.query.pageSize = "10";

            prisma.TipoUnidad.findMany.mockResolvedValue([
                { IdTipoUnidad: 1, DescTipoUnidad: "Unit1" },
            ]);
            prisma.Hospitalizado.findMany.mockResolvedValue([
                {
                    CodigoCama: 101,
                    RutHospitalizado: "12345678",
                    DvHospitalizado: "9",
                    NombreHospitalizado: "John",
                    ApellidoP: "Doe",
                    ApellidoM: "Smith",
                    TipoRegimen: { DescTipoRegimen: "Standard" },
                },
            ]);

            await reportController.reportHospitalizadoDiario(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: {
                    Unit1: [
                        {
                            CodigoCama: 101,
                            RutPaciente: "12345678-9",
                            NombrePaciente: "John Doe Smith",
                            DescTipoRegimen: "Standard",
                        },
                    ],
                },
                currentPage: 1,
                pageSize: 10,
            });
        });

        test("should handle error in reportHospitalizadoDiario", async () => {
            prisma.TipoUnidad.findMany.mockRejectedValue(new Error("Database error"));

            await reportController.reportHospitalizadoDiario(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error al obtener los reportes",
            });
        });
    });
});
