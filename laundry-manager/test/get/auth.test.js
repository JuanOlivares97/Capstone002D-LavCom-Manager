const { renderLogin, renderRecuperarContrasenaForm, renderRecuperarContrasenaInfo } = require('../../src/controllers/auth.controller'); // Adjust path as needed

describe('renderLogin', () => {
    let mockResponse;
    let mockRequest;

    beforeEach(() => {
        mockRequest = {}; // The request object is not used in this case
        mockResponse = {
            render: jest.fn(), // Mocking the render function of the response object
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render the login page successfully', async () => {
        await renderLogin(mockRequest, mockResponse);

        // Check that res.render was called with the correct arguments
        expect(mockResponse.render).toHaveBeenCalledWith('auth/login', { layout: false });
    });

    test('should return an internal server error if an exception occurs', async () => {
        // Simulate an error by making the render function throw an exception
        mockResponse.render.mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });

        await renderLogin(mockRequest, mockResponse);

        // Check that res.status(500) and res.json() were called
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
    });
});

describe('renderRecuperarContrasenaForm', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {}
        mockResponse = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("render password recovery form", async () => {
        await renderRecuperarContrasenaForm(mockRequest, mockResponse)

        expect(mockResponse.render).toHaveBeenCalledWith("auth/recuperar_pwd_form", {layout:false})
    })

    test('should return an internal server error if an exception occurs', async () => {
        // Simulate an error by making the render function throw an exception
        mockResponse.render.mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });

        await renderRecuperarContrasenaForm(mockRequest, mockResponse);

        // Check that res.status(500) and res.json() were called
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
    });
})
describe('renderRecuperarContrasenaInfo', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {}
        mockResponse = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("render password recovery info", async () => {
        await renderRecuperarContrasenaInfo(mockRequest, mockResponse)

        expect(mockResponse.render).toHaveBeenCalledWith("auth/recuperar_pwd_info", {layout:false})
    })

    test('should return an internal server error if an exception occurs', async () => {
        // Simulate an error by making the render function throw an exception
        mockResponse.render.mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });

        await renderRecuperarContrasenaInfo(mockRequest, mockResponse);

        // Check that res.status(500) and res.json() were called
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
    });
})