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
            resizable:true,
            columnDefs: columnDefs,
            pagination: true,
            paginationPageSize: 15,
            defaultColDef: {
                resizable: true,
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

    // Tercer Grid: Reporte de Ropa en Servicios
    toggleModal(
        '#modal_ropa_servicios',
        '#openModalRopaServicios',
        '#closeModalRopaServicios',
        "#gridForReportRopaServicios",
        "#ExportRopaServicios",
        [],
        [
            { headerName: "Articulo", field: "id", flex: 1 },
            { headerName: "Ropa Limpia en Ropería", field: "ropa_limpia_roperia", flex: 1 },
            { headerName: "Ropa en Servicios", field: "ropa_servicios", flex: 1 },
            { headerName: "Ropa sucia en Ropería", field: "ropa_sucia_roperia", flex: 1 },
            { headerName: "Ropa en Tránsito", field: "ropa_transito", flex: 1 },
            { headerName: "Pérdidas Totales", field: "perdida_Total", flex: 1 },
            { headerName: "Bajas Totales", field: "baja_total", flex: 1 }
        ],
        'Ropa en Servicios',  // Nombre de la hoja
        'stock_en_servicios.xlsx'      // Nombre del archivo
    );

    // Cuarto Grid: Reporte de Stock de Ropa Sucia en Ropería
    toggleModal(
        '#modal_ropa_sucia_roperia',
        '#openModalRopaSuciaRoperia',
        '#closeModalRopaSuciaRoperia',
        "#gridForReporteRopaSuciaRoperia",
        "#ExportRopaSuciaToExcel",
        [],
        [
            { headerName: "#", field: "id" },
            { headerName: "Articulo", field: "articulo", flex: 1 },
            { headerName: "Ropa Sucia Roperia", field: "sucia_roperia", flex: 1 },
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

    // Sexto Grid: Reporte de de Bajas y Perdidas del Mes
    toggleModal(
        '#modal_ropa_baja',
        '#openModalRopaBaja',
        '#closeModalRopaBaja',
        "#gridForReporteBajasPerdidas",
        "#ExportRopaBaja",
        [],
        [
            { headerName: "#", field: "id" },
            { headerName: "Articulo", field: "articulo", flex: 1 },
            { headerName: "Perdidas", field: "perdidas", flex: 1 },
            { headerName: "bajas", field: "perdidas", flex: 1 },

        ],
        'Ropa dada De baja',  // Nombre de la hoja
        'ropa_de_baja.xlsx'      // Nombre del archivo
    );

    const response = await fetch('/users/get-users');
    const users = await response.json();

    createGrid('#gridForUsers', '#downloadUsers', users, [
        { headerName: "#", field: "id_usuario" },
        {
            headerName: "Rut",
            valueGetter: function (params) {
                // Concatenar rut_usuario con dv_usuario
                return `${params.data.rut_usuario}-${params.data.dv_usuario}`;
            }
        },
        { headerName: "Nombre", field: "nombre", flex: 1 },
        {
            headerName: "Acciones",
            field: "actions",
            cellRenderer: function (params) {
                return `
                <button id="openModalEditUser" class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editUser(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Editar</button>
            `;
            }
        }
    ]);

    window.editUser = function (data) {
        const modal = document.getElementById('modal_editar_usuario');

        // Título del modal
        const modalTitle = modal.getElementsByTagName("h2")[0];
        modalTitle.innerText = `Editar Usuario con RUT: ${data.rut_usuario}-${data.dv_usuario}`;

        // Campos del formulario
        const rutInput = modal.querySelector("input[id='erut_usuario']");
        const nombreInput = modal.querySelector("input[id='enombre']");
        const servicioInput = modal.querySelector("select[id='eservicio']");
        const contratoInput = modal.querySelector("select[id='etipo_contrato']");
        const sigcomInput = modal.querySelector("select[id='eunidad_sigcom']");
        const estamentoInput = modal.querySelector("select[id='eestamento']");
        const tipoUsuarioInput = modal.querySelector("select[id='etipo_usuario']");
        const usernameInput = modal.querySelector("input[id='eusername']");
        const passwordInput = modal.querySelector("input[id='epwd']");

        // Asignar valores de los datos
        rutInput.value = `${data.rut_usuario}-${data.dv_usuario}`;
        nombreInput.value = data.nombre;
        servicioInput.value = data.id_servicio;
        contratoInput.value = data.id_tipo_contrato;
        sigcomInput.value = data.id_unidad_sigcom;
        estamentoInput.value = data.id_estamento;
        tipoUsuarioInput.value = data.id_tipo_usuario;
        usernameInput.value = data.username;
        passwordInput.value = data.pwd;

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
    }
    const modal = document.getElementById('modal_editar_usuario');
    const closeModal = document.querySelector('#closeModalEditUser');

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
    });

});
