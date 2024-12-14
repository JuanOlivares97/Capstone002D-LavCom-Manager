const employeeController = require("../employee.controller");
const prisma = require("../../server/prisma");
const bcrypt = require("bcrypt");
const {
    getContrato,
    getServicio,
    getUnidad,
    getEstamento,
    getTipoFuncionario,
} = require("../maintainer.controller");
const multiTest = require('./helpers/multiTest');

jest.mock("../../server/prisma");
jest.mock("bcrypt");
jest.mock("../maintainer.controller");

describe("Employee Controller Tests", () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
        };
    });

    describe("renderHome", () => {
        test("should render home with required data", async () => {
            getContrato.mockResolvedValue(["Contrato1"]);
            getServicio.mockResolvedValue(["Servicio1"]);
            getUnidad.mockResolvedValue(["Unidad1"]);
            getEstamento.mockResolvedValue(["Estamento1"]);
            getTipoFuncionario.mockResolvedValue(["TipoFuncionario1"]);
            req.user = { tipo_usuario: "1" };

            await employeeController.renderHome(req, res);
            expect(res.render).toHaveBeenCalledWith("employee/home", {
                tipoUsuario: 1,
                contrato: ["Contrato1"],
                servicios: ["Servicio1"],
                unidades: ["Unidad1"],
                estamentos: ["Estamento1"],
                tipoFuncionario: ["TipoFuncionario1"],
            });
        });

        test("should handle error", async () => {
            getContrato.mockRejectedValue(new Error("Database error"));
            await employeeController.renderHome(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });
    });

    describe("getFuncionarios", () => {
        test("should return all enabled employees", async () => {
            prisma.Funcionario.findMany.mockResolvedValue([
                {
                    RutFuncionario: "12345678",
                    DvFuncionario: "9",
                    NombreFuncionario: "Juan Perez",
                    correo: "TEST@EXAMPLE.COM",
                    TipoContrato: null,
                    TipoEstamento: null,
                    TipoServicio: null,
                    TipoUnidad: null,
                },
            ]);

            await employeeController.getFuncionarios(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                {
                    RutFuncionario: "12345678",
                    DvFuncionario: "9",
                    NombreFuncionario: "Juan Perez",
                    Apellidos: "Undefined Undefined", // Si no existe lógica para procesar esto
                    correo: "test@example.com", // Formateado en minúsculas
                    rut: "12345678-9",
                    TipoContrato: null,
                    TipoEstamento: null,
                    TipoServicio: null,
                    TipoUnidad: null,
                },
            ]);
        });

        test("should handle error", async () => {
            prisma.Funcionario.findMany.mockRejectedValue(
                new Error("Database error")
            );
            await employeeController.getFuncionarios(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error: Database error",
            });
        });
    });

    describe("createEmployee", () => {
        test("should create a new employee if does not exist", async () => {
            req.body = {
                nombre_usuario: "Juan Perez",
                apellido_paterno: "Perez", 
                apellido_materno: "Gomez",
                RutCompleto: "12345678-9",
                tipoEstamento: "1",
                tipoServicio: "2",
                tipoUnidad: "3",
                tipoContrato: "4",
                tipoFuncionario: "5"
            };

            // Mock que el funcionario no existe
            prisma.Funcionario.findUnique.mockResolvedValue(null);

            // Mock del hash de la contraseña
            bcrypt.hash.mockResolvedValue("hashed_password");

            // Mock de la creación del funcionario
            prisma.Funcionario.create.mockResolvedValue({
                IdFuncionario: 1,
                NombreFuncionario: "JUAN PEREZ",
                apellido_paterno: "PEREZ",
                apellido_materno: "GOMEZ", 
                RutFuncionario: "12345678",
                DvFuncionario: "9",
                username: "jperez",
                contrasena: "hashed_password",
                Habilitado: "S",
                TipoEstamento: {
                    IdTipoEstamento: 1
                },
                TipoServicio: {
                    IdTipoServicio: 2
                },
                TipoUnidad: {
                    IdTipoUnidad: 3
                },
                TipoContrato: {
                    IdTipoContrato: 4
                },
                TipoFuncionario: {
                    IdTipoFuncionario: 5
                }
            });

            await employeeController.createEmployee(req, res);

            expect(prisma.Funcionario.findUnique).toHaveBeenCalledWith({
                where: {
                    RutFuncionario_DvFuncionario: {
                        RutFuncionario: "12345678",
                        DvFuncionario: "9"
                    }
                }
            });

            expect(bcrypt.hash).toHaveBeenCalledWith("123456789", 10);

            expect(prisma.Funcionario.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    NombreFuncionario: "JUAN PEREZ",
                    apellido_paterno: "PEREZ",
                    apellido_materno: "GOMEZ",
                    RutFuncionario: "12345678",
                    DvFuncionario: "9",
                    username: "jperez",
                    contrasena: "hashed_password",
                    Habilitado: "S",
                    TipoEstamento: {
                        connect: { IdTipoEstamento: 1 }
                    },
                    TipoServicio: {
                        connect: { IdTipoServicio: 2 }
                    },
                    TipoUnidad: {
                        connect: { IdTipoUnidad: 3 }
                    },
                    TipoContrato: {
                        connect: { IdTipoContrato: 4 }
                    },
                    TipoFuncionario: {
                        connect: { IdTipoFuncionario: 5 }
                    }
                })
            });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                IdFuncionario: 1,
                NombreFuncionario: "JUAN PEREZ",
                Habilitado: "S"
            }));
        });

        test("should update employee if already exists", async () => {
            req.body = {
                nombre_usuario: "Juan Perez",
                apellido_paterno: "Perez",
                apellido_materno: "Gomez",
                RutCompleto: "12345678-9",
                tipoEstamento: "1",
                tipoServicio: "2", 
                tipoUnidad: "3",
                tipoContrato: "4",
                tipoFuncionario: "5"
            };

            const existingEmployee = { 
                IdFuncionario: 1, 
                Habilitado: "N",
                NombreFuncionario: "JUAN PEREZ",
                apellido_paterno: "PEREZ",
                apellido_materno: "GOMEZ"
            };

            prisma.Funcionario.findUnique.mockResolvedValue(existingEmployee);
            
            prisma.Funcionario.update.mockResolvedValue({
                IdFuncionario: 1,
                Habilitado: "S",
                NombreFuncionario: "JUAN PEREZ",
                apellido_paterno: "PEREZ", 
                apellido_materno: "GOMEZ"
            });

            await employeeController.createEmployee(req, res);

            expect(prisma.Funcionario.findUnique).toHaveBeenCalledWith({
                where: {
                    RutFuncionario_DvFuncionario: {
                        RutFuncionario: "12345678",
                        DvFuncionario: "9"
                    }
                }
            });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "El empleado ya existía y se actualizó su estado a 'Habilitado'",
                empleado: {
                    IdFuncionario: 1,
                    Habilitado: "S",
                    NombreFuncionario: "JUAN PEREZ",
                    apellido_paterno: "PEREZ",
                    apellido_materno: "GOMEZ"
                }
            });
        });

        test("should handle invalid RUT format", async () => {
            // Limpiar todos los mocks antes de la prueba
            jest.clearAllMocks();

            // Preparar los datos de prueba
            req.body = {
                nombre_usuario: "Juan",
                apellido_paterno: "Perez",
                apellido_materno: "Gomez", 
                RutCompleto: "123456789", // RUT sin guión
                tipoEstamento: "1",
                tipoServicio: "2",
                tipoUnidad: "3",
                tipoContrato: "4",
                tipoFuncionario: "5"
            };

            // Ejecutar la función
            await employeeController.createEmployee(req, res);

            // Verificar el resultado
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "El RUT debe estar en el formato correcto (12345678-9)."
            });
        });

        test("should handle error", async () => {
            req.body = {
                nombre_usuario: "Juan",
                apellido_paterno: "Perez",
                apellido_materno: "Gomez",
                RutCompleto: "12345678-9",
                tipoEstamento: "1",
                tipoServicio: "2", 
                tipoUnidad: "3",
                tipoContrato: "4",
                tipoFuncionario: "5"
            };

            prisma.Funcionario.findUnique.mockResolvedValue(null);
            prisma.Funcionario.create.mockRejectedValue(new Error("Database error"));
            bcrypt.hash.mockResolvedValue("hashedPassword");

            await employeeController.createEmployee(req, res);

            multiTest([
                () => expect(res.status).toHaveBeenCalledWith(500),
                () => expect(res.json).toHaveBeenCalledWith({
                    message: "Internal server error: Database error"
                }),
                () => expect(prisma.Funcionario.create).toHaveBeenCalled()
            ]);
        });
    });

    describe("updateEmployee", () => {
        test("should update employee details", async () => {
            req.params.id = "1";
            req.body = {
                nombre_usuario: "Juan Perez",
                rut_usuario: "12345678",
                dv_usuario: "9",
                tipoEstamento: "1",
                tipoServicio: "2",
                tipoUnidad: "3",
                tipoContrato: "4",
                tipoFuncionario: "5",
            };
            prisma.TipoFuncionario.findUnique.mockResolvedValue(true);
            prisma.Funcionario.update.mockResolvedValue({
                IdFuncionario: 1,
                NombreFuncionario: "Juan Perez",
            });

            await employeeController.updateEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                IdFuncionario: 1,
                NombreFuncionario: "Juan Perez",
            });
        });

        test("should handle database error", async () => {
            req.params.id = 1;
            req.body = {
                nombre_usuario: "Juan",
                apellido_paterno: "Perez",
                apellido_materno: "Gomez",
                tipoEstamento: 1,
                tipoServicio: 1,
                tipoUnidad: 1,
                tipoContrato: 1,
                tipoFuncionario: 1,
            };

            // Forzar un error de base de datos
            prisma.TipoFuncionario.findUnique.mockResolvedValue({
                tipoFuncionario: 1,
            });
            prisma.Funcionario.update.mockRejectedValue(new Error("Database error"));

            await employeeController.updateEmployee(req, res);

            // Verifica que se devuelve un estado 500 y el mensaje correcto
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error: Database error",
            });
        });
    });

    describe("deleteEmployee", () => {
        test("should disable employee", async () => {
            req.params.id = "1";
            prisma.Funcionario.update.mockResolvedValue({
                IdFuncionario: 1,
                Habilitado: "N",
            });

            await employeeController.deleteEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                IdFuncionario: 1,
                Habilitado: "N",
            });
        });

        test("should handle error", async () => {
            prisma.Funcionario.update.mockRejectedValue(new Error("Database error"));
            await employeeController.deleteEmployee(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error: Database error",
            });
        });
    });
});
