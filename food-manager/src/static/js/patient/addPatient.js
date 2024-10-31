document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const addPatientModal = document.getElementById('addPatientModal');
    const addPacienteButton = document.getElementById('addPaciente');
    const closeModalButton = document.getElementById('closeModalAddPatient');

    // Mostrar el modal (agregar la lógica para abrir el modal si es necesario)
    function openModal() {
        addPatientModal.classList.remove('hidden');
    }

    // Cerrar el modal
    function closeModal() {
        addPatientModal.classList.add('hidden');
    }

    // Añadir evento de click al botón para ingresar el paciente
    addPacienteButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Obtener valores del formulario
        const cama = document.getElementById('cama').value;
        const nombre = document.getElementById('nombre').value;
        const apellidop = document.getElementById('apellidop').value;
        const apellidom = document.getElementById('apellidom').value;
        const fechaNacimiento = document.getElementById('FechaNacimiento').value; // Mantener como string
        const fechaIngreso = document.getElementById('fechaIngreso').value; // Mantener como string
        const rut = document.getElementById('rut').value.split('-'); // Separar Rut y Dv
        const telefono = document.getElementById('Telefonos').value;
        const direccion = document.getElementById('Direccion').value;
        const correo = document.getElementById('Correo').value;
        const observacionesNutricionista = document.getElementById('observacionesnutricionista').value;
        const observacionesSala = document.getElementById('observacionesgenerales').value;
        const servicio = document.getElementById('Servicio').value;
        const unidad = document.getElementById('Unidad').value;
        const via = document.getElementById('Via').value;
        const regimen = document.getElementById('Regimen').value;

        // Crear el objeto paciente con los datos recopilados
        const paciente = {
            CodigoCama: parseInt(cama),
            RutHospitalizado: rut[0], // Rut sin el dígito verificador
            DvHospitalizado: rut[1], // Dígito verificador
            NombreHospitalizado: nombre,
            ApellidoP: apellidop,
            ApellidoM: apellidom,
            FechaNacimiento: fechaNacimiento, // Mantener como string para convertirlo en el backend
            FechaIngreso: fechaIngreso, // Mantener como string para convertirlo en el backend
            Telefono: parseInt(telefono),
            Direccion: direccion,
            Correo: correo,
            ObservacionesNutricionista: observacionesNutricionista,
            ObservacionesSala: observacionesSala,
            IdTipoServicio: parseInt(servicio),
            IdTipoUnidad: parseInt(unidad),
            IdTipoVia: parseInt(via),
            IdTipoRegimen: parseInt(regimen)
        };

        // Hacer la petición POST al servidor
        try {
            const response = await fetch('/food-manager/patient/create-paciente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });

            if (response.ok) {
                const data = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Paciente creado exitosamente',
                    text: data.message,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    // Cerrar el modal y recargar la página
                    closeModal();
                    window.location.reload();
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el paciente',
                    text: errorData.message,
                    confirmButtonText: 'Ok'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión al servidor',
                text: 'No se pudo conectar al servidor, por favor intente más tarde.',
                confirmButtonText: 'Ok'
            });
        }
    });

    // Añadir evento al botón para cerrar el modal
    closeModalButton.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal();
    });
});
