const helpController = require("../src/controllers/help.controller");
const multiTest = require("./helpers/multiTest");

describe("renderHome", () => {
    let req, res;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            user: {
                'tipo_usuario': 1,
                'rutLogueado': '12345678-9',
                'nombreLogueado': 'John Doe'
            }
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    })

    test('should render the home page with tipo_usuario', () => {
        helpController.renderHome(req, res);
        
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(200),
            () => expect(res.render).toHaveBeenCalledWith("help/home", {tipo_usuario: 1}),
        ])
    });

    test('should return 500 status if there is an error', () => {
        req.user = undefined;
        helpController.renderHome(req, res);
        
        multiTest([
            () => expect(res.status).toHaveBeenCalledWith(500),
            () => expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" }),
        ])
    })
});