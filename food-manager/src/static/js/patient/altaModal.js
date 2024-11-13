function openModalAlta(paciente) {
    // Mostrar el modal
    const modal = document.getElementById('altaModal');
    modal.classList.remove('hidden');

    // Llenar los datos del paciente en el modal
    document.getElementById('modalNombreAlta').innerText = `Declaración de Alta del paciente ${paciente.NombreHospitalizado} ${paciente.ApellidoP} ${paciente.ApellidoM}`;
    document.getElementById('idPacienteAlta').value = paciente.IdHospitalizado;

    
    document.getElementById('infoNroCamaAlta1').value = paciente.CodigoCamaAlta || paciente.CodigoCama;
    document.getElementById('infoServicioAlta1').value  = paciente.ServicioAlta !== null && paciente.ServicioAlta !== undefined ? paciente.ServicioAlta : '';// Servicio de Alta
    document.getElementById('infoObservacionesAlta1').value = paciente.ObservacionesAlta || '';
}

function closeModalAlta() {
    // Ocultar el modal
    const modal = document.getElementById('altaModal');
    modal.classList.add('hidden');
}

// Función para dar alta al paciente (llamada desde el botón Dar Alta)
function darAltaPaciente(paciente) {
    // Abrir el modal y pasar los datos del paciente
    openModalAlta(paciente);
}

async function indicarAltaPaciente() {
    // Obtener los valores de los campos del modal
    const idPaciente = document.getElementById('idPacienteAlta').value;
    const CodigoCamaAlta = document.getElementById('infoNroCamaAlta1').value;
    const ServicioAlta = document.getElementById('infoServicioAlta1').value;
    const ObservacionesAlta = document.getElementById('infoObservacionesAlta1').value;
    try {
        // Realizar la solicitud PUT al servidor
        const response = await fetch(`/food-manager/patient/indicar-alta/${idPaciente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CodigoCamaAlta,
                ServicioAlta,
                ObservacionesAlta
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: data.message
            }).then(() => {
                closeModal(); // Cerrar el modal
                location.reload(); // Recargar la página para reflejar los cambios
            });
        } else {
            // Mostrar SweetAlert de error con el mensaje del servidor
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Ocurrió un error al indicar la alta del paciente'
            });
        }
    } catch (error) {
        // Mostrar SweetAlert de error en caso de fallo en la solicitud
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al comunicar con el servidor: ' + error.message
        });
    }
}
