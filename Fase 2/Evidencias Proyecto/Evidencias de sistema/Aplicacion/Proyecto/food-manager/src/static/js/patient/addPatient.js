document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const addPacienteButton = document.getElementById('addPaciente');
    const closeModalButton = document.getElementById('closeModalAddPatient');
    const addPatientModal = document.getElementById('addPatientModal');

    // Función para abrir el modal (puedes agregar lógica adicional aquí si es necesario)
    function openModal() {
        addPatientModal.classList.remove('hidden');
    }

    // Función para cerrar el modal
    function closeModal() {
        addPatientModal.classList.add('hidden');
    }

    // Evento de clic para el botón de ingresar paciente
    addPacienteButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Obtener valores del formulario
        const cama = document.getElementById('cama').value;
        const nombre = document.getElementById('nombre').value;
        const apellidop = document.getElementById('apellidop').value;
        const apellidom = document.getElementById('apellidom').value;
        const fechaNacimiento = document.getElementById('FechaNacimiento').value;
        const RutCompleto = document.getElementById('rut').value; // Obtén el valor del RUT completo
        const telefono = document.getElementById('Telefonos').value;
        const direccion = document.getElementById('Direccion').value;
        const correo = document.getElementById('Correo').value;
        const observacionesNutricionista = document.getElementById('observacionesnutricionista').value;
        const observacionesSala = document.getElementById('observacionesgenerales').value;
        const servicio = document.getElementById('Servicio').value;
        const unidad = document.getElementById('Unidad').value;
        const via = document.getElementById('Via').value;
        const regimen = document.getElementById('Regimen').value;

        // Crear objeto paciente
        const paciente = {
            CodigoCama: parseInt(cama),
            RutCompleto, // Incluye el RUT completo
            NombreHospitalizado: nombre,
            ApellidoP: apellidop,
            ApellidoM: apellidom,
            FechaNacimiento: fechaNacimiento,
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
                headers: { 'Content-Type': 'application/json' },
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

    // Evento de clic para cerrar el modal
    closeModalButton.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal();
    });
});