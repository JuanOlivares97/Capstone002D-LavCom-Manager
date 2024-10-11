import { AG_GRID_LOCALE_ES } from '../utils.js';
document.addEventListener('DOMContentLoaded', async function () {
    let gridApi;

    const gridOptions = {
        // Datos a mostrar
        rowData: [],
        localeText: AG_GRID_LOCALE_ES,
        // Definición de columnas
        columnDefs: [
            {
                headerName: "RUT", field: "rut", flex: 1, filter: true,
                floatingFilter: true
            },
            {
                headerName: "Nombre", field: "nombre", flex: 1, filter: true,
                floatingFilter: true
            },
            { headerName: "Tipo de Contrato", field: "tipo_contrato", flex: 1 },
            { headerName: "Estamento", field: "estamento", flex: 1 },
            { headerName: "Servicio", field: "servicio", flex: 1 },
            { headerName: "Unidad Signom", field: "unidad_signom", flex: 1 },
            { headerName: "Fecha Inicio", field: "fecha_inicio", flex: 1 },
            { headerName: "Término Contrato", field: "termino_contrato", flex: 1 },
            { headerName: "Tipo Régimen", field: "tipo_regimen", flex: 1 },
            {
                headerName: "Estado",
                field: "estado",
                cellRenderer: function (params) {
                    return params.value ?
                        `<span style="color:green;">✔️</span>` :
                        `<span style="color:red;">❌</span>`;
                },
                flex: 1
            },
            {
                headerName: "Acciones",
                field: "actions",
                cellRenderer: function (params) {
                    return `
                        <button class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editUsuario(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Editar</button>
                        <button class="delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded" onclick="deleteUsuario(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Borrar</button>
                    `;
                },
                flex: 1
            }
        ],
        pagination: true,
        paginationPageSize: 15,
        paginationAutoPageSize: true,
        defaultColDef: {
            resizable: false,
            sortable: true,
            filter: true,
        },
    };

    const gridDiv = document.querySelector("#gridFuncionarios");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
});

// Función para editar usuario
window.editUsuario = function (data) {
    const modal = document.getElementById("editar_usuario_modal");

    const modalTitle = modal.getElementsByTagName("h2");
    modalTitle[0].innerText = `Editar Usuario con RUT ${data.rut}`;

    const rutInput = modal.querySelector("input[name='rut']");
    const nameInput = modal.querySelector("input[name='nombre']");
    const contratoInput = modal.querySelector("select[name='tipo_contrato']");

    rutInput.value = data.rut;
    nameInput.value = data.nombre;
    contratoInput.value = data.tipo_contrato;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);
}

// Función para borrar usuario
window.deleteUsuario = function (data) {
    Swal.fire({
        title: `¿Estás seguro de que deseas borrar al usuario ${data.nombre}?`,
        text: "¡No podrás revertir esto! ¿Deseas continuar? ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                '¡Borrado!',
                'El usuario ha sido eliminado.',
                'success'
            );
            // Aquí puedes agregar la lógica para eliminar el usuario del backend
        }
    });
}
