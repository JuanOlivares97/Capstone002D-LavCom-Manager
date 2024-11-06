// Importamos las funciones que vamos a testear
const { renderLogin, renderRecuperarContrasenaForm, renderRecuperarContrasenaInfo } = require('../../src/controllers/auth.controller'); // Adjust path as needed

// Tests para renderizar la página de inicio
describe('renderLogin', () => {
    // Variables req y res para las funciones
    let res;
    let req;

    // Configuración inicial previa a cada test
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock request object
        req = {};

        // Mock response object
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    // Test para renderizar la página de inicio correctamente
    test('should render the login page successfully', async () => {
        // Llamar a la función
        await renderLogin(req, res);

        // Verificar que res.render() fue llamado con los parámetros correctos
        expect(res.render).toHaveBeenCalledWith('auth/login', { layout: false });
    });

    // Test para manejar un error interno
    test('should return an internal server error if an exception occurs', async () => {
        // Simular un error haciendo que la función render lance una excepción
        res.render.mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });

        // Llamar a la función
        await renderLogin(req, res);

        // Verificación de error 5000
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// Tests para renderizar la página de recuperar contraseña
describe('renderRecuperarContrasenaForm', () => {
    // Variables req y res para las funciones
    let req;
    let res;

    // Configuración inicial previa a cada test
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock request object
        req = {}

        // Mock response object
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })

    // Test para renderizar el formulario de recuperar contraseña correctamente
    test("render password recovery form", async () => {
        // Llamar a la función
        await renderRecuperarContrasenaForm(req, res)

        // Verificar que res.render() fue llamado con los parámetros correctos
        expect(res.render).toHaveBeenCalledWith("auth/recuperar_pwd_form", {layout:false})
    })

    // Test para manejar un error interno
    test('should return an internal server error if an exception occurs', async () => {
        // Simular un error haciendo que la función render lance una excepción
        res.render.mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });

        // Llamar a la función
        await renderRecuperarContrasenaForm(req, res);

        // Verificacicón de error 500
        expect(res.status).toHaveBeenCalledWith(500);
    });
})

// Tests para renderizar la página de recuperar contraseña
describe('renderRecuperarContrasenaInfo', () => {
    // Variables req y res para las funciones
    let req;
    let res;

    // Configuración inicial previa a cada test
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock request object
        req = {}

        // Mock response object
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })

    // Test para renderizar la información de recuperar contraseña correctamente
    test("render password recovery info", async () => {
        // Llamar a la función
        await renderRecuperarContrasenaInfo(req, res)

        // Verificar que res.render() fue llamado con los parámetros correctos
        expect(res.render).toHaveBeenCalledWith("auth/recuperar_pwd_info", {layout:false})
    })

    // Test para manejar un error interno
    test('should return an internal server error if an exception occurs', async () => {
        // Simular un error haciendo que la función render lance una excepción
        res.render.mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });

        // Llamar a la función
        await renderRecuperarContrasenaInfo(req, res);

        // Veridicación de error 500
        expect(res.status).toHaveBeenCalledWith(500);
    });
})