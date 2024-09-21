import { AG_GRID_LOCALE_ES } from './utils.js';

function createGrid(gridId, rowData, columnDefs) {
    const gridOptions = {
        rowData: rowData,
        localeText: AG_GRID_LOCALE_ES,
        columnDefs: columnDefs,
        pagination: true,
        paginationPageSize: 15,
        paginationAutoPageSize: true,
        defaultColDef: {
            resizable: false,
            sortable: true,
        },
    };

    const gridDiv = document.querySelector(gridId);
    if (gridDiv) {
        agGrid.createGrid(gridDiv, gridOptions);
    }
}

document.addEventListener('DOMContentLoaded', async function () {   
    // Primer grid: Reportes Home
    createGrid("#gridForReportsHome", [
        { id: 1, servicio: "Lavado", fecha: "2024-09-16", usuario: "Juan Pérez", estado: "Entregado" },
        { id: 2, servicio: "Planchado", fecha: "2024-09-16", usuario: "María Gómez", estado: "Entregado" },
    ], [
        { headerName: "ID", field: "id", flex: 1 },
        { headerName: "Servicio", field: "servicio", flex: 1 },
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
    ]);

    // Segundo grid: Stock General
    createGrid("#gridForReportsStockGeneral", [], [
        { headerName: "Articulo", field: "id", flex: 1 },
        { headerName: "Ropa Limpia en Ropería", field: "ropa_limpia_roperia", flex: 1 },
        { headerName: "Ropa en Servicios", field: "ropa_servicios", flex: 1 },
        { headerName: "Ropa sucia en Ropería", field: "ropa_sucia_roperia", flex: 1 },
        { headerName: "Ropa en Tránsito", field: "ropa_transito", flex: 1 },
        { headerName: "Pérdidas Totales", field: "perdida_Total", flex: 1 },
        { headerName: "Bajas Totales", field: "baja_total", flex: 1 }
    ]);

    // Tercer Grid: Reporte de Ropa en Servicios
    createGrid('#gridForReportRopaServicios', [],
        [
            { headerName: "Id", field: "id"},
            { headerName: "Articulo", field: "articulo", flex: 1 },
            { headerName: "Total en Servicio", field: "total_servicio", flex: 1 },
        ]
    )

    // Cuarto Grid: Reporte de Stock de Ropa Sucia en Ropería
    createGrid('#gridForReporteRopaSuciaRoperia', [], 
        [
            { headerName: "#", field: "id"},
            { headerName: "Articulo", field: "articulo", flex: 1 },
            { headerName: "Ropa Sucia Roperia", field: "sucia_roperia", flex: 1 },
        ]
    )

    // Quinto Grid: Reporte de Stock de en Tránsito
    createGrid('#gridForReporteRopaTransito', [], 
        [
            { headerName: "#", field: "id"},
            { headerName: "Articulo", field: "articulo", flex: 1 },
            { headerName: "Ropa en Lavanderia Externa", field: "ropa_transito", flex: 1 },
        ]
    )

    // Sexto Grid: Reporte de de Bajas y Perdidas del Mes
    createGrid('#gridForReporteBajasPerdidas', [], 
        [
            { headerName: "#", field: "id"},
            { headerName: "Articulo", field: "articulo", flex: 1 },
            { headerName: "Perdidas", field: "perdidas", flex: 1 },
            { headerName: "bajas", field: "perdidas", flex: 1 },
            
        ]
    )

    // Septimo Grid: Listado de Usuarios
    createGrid('#gridForUsers', [], 
        [
            { headerName: "#", field: "id"},
            { headerName: "Rut", field: "articulo" },
            { headerName: "Nombre", field: "perdidas", flex: 1 },
            {
                headerName: "Acciones",
                field: "actions",
                cellRenderer: function (params) {
                    return `
                        <button class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editArticulo(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Editar</button>
                    `;
                }
            }
        ]
    )
});
