const authController = require('../auth.controller');
const prisma = require('../../server/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('../../server/mailer');
const multiTest = require('./helpers/multiTest');

jest.mock('../../server/prisma');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../server/mailer');

describe('Auth Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, cookies: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
            redirect: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('renderLogin', () => {
        test('should render login page', () => {
            authController.renderLogin(req, res);
            multiTest([
                () => expect(res.render).toHaveBeenCalledWith('auth/login', { layout: false }),
                () => expect(res.status).not.toHaveBeenCalledWith(500),
            ]);
        });
    });

    describe('renderRecuperarContrasenaForm', () => {
        test('should render password recovery form', () => {
            authController.renderRecuperarContrasenaForm(req, res);
            multiTest([
                () => expect(res.render).toHaveBeenCalledWith('auth/recuperar_pwd_form', { layout: false }),
                () => expect(res.status).not.toHaveBeenCalledWith(500),
            ]);
        });
    });

    describe('login', () => {
        test('should login successfully with correct credentials', async () => {
            const mockUser = {
                IdFuncionario: 1,
                NombreFuncionario: 'John Doe',
                contrasena: 'hashedPwd',
                IdTipoFuncionario: 2,
            };

            prisma.Funcionario.findFirst.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('testToken');

            req.body = { username: 'johndoe', pwd: 'password123' };

            await authController.login(req, res);

            multiTest([
                () => expect(prisma.Funcionario.findFirst).toHaveBeenCalledWith({ where: { username: 'johndoe' }, include: { TipoFuncionario: true } }),
                () => expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPwd'),
                () => expect(jwt.sign).toHaveBeenCalledWith(expect.any(Object), process.env.JWT_SECRET, { expiresIn: '8h' }),
                () => expect(res.cookie).toHaveBeenCalledWith('token', 'testToken', { path: '/food-manager' }),
                () => expect(res.status).toHaveBeenCalledWith(200),
                () => expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true })),
            ]);
        });

        test('should return 401 if user not found', async () => {
            prisma.Funcionario.findFirst.mockResolvedValue(null);

            req.body = { username: 'unknown', pwd: 'password123' };

            await authController.login(req, res);

            multiTest([
                () => expect(res.status).toHaveBeenCalledWith(401),
                () => expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Rut o contraseña incorrectos' })),
            ]);
        });

        test('should return 500 if bcrypt throws an error', async () => {
            const mockUser = { IdFuncionario: 1, contrasena: 'hashedPwd' };
            prisma.Funcionario.findFirst.mockResolvedValue(mockUser);
            bcrypt.compare.mockRejectedValue(new Error('bcrypt error'));

            req.body = { username: 'johndoe', pwd: 'password123' };

            await authController.login(req, res);

            multiTest([
                () => expect(res.status).toHaveBeenCalledWith(500),
                () => expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false })),
            ]);
        });
    });

    describe('sendPwdEmail', () => {
        test("The password recovery email should be sent successfully.", async () => {
            bcrypt.hashSync.mockReturnValue("hashed_code");
        
            req.body = {
                email: "test@example.com",
                rutCompleto: "12345678-9",
            };
        
            prisma.Funcionario.findUnique.mockResolvedValue({
                correo: "test@example.com",
            });
        
            mailer.enviarCorreo.mockResolvedValue(true);
        
            await authController.sendPwdEmail(req, res);
        
            multiTest([
                () =>
                    expect(res.cookie).toHaveBeenCalledWith(
                        "pwdcode",
                        "hashed_code",
                        { path: "/food-manager" }
                    ),
                () =>
                    expect(res.cookie).toHaveBeenCalledWith(
                        "username",
                        "12345678-9",
                        { path: "/food-manager" }
                    ),
                () => expect(mailer.enviarCorreo).toHaveBeenCalledWith("test@example.com", expect.any(String)),
                () => expect(res.redirect).toHaveBeenCalledWith("/auth/recuperar-pwd-info"),
            ]);
        });
        

        test('should return 500 if user not found', async () => {
            prisma.Funcionario.findUnique.mockResolvedValue(null);

            req.body = { email: 'unknown@example.com', rutCompleto: '12345678-9' };

            await authController.sendPwdEmail(req, res);

            multiTest([
                () => expect(res.status).toHaveBeenCalledWith(500),
                () => expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Usuario no encontrado' })),
            ]);
        });
    });

    describe('changePwd', () => {
        test('should update password successfully', async () => {
            req.cookies = { pwdcode: 'hashedCode', username: '12345678-9' };
            req.body = { code: '1234', pwd: 'newPassword123' };

            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hashSync.mockReturnValue('hashedNewPassword');
            prisma.Funcionario.update.mockResolvedValue(true);

            await authController.changePwd(req, res);

            multiTest([
                () => expect(bcrypt.compare).toHaveBeenCalledWith('1234', 'hashedCode'),
                () => expect(prisma.Funcionario.update).toHaveBeenCalledWith({
                    where: { RutFuncionario_DvFuncionario: { RutFuncionario: '12345678', DvFuncionario: '9' } },
                    data: { contrasena: 'hashedNewPassword' },
                }),
                () => expect(res.status).toHaveBeenCalledWith(200),
                () => expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true })),
            ]);
        });

        test('should return 500 if code is invalid', async () => {
            req.cookies = { pwdcode: 'hashedCode', username: '12345678-9' };
            req.body = { code: '1234' };

            bcrypt.compare.mockResolvedValue(false);

            await authController.changePwd(req, res);

            multiTest([
                () => expect(res.status).toHaveBeenCalledWith(500),
                () => expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Código inválido, intente nuevamente' })),
            ]);
        });
    });

    describe('logout', () => {
        test('should clear cookies and logout successfully', async () => {
            await authController.logout(req, res);

            multiTest([
                () => expect(res.clearCookie).toHaveBeenCalledWith('token', { path: '/food-manager' }),
                () => expect(res.clearCookie).toHaveBeenCalledWith('logged-in', { path: '/food-manager' }),
                () => expect(res.clearCookie).toHaveBeenCalledWith('tipo_usuario', { path: '/food-manager' }),
                () => expect(res.status).toHaveBeenCalledWith(200),
                () => expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true })),
            ]);
        });
    });
});
