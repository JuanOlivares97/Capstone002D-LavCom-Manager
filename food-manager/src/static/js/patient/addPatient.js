document.getElementById('addPatientModal').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener valores del formulario
    const cama = document.getElementById('cama').value;
    const nombre = document.getElementById('nombre').value;
    const apellidop = document.getElementById('apellidop').value;
    const apellidom = document.getElementById('apellidom').value;
    const fechaNacimiento = tempo.format(new Date(document.getElementById('FechaNacimiento').value), 'YYYY-MM-DD'); // Formateo con tempo.js
    const fechaIngreso = tempo.format(new Date(document.getElementById('fechaIngreso').value), 'YYYY-MM-DD'); // Formateo con tempo.js
    const rut = document.getElementById('rut').value.split('-'); // Separar Rut y Dv
    const telefono = document.getElementById('Telefonos').value;
    const direccion = document.getElementById('Direccion').value;
    const correo = document.getElementById('Correo').value;
    const observacionesNutricionista = document.getElementById('observacionesnutricionista').value;
    const servicio = document.getElementById('Servicio').value;
    const unidad = document.getElementById('Unidad').value;
    const via = document.getElementById('Via').value;
    const regimen = document.getElementById('Regimen').value;

    // Crear el objeto paciente con los datos recopilados
    const paciente = {
        CodigoCama: parseInt(cama),
        RutHospitalizado: parseInt(rut[0]), // Rut sin el dígito verificador
        DvHospitalizado: rut[1], // Dígito verificador
        NombreHospitalizado: nombre,
        ApellidoP: apellidop,
        ApellidoM: apellidom,
        FechaNacimiento: fechaNacimiento,
        FechaIngreso: fechaIngreso,
        Telefono: parseInt(telefono),
        Direccion: direccion,
        Correo: correo,
        ObservacionesNutricionista: observacionesNutricionista,
        IdTipoServicio: parseInt(servicio),
        IdTipoUnidad: parseInt(unidad),
        IdTipoVia: parseInt(via),
        IdTipoRegimen: parseInt(regimen)
    };

    // Hacer la petición POST al servidor
    try {
        const response = await fetch('/api/pacientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paciente)
        });

        if (response.ok) {
            alert('Paciente creado exitosamente');
            // Aquí puedes hacer más acciones, como recargar la lista de pacientes o cerrar el modal
        } else {
            alert('Error al crear el paciente');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al servidor');
    }
});
