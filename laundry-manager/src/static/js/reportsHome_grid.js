import { AG_GRID_LOCALE_ES } from './utils.js';

document.addEventListener('DOMContentLoaded', async function () {
    let gridApi;

    const gridOptions = {
        // Data to be displayed
        rowData: [
            { id: 1, servicio: "Lavado", fecha: "2024-09-16", usuario: "Juan Pérez", estado:"Entregado" },
            { id: 2, servicio: "Planchado", fecha: "2024-09-16", usuario: "María Gómez", estado:"Entregado" },
            { id: 3, servicio: "Lavado", fecha: "2024-09-15", usuario: "Carlos Sánchez", estado:"Entregado" },
            { id: 4, servicio: "Secado", fecha: "2024-09-14", usuario: "Ana Martínez", estado:"Entregado" },
            { id: 5, servicio: "Planchado", fecha: "2024-09-13", usuario: "Pedro Ramírez", estado:"Entregado" },
            { id: 6, servicio: "Lavado", fecha: "2024-09-12", usuario: "Laura Méndez", estado:"Entregado" },
            { id: 7, servicio: "Secado", fecha: "2024-09-11", usuario: "Diego Fernández", estado:"Entregado" },
            { id: 8, servicio: "Lavado", fecha: "2024-09-10", usuario: "Lucía Morales", estado:"Entregado" },
            { id: 9, servicio: "Planchado", fecha: "2024-09-09", usuario: "José Torres", estado:"Entregado" },
            { id: 10, servicio: "Secado", fecha: "2024-09-08", usuario: "Claudia Rojas", estado:"Entregado" }
        ],
        localeText: AG_GRID_LOCALE_ES,
        // Columns to be displayed (Should match rowData properties)
        columnDefs: [
            { headerName:"ID", field: "id", flex: 1 },
            { headerName:"Servicio", field: "servicio", flex: 1 },
            { headerName: "Fecha", field: "fecha", flex: 1 },
            { headerName: "Usuario", field: "usuario", flex: 1 },
            { headerName: "Estado", field: "estado", flex: 1 },
            {
                headerName: "Acciones",
                field: "actions",
                cellRenderer: function (params) {
                    return `
                        <button class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editArticulo(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Editar</button>
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


document.addEventListener('DOMContentLoaded', async function () {
    let gridApi;

    const gridOptions = {
        // Data to be displayed
        rowData: [],
        localeText: AG_GRID_LOCALE_ES,
        // Columns to be displayed (Should match rowData properties)
        columnDefs: [
            { headerName:"Articulo", field: "id", flex: 1 },
            { headerName:"Ropa Limpia en Ropería", field: "ropa_limpia_roperia", flex: 1 },
            { headerName: "Ropa en Servicios", field: "ropa_servicios", flex: 1 },
            { headerName: "Ropa sucia en Ropería", field: "ropa_sucia_roperia", flex: 1 },
            { headerName: "Ropa en Tránsito", field: "ropa_transito", flex: 1 },
            { headerName: "Pérdidas Totales", field: "perdida_Total", flex: 1 },
            { headerName: "Bajas Totales", field: "baja_total", flex: 1 },
            
        ],
        pagination: true,
        paginationPageSize: 15,
        paginationAutoPageSize: true,
        defaultColDef: {
            resizable: false,
            sortable: true,
        },
    };

    const gridDiv = document.querySelector("#gridForReportsStockGeneral");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
});