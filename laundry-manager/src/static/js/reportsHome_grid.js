import { AG_GRID_LOCALE_ES } from './utils.js';
document.addEventListener('DOMContentLoaded', async () => {
    function toggleModal(idModal, btnAbrirModal, btnCerrarModal, gridId, buttonToDownload, rowData, columnDefs, sheetName, fileName) {
        const modal = document.querySelector(idModal);
        const openModal = document.querySelector(btnAbrirModal);
        const closeModal = document.querySelector(btnCerrarModal);

        if (!modal || !openModal || !closeModal) return;

        let gridInitialized = false; // Variable para verificar si el grid ya ha sido inicializado

        openModal.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');

                // Crear el grid solo si no ha sido inicializado previamente
                if (!gridInitialized) {
                    createGrid(gridId, buttonToDownload, rowData, columnDefs, sheetName, fileName);
                    gridInitialized = true; // Marcar como inicializado
                }
            }, 10);
        });

        closeModal.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        });
    }

    function createGrid(gridId, buttonToDownload, rowData, columnDefs, sheetName, fileName) {
        const gridDiv = document.querySelector(gridId);
        if (!gridDiv) {
            console.error("Div del grid no encontrado:", gridId);
            return;
        }

        // Verifica si ya existe un grid en este div
        if (gridDiv.childElementCount > 0) {
            console.log("Grid ya creado");
            return; // Si ya existe un grid, no lo creamos de nuevo
        }

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
            onGridReady: function (params) {
                const exportButton = document.querySelector(buttonToDownload);
                if (exportButton) {
                    exportButton.innerText = 'Exportar a Excel';
                    
                    // Añadir evento al botón
                    exportButton.addEventListener('click', async () => {
                        // Función para exportar los datos a Excel usando ExcelJS
                        await exportGridToExcel(params.api, sheetName, fileName);
                    });
                } else {
                    console.error("Botón de exportación no encontrado:", buttonToDownload);
                }
            }
        };

        agGrid.createGrid(gridDiv, gridOptions);
    }

    async function exportGridToExcel(gridApi, sheetName = 'Sheet1', fileName = 'export.xlsx') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);  // El nombre de la hoja es dinámico

        // Obtener columnas desde el grid
        const columns = gridApi.getColumnDefs();
        worksheet.columns = columns.map(col => ({ header: col.headerName, key: col.field }));

        // Obtener filas desde el grid
        const rowData = [];
        gridApi.forEachNode((node) => rowData.push(node.data));

        // Añadir las filas
        rowData.forEach((data) => {
            worksheet.addRow(data);
        });

        // Descargar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;  // El nombre del archivo es dinámico
        anchor.click();
        window.URL.revokeObjectURL(url);
    }


    // Segundo grid: Stock General
    toggleModal(
        '#modal_stock_general', 
        '#openModalReporteGeneral', 
        '#closeModalReporteGeneral', 
        "#gridForReportsStockGeneral", 
        "#ExportGeneralToExcel", 
        [
            { id: 1, servicio: "Lavado", fecha: "2024-09-16", usuario: "Juan Pérez", estado: "Entregado" },
            { id: 2, servicio: "Planchado", fecha: "2024-09-16", usuario: "María Gómez", estado: "Entregado" }
        ], 
        [
            { headerName: "ID", field: "id", flex: 1 },
            { headerName: "Servicio", field: "servicio", flex: 1 },
            { headerName: "Fecha", field: "fecha", flex: 1 },
            { headerName: "Usuario", field: "usuario", flex: 1 },
            { headerName: "Estado", field: "estado", flex: 1 }
        ],
        'Reporte Stock General',  // Nombre de la hoja
        'stock_general.xlsx'      // Nombre del archivo
    );

    
    const response = await fetch('/reports/get-report');
    const stockClothes = await response.json();
    
    // Tercer Grid: Reporte de Ropa en Servicios
    toggleModal(
        '#modal_ropa_servicios', 
        '#openModalRopaServicios', 
        '#closeModalRopaServicios',
        "#gridForReportRopaServicios", 
        "#ExportRopaServicios", 
        stockClothes,  
        [
            { headerName: "Articulo", field: "id_articulo", flex: 1 },
            { headerName: "Ropa Limpia en Ropería", field: "roperia_limpio", flex: 1 },
            { headerName: "Ropa en Servicios", field: "ropa_servicios", flex: 1 },
            { headerName: "Ropa sucia en Ropería", field: "roperia_sucio", flex: 1 },
            { headerName: "Ropa en Tránsito", field: "en_lavanderia", flex: 1 },
            { headerName: "Pérdidas Totales", field: "perdidas_totales", flex: 1 },
            { headerName: "Bajas Totales", field: "bajas_totales", flex: 1 }
        ],
        'Ropa en Servicios',  // Nombre de la hoja
        'stock_en_servicios.xlsx'      // Nombre del archivo
    );

    const response2 = await fetch('/reports/get-report');
    const dirtyCLothes = await response2.json();

    // Cuarto Grid: Reporte de Stock de Ropa Sucia en Ropería
    toggleModal(
        '#modal_ropa_sucia_roperia',
        '#openModalRopaSuciaRoperia',
        '#closeModalRopaSuciaRoperia',
        "#gridForReporteRopaSuciaRoperia", 
        "#ExportRopaSuciaToExcel", 
        dirtyCLothes,
        [
            { headerName: "#", field: "id_articulo" },
            { headerName: "Articulo", field: "nombre_articulo", flex: 1 },
            { headerName: "Ropa Sucia Roperia", field: "roperia_sucio", flex: 1 },
        ],
        'Ropa Sucia en Roperia',  // Nombre de la hoja
        'ropa_sucia_en_roperia.xlsx'      // Nombre del archivo
    );

    // Quinto Grid: Reporte de Stock de en Tránsito
    toggleModal(
        '#modal_ropa_transito',
        '#openModalRopaTransito',
        '#closeModalRopatransito',
        "#gridForReporteRopaTransito", 
        "#ExportRopatransito", 
        [],
        [
            { headerName: "#", field: "id" },
            { headerName: "Articulo", field: "articulo", flex: 1 },
            { headerName: "Ropa en Lavanderia Externa", field: "ropa_transito", flex: 1 },
        ],
        'Stock de Ropa en Transito',  // Nombre de la hoja
        'ropa_en_transito.xlsx'      // Nombre del archivo
    );

    const response3 = await fetch('/reports/get-bajas-perdidas');
    const ropaBajaPerdidas = await response3.json();

    // Sexto Grid: Reporte de de Bajas y Perdidas del Mes
    toggleModal(
        '#modal_ropa_baja',
        '#openModalRopaBaja',
        '#closeModalRopaBaja',
        "#gridForReporteBajasPerdidas", 
        "#ExportRopaBaja", 
        ropaBajaPerdidas,
        [
            { headerName: "#", field: "id_articulo" },
            { headerName: "Articulo", field: "nombre_articulo", flex: 1 },
            { headerName: "Perdidas", field: "perdidas_totales", flex: 1 },
            { headerName: "bajas", field: "bajas_totales", flex: 1 },

        ],
        'Ropa dada De baja',  // Nombre de la hoja
        'ropa_de_baja.xlsx'      // Nombre del archivo
    );

    createGrid('#gridForUsers','#downloadUsers', [],
        [
            { headerName: "#", field: "id" },
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
        ])
});
