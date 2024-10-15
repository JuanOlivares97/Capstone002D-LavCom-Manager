const pacientes = [
    {
        id: 1,
        nroCama:1111111,
        camaAlta:2,
        rut: '12.345.678-9',
        nombre: 'Juan Pérez',
        apellido1: 'Pérez',
        apellido2: 'González',
        fecha_nacimiento: '15/02/1987',
        fecha_ingreso: '15/02/2002',
        fecha_alta: '16/02/2002',
        telefonos: '+56912345678',
        direccion: 'Calle Falsa 123',
        correo: 'juan.perez@mail.com',
        codigo_postal: '123456',
        localidad: 'Santiago',
        provincia: 'Santiago',
        regimen: 'Hiposódico',
        cama: 'Cama 12',
        diagnostico: 'Hipertensión',
        via: 'Oral',
        servicioalta:"Casita",
        observaciones_nutri: 'Dieta baja en sal',
        observacion_sala: 'Paciente estable',
        observacion_alta: 'Paciente estable',
        unidad:1,
        Servicio:1,
        Via:1,
        Regimen:1,
    },
    {
        id: 2,
        rut: '13.456.789-0',
        nombre: 'María García',
        apellido1: 'García',
        apellido2: 'López',
        fecha_nacimiento: '20/08/1994',
        pasaporte: 'B98765432',
        telefonos: '+56987654321',
        direccion: 'Avenida Siempre Viva 742',
        dni: '32762982T',
        correo: 'maria.garcia@mail.com',
        codigo_postal: '654321',
        localidad: 'Valparaíso',
        provincia: 'Valparaíso',
        regimen: 'Diabetes',
        cama: 'Cama 5',
        diagnostico: 'Diabetes tipo 2',
        via: 'Intravenosa',
        observaciones_nutri: 'Dieta especial para diabéticos',
        observacion_sala: 'Nivel de azúcar controlado',
        unidad:'Cirugía'
    },
    {
        id: 3,
        rut: '11.223.344-5',
        nombre: 'Carlos López',
        apellido1: 'López',
        apellido2: 'Fernández',
        fecha_nacimiento: '05/11/1975',
        pasaporte: 'C65432109',
        telefonos: '+56911223344',
        direccion: 'Pasaje Los Robles 432',
        dni: '82762092B',
        correo: 'carlos.lopez@mail.com',
        codigo_postal: '102938',
        localidad: 'Concepción',
        provincia: 'Concepción',
        regimen: 'Veganismo',
        cama: 'Cama 7',
        diagnostico: 'Problemas gastrointestinales',
        via: 'Oral',
        observaciones_nutri: 'Dieta vegana estricta',
        observacion_sala: 'Se siente mejor después de la dieta',
        unidad:'UPC'
    },
    {
        id: 4,
        rut: '14.567.890-1',
        nombre: 'Ana Martínez',
        apellido1: 'Martínez',
        apellido2: 'Gómez',
        fecha_nacimiento: '02/04/1968',
        pasaporte: 'D54321098',
        telefonos: '+56998765432',
        direccion: 'Calle El Bosque 99',
        dni: '43762993J',
        correo: 'ana.martinez@mail.com',
        codigo_postal: '837261',
        localidad: 'Rancagua',
        provincia: 'Cachapoal',
        regimen: 'Sin gluten',
        cama: 'Cama 10',
        diagnostico: 'Celiaquía',
        via: 'Oral',
        observaciones_nutri: 'Dieta libre de gluten',
        observacion_sala: 'Sin complicaciones',
        unidad:'Pediatría'
    },
    {
        id: 5,
        rut: '15.678.901-2',
        nombre: 'Luis Rodríguez',
        apellido1: 'Rodríguez',
        apellido2: 'Soto',
        fecha_nacimiento: '25/12/1982',
        pasaporte: 'E98765432',
        telefonos: '+56912349876',
        direccion: 'Camino Real 500',
        dni: '12762985V',
        correo: 'luis.rodriguez@mail.com',
        codigo_postal: '756392',
        localidad: 'Puerto Montt',
        provincia: 'Llanquihue',
        regimen: 'Vegetariano',
        cama: 'Cama 3',
        diagnostico: 'Problemas cardiovasculares',
        via: 'Oral',
        observaciones_nutri: 'Dieta baja en grasas',
        observacion_sala: 'En recuperación',
        unidad:'Pensionado'
    },
    {
        id: 6,
        rut: '16.789.012-3',
        nombre: 'Elena Sánchez',
        apellido1: 'Sánchez',
        apellido2: 'Morales',
        fecha_nacimiento: '14/07/1991',
        pasaporte: 'F12345678',
        telefonos: '+56967891234',
        direccion: 'Paseo Los Jardines 128',
        dni: '23762995H',
        correo: 'elena.sanchez@mail.com',
        codigo_postal: '462738',
        localidad: 'Temuco',
        provincia: 'Cautín',
        regimen: 'Común',
        cama: 'Cama 8',
        diagnostico: 'Gripe severa',
        via: 'Oral',
        observaciones_nutri: 'Dieta regular',
        observacion_sala: 'Recuperándose de la fiebre',
        unidad:'GineObstetricia'
    }
];


async function renderHome(req, res) {
    res.render('patient/home', { tipoUsuario: 1, pacientes });
}
module.exports = {
    renderHome
}