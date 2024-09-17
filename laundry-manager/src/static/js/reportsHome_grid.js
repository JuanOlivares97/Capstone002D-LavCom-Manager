import { AG_GRID_LOCALE_ES } from './utils.js';

document.addEventListener('DOMContentLoaded', async function () {
    let gridApi;

    const gridOptions = {
        // Data to be displayed
        rowData: [
            { id: 1, servicio: "Lavado", fecha: "2024-09-16", usuario: "Juan Pérez" },
            { id: 2, servicio: "Planchado", fecha: "2024-09-16", usuario: "María Gómez" },
            { id: 3, servicio: "Lavado", fecha: "2024-09-15", usuario: "Carlos Sánchez" },
            { id: 4, servicio: "Secado", fecha: "2024-09-14", usuario: "Ana Martínez" },
            { id: 5, servicio: "Planchado", fecha: "2024-09-13", usuario: "Pedro Ramírez" },
            { id: 6, servicio: "Lavado", fecha: "2024-09-12", usuario: "Laura Méndez" },
            { id: 7, servicio: "Secado", fecha: "2024-09-11", usuario: "Diego Fernández" },
            { id: 8, servicio: "Lavado", fecha: "2024-09-10", usuario: "Lucía Morales" },
            { id: 9, servicio: "Planchado", fecha: "2024-09-09", usuario: "José Torres" },
            { id: 10, servicio: "Secado", fecha: "2024-09-08", usuario: "Claudia Rojas" }
        ],
        localeText: AG_GRID_LOCALE_ES,
        // Columns to be displayed (Should match rowData properties)
        columnDefs: [
            { headerName:"ID", field: "id", flex: 1 },
            { headerName:"Servicio", field: "servicio", flex: 1 },
            { headerName: "Fecha", field: "fecha", flex: 1 },
            { headerName: "Usuario", field: "usuario", flex: 1 },
            {
                headerName: "Acciones",
                field: "actions",
                cellRenderer: function (params) {
                    return `
                        <button class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editArticulo(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Editar</button>
                        <button class="delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded" onclick="deleteArticulo(${params.data.id})">Borrar</button>
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
        },
    };

    const gridDiv = document.querySelector("#gridForReportsHome");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
