// tests/auth.controller.test.js
const authController = require('../auth.controller');
const prisma = require('../../server/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('../../server/mailer');

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
    });

    describe('renderLogin', () => {
        test('should render login page', () => {
            authController.renderLogin(req, res);
            expect(res.render).toHaveBeenCalledWith("auth/login", { layout: false });
        });
    });

    describe('renderRecuperarContrasenaForm', () => {
        test('should render password recovery form page', () => {
            authController.renderRecuperarContrasenaForm(req, res);
            expect(res.render).toHaveBeenCalledWith("auth/recuperar_pwd_form", { layout: false });
        });
    });

    describe('renderRecuperarContrasenaInfo', () => {
        test('should render password recovery info page', () => {
            authController.renderRecuperarContrasenaInfo(req, res);
            expect(res.render).toHaveBeenCalledWith("auth/recuperar_pwd_info", { layout: false });
        });
    });

    describe('login', () => {
        test('should return 400 if RUT or password is missing', async () => {
            req.body = {};
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "RUT y contraseña son obligatorios", success: false });
        });

        test('should return 401 if user not found or password is incorrect', async () => {
            req.body = { rutCompleto: "12345678-9", pwd: "password" };
            prisma.Funcionario.findFirst.mockResolvedValue(null);
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Rut o contraseña incorrectos", success: false });
        });

        test('should login successfully with valid credentials', async () => {
            req.body = { rutCompleto: "12345678-9", pwd: "password" };
            const user = { IdFuncionario: 1, contrasena: "hashed_password", NombreFuncionario: "Juan", IdTipoFuncionario: 2 };
            prisma.Funcionario.findFirst.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fake_token");

            await authController.login(req, res);
            expect(res.cookie).toHaveBeenCalledWith("token", "fake_token", { path: "/food-manager" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Has iniciado sesión, bienvenido", success: true, user });
        });
    });

    describe('setEmail', () => {
        test('should set email successfully', async () => {
            req.body = { email: "test@example.com", IdFuncionario: 1 };
            prisma.Funcionario.findUnique.mockResolvedValue({ IdFuncionario: 1 });
            prisma.Funcionario.update.mockResolvedValue(true);

            await authController.setEmail(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Correo electrónico establecido", success: true });
        });
    });

    describe('sendPwdEmail', () => {
        test('should send password recovery email successfully', async () => {
            req.body = { email: "test@example.com", rutCompleto: "12345678-9" };
            prisma.Funcionario.findUnique.mockResolvedValue({ correo: "test@example.com" });
            mailer.enviarCorreo.mockResolvedValue(true);
            bcrypt.hashSync.mockReturnValue("hashed_code");

            await authController.sendPwdEmail(req, res);
            expect(res.cookie).toHaveBeenCalledWith("pwdcode", "hashed_code", { path: "/" });
            expect(res.redirect).toHaveBeenCalledWith("/auth/recuperar-pwd-info");
        });
    });

    describe('changePwd', () => {
        test('should change password successfully if code is valid', async () => {
            req.body = { code: "1234", pwd: "new_password" };
            req.cookies = { pwdcode: "hashed_code", username: "12345678-9" };
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hashSync.mockReturnValue("new_hashed_password");

            await authController.changePwd(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Contraseña actualizada" });
        });
    });

    describe('logout', () => {
        test('should clear cookies and return success message on logout', async () => {
            await authController.logout(req, res);
            expect(res.clearCookie).toHaveBeenCalledWith("token", { path: '/food-manager' });
            expect(res.clearCookie).toHaveBeenCalledWith("logged-in", { path: '/food-manager' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Has cerrado sesión", success: true });
        });
    });
});
