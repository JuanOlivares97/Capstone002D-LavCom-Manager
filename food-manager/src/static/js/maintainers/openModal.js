// Al cargar el contenido de la página
document.addEventListener('DOMContentLoaded', function () {
    const filtroLinks = document.querySelectorAll('.filtro-link');

    filtroLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.target.getAttribute('data-filter');

            // Obtener todas las tarjetas
            const cards = document.querySelectorAll('.card-item');

            // Mostrar u ocultar las tarjetas según el filtro seleccionado
            cards.forEach(card => {
                if (card.classList.contains(filter)) {
                    card.classList.remove('hidden'); // Mostrar tarjeta
                }
                card.classList.add('hidden'); // Ocultar tarjeta

            });
        });
    });
});

// Función para abrir el modal con el contenido correspondiente
function openModal(mantenedor) {
    const modal = document.getElementById('modalAddMaintainer');
    const modalTitle = document.getElementById('modalTitle');
    const formContent = document.getElementById('formContent');

    // Establece el título del modal según el mantenedor seleccionado
    modalTitle.textContent = `Agregar ${mantenedor}`;

    // Limpia el contenido del formulario antes de agregar nuevos campos
    formContent.innerHTML = '';

    // Define los campos del formulario según el mantenedor seleccionado
    let fields = [];
    switch (mantenedor) {
        case 'Estamentos':
            fields = [{ label: 'Descripción de Estamento', type: 'text', name: 'DescTipoEstamento' }];
            break;
        case 'Unidades':
            fields = [{ label: 'Descripción de Unidad', type: 'text', name: 'DescTipoUnidad' }];
            break;
        case 'Servicios':
            fields = [{ label: 'Descripción de Servicio', type: 'text', name: 'DescTipoServicio' }];
            break;
        case 'Contratos':
            fields = [{ label: 'Tipo de Contrato', type: 'text', name: 'TipoContrato' }];
            break;
        case 'Vias':
            fields = [{ label: 'Descripción de Vía de Alimentación', type: 'text', name: 'DescTipoVia' }];
            break;
        case 'Perfiles':
            fields = [{ label: 'Perfil del Funcionario', type: 'text', name: 'TipoPerfil' }];
            break;
        case 'Regimen':
            fields = [{ label: 'Descripción de Régimen', type: 'text', name: 'DescTipoRegimen' }];
            break;
    }

    // Añade los campos al formulario
    fields.forEach(field => {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'flex flex-col';
        fieldElement.innerHTML = `
            <label class="text-gray-700">${field.label}</label>
            <input type="${field.type}" name="${field.name}" class="border rounded p-2" required>
        `;
        formContent.appendChild(fieldElement);
    });

    // Muestra el modal
    modal.classList.remove('hidden');
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('modalAddMaintainer').classList.add('hidden');
}

// Asigna eventos de clic a las tarjetas de agregar item
document.querySelectorAll('.card-item').forEach(card => {
    card.addEventListener('click', () => {
        const mantenedor = card.classList.contains('Estamento') ? 'Estamentos' :
            card.classList.contains('Unidad') ? 'Unidades' :
                card.classList.contains('Servicios') ? 'Servicios' :
                    card.classList.contains('Contratos') ? 'Contratos' :
                        card.classList.contains('Vias') ? 'Vias de Alimentación' :
                            card.classList.contains('Perfiles') ? 'Perfiles de Funcionarios' :
                                card.classList.contains('Regimen') ? 'Regimen' : '';
        openModal(mantenedor);
    });
});

// Captura el envío del formulario y realiza la solicitud al backend
document.getElementById('modalForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Previene el comportamiento por defecto de recargar la página

    const mantenedor = document.getElementById('modalTitle').textContent.split(' ')[1].toLowerCase();
    let endpoint;

    // Asigna el endpoint según el mantenedor seleccionado
    switch (mantenedor) {
        case 'estamentos':
            endpoint = '/food-manager/maintainer/create-estamento';
            break;
        case 'unidades':
            endpoint = '/food-manager/maintainer/create-unidad';
            break;
        case 'servicios':
            endpoint = '/food-manager/maintainer/create-servicio';
            break;
        case 'contratos':
            endpoint = '/food-manager/maintainer/create-contrato';
            break;
        case 'vias':
            endpoint = '/food-manager/maintainer/create-via';
            break;
        case 'perfiles':
            endpoint = '/food-manager/maintainer/create-tipo-funcionario';
            break;
        case 'regimen':
            endpoint = '/food-manager/maintainer/create-regimen';
            break;
        default:
            alert("Mantenedor no reconocido");
            return;
    }

    // Crea un objeto con los datos del formulario
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        // Envía los datos al servidor con fetch
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();

            // SweetAlert para éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `${mantenedor} creado exitosamente`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(() => {
                closeModal(); // Cierra el modal después de confirmar
            });
        }

        const error = await response.json();

        // SweetAlert para error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al crear el ${mantenedor}: ${error.error}`,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });


    } catch (error) {
        // SweetAlert para error de conexión
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: `Error al conectar con el servidor: ${error.message}`,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    }

});
