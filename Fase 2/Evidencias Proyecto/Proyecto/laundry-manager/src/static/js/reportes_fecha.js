document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#reportes_fecha_modal');
    const openModal = document.querySelector('#openModalReportesFecha');
    const closeModal = document.querySelector('#closeModalReportesFecha');
    const reportButton = document.querySelectorAll('.report-date');

    openModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10); // Small delay to ensure the class is applied after removing 'hidden'
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });

    reportButton.forEach(button => {
        button.addEventListener('click', async () => {
            const mes = document.getElementById('mes').value;
            const anio = document.getElementById('anio').value;
            const tipo = button.getAttribute('data-tipo');
    
            if (mes == "0" || anio == "0") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debes seleccionar un mes y un año',
                    showConfirmButton: true
                })
                return;
            }

            const url_fetch = `/laundry-manager/reports/get-general-date/${mes}/${anio}/${tipo}`;
    
            const response = await fetch(url_fetch)
            const data = await response.json();
            const result = data.result

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte');

            worksheet.columns = [
                { header: 'Articulo', key: 'nombre_articulo', width: 24 },
                { header: 'Cantidad', key: 'cantidad_total' },
            ];

            result.forEach(item => {
                worksheet.addRow({ nombre_articulo: item.nombre_articulo, cantidad_total: item.cantidad_total });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = data.file;  // El nombre del archivo es dinámico
            anchor.click();
            window.URL.revokeObjectURL(url);
            
        });
    })

    document.querySelector(".report-date-bp").addEventListener('click', async () => {
        const mes = document.getElementById('mes').value;
        const anio = document.getElementById('anio').value;
    
        if (mes == "0" || anio == "0") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar un mes y un año',
                showConfirmButton: true
            })
            return;
        }

        const url_fetch = `/laundry-manager/reports/get-bp-date/${mes}/${anio}`;

        const response = await fetch(url_fetch)
        const data = await response.json();
        const result = data.result

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte');

        worksheet.columns = [
            { header: 'Articulo', key: 'nombre_articulo', width: 24 },
            { header: 'Perdidas externas', key: 'perdidas_externas', width: 19 },
            { header: 'Perdidas internas', key: 'perdidas_internas', width: 19 },
            { header: 'Perdidas totales', key: 'perdidas_totales', width: 19 },
            { header: 'Bajas servicio', key: 'bajas_servicio', width: 19 },
            { header: 'Bajas roperia', key: 'bajas_roperia', width: 19 },
            { header: 'Bajas totales', key: 'bajas_totales', width: 19 }, 
        ];

        result.forEach(item => {
            worksheet.addRow({
                nombre_articulo: item.nombre_articulo,
                perdidas_externas: item.perdidas_externas,
                perdidas_internas: item.perdidas_internas,
                perdidas_totales: item.perdidas_totales,
                bajas_servicio: item.bajas_servicio,
                bajas_roperia: item.bajas_roperia,
                bajas_totales: item.bajas_totales,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = data.file;  // El nombre del archivo es dinámico
        anchor.click();
        window.URL.revokeObjectURL(url);
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#reportes_fecha_modal_usigcom');
    const openModal = document.querySelector('#openModalReportesFechaUnidad');
    const closeModal = document.querySelector('#closeModalReportesFechaUsigcom');
    const reportButton = document.querySelectorAll('.report-date-usigcom');

    openModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10); // Small delay to ensure the class is applied after removing 'hidden'
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });

    reportButton.forEach(button => {
        button.addEventListener('click', async () => {
            const mes = document.getElementById('mes_usigcom').value;
            const anio = document.getElementById('anio_usigcom').value;
            const usigcom = document.getElementById('rep_usigcom').value;
            const name_usigcom = document.getElementById('rep_usigcom').innerText;
            const tipo = button.getAttribute('data-tipo');
        
            if (mes == "0" || anio == "0" || usigcom == "0") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debes seleccionar un mes, un año y una unidad sigcom',
                    showConfirmButton: true
                })
                return;
            }
        
            const url_fetch = `/laundry-manager/reports/get-general-date-usigcom/${mes}/${anio}/${tipo}/${usigcom}`;
        
            const response = await fetch(url_fetch)
            const data = await response.json();
            const result = data.result
        
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(name_usigcom);
        
            worksheet.columns = [
                { header: 'Articulo', key: 'nombre_articulo', width: 24 },
                { header: 'Cantidad', key: 'cantidad_total' },
            ];
        
            result.forEach(item => {
                worksheet.addRow({ nombre_articulo: item.nombre_articulo, cantidad_total: item.cantidad_total });
            });
        
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = data.file;  // El nombre del archivo es dinámico
            anchor.click();
        })
    })    

    document.querySelector(".report-date-bp-usigcom").addEventListener('click', async () => {
        const mes = document.getElementById('mes_usigcom').value;
        const anio = document.getElementById('anio_usigcom').value;
        const usigcom = document.getElementById('rep_usigcom').value;
        const name_usigcom = document.getElementById('rep_usigcom').innerText;
    
        if (mes == "0" || anio == "0") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar un mes y un año',
                showConfirmButton: true
            })
            return;
        }

        const url_fetch = `/laundry-manager/reports/get-bp-date-usigcom/${mes}/${anio}/${usigcom}`;

        const response = await fetch(url_fetch)
        const data = await response.json();
        const result = data.result

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(name_usigcom);

        worksheet.columns = [
            { header: 'Articulo', key: 'nombre_articulo', width: 24 },
            { header: 'Perdidas', key: 'perdidas_internas', width: 8 },
            { header: 'Bajas', key: 'bajas_servicio', width: 8 }, 
        ];

        result.forEach(item => {
            worksheet.addRow({
                nombre_articulo: item.nombre_articulo,
                perdidas_internas: item.perdidas_internas,
                bajas_servicio: item.bajas_servicio,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = data.file;  // El nombre del archivo es dinámico
        anchor.click();
        window.URL.revokeObjectURL(url);
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#reportes_diario_modal');
    const openModal = document.querySelector('#openModalReportesDiario');
    const closeModal = document.querySelector('#closeModalReportesDiario');
    const reportButton = document.querySelectorAll('.report-daily');
    
    openModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10); // Small delay to ensure the class is applied after removing 'hidden'
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });

    reportButton.forEach(button => {
        button.addEventListener('click', async () => {
            const fecha = document.getElementById('fecha_input').value;
            const tipo = button.getAttribute('data-tipo');

            if (fecha == "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debes seleccionar una fecha',
                    showConfirmButton: true
                })
                return;
            }

            const url_fetch = `/laundry-manager/reports/get-daily-report/${fecha}/${tipo}`;

            const response = await fetch(url_fetch)
            const data = await response.json();
            const result = data.result

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte Diario');

            worksheet.columns = [
                { header: 'Articulo', key: 'nombre_articulo', width: 24 },
                { header: 'Cantidad', key: 'cantidad_total' },
            ];

            result.forEach(item => {
                worksheet.addRow({ nombre_articulo: item.nombre_articulo, cantidad_total: item.cantidad_total });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = data.file;  // El nombre del archivo es dinámico
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    });

    document.querySelector(".report-daily-bp").addEventListener('click', async () => {
        const fecha = document.getElementById('fecha_input').value;

        if (fecha == "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar una fecha',
                showConfirmButton: true
            })
            return;
        }

        const url_fetch = `/laundry-manager/reports/get-bp-daily/${fecha}`;

        const response = await fetch(url_fetch) 
        const data = await response.json();
        const result = data.result

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Diario');

        worksheet.columns = [
            { header: 'Articulo', key: 'nombre_articulo', width: 24 },
            { header: 'Perdidas externas', key: 'perdidas_externas', width: 19 },
            { header: 'Perdidas internas', key: 'perdidas_internas', width: 19 },
            { header: 'Perdidas totales', key: 'perdidas_totales', width: 19 },
            { header: 'Bajas servicio', key: 'bajas_servicio', width: 19 },
            { header: 'Bajas roperia', key: 'bajas_roperia', width: 19 },
            { header: 'Bajas totales', key: 'bajas_totales', width: 19 }, 
        ];

        result.forEach(item => {
            worksheet.addRow({
                nombre_articulo: item.nombre_articulo,
                perdidas_externas: item.perdidas_externas,
                perdidas_internas: item.perdidas_internas,
                perdidas_totales: item.perdidas_totales,
                bajas_servicio: item.bajas_servicio,
                bajas_roperia: item.bajas_roperia,
                bajas_totales: item.bajas_totales,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = data.file;  // El nombre del archivo es dinámico
        anchor.click();
        window.URL.revokeObjectURL(url);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#reportes_diario_modal_usigcom');
    const openModal = document.querySelector('#openModalReportesDiarioUnidad');
    const closeModal = document.querySelector('#closeModalReportesDiarioUnidad');
    const reportButton = document.querySelectorAll('.report-daily-usigcom');

    openModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('.transform').classList.remove('scale-95');
        }, 10); // Small delay to ensure the class is applied after removing 'hidden'
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
    });

    reportButton.forEach(button => {
        button.addEventListener('click', async () => {
            const fecha = document.getElementById('fecha_input_usigcom').value;
            const tipo = button.getAttribute('data-tipo');
            const usigcom = document.getElementById('rep_usigcom_d').value;

            if (fecha == "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debes seleccionar una fecha',
                    showConfirmButton: true
                })
                return;
            }

            if (usigcom == "" || usigcom == "0") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debes seleccionar una unidad sigcom',
                    showConfirmButton: true
                })
                return;
            }

            const url_fetch = `/laundry-manager/reports/get-daily-report-usigcom/${fecha}/${tipo}/${usigcom}`;

            const response = await fetch(url_fetch)
            const data = await response.json();
            const result = data.result

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte Diario');

            worksheet.columns = [
                { header: 'Articulo', key: 'nombre_articulo', width: 24 },
                { header: 'Cantidad', key: 'cantidad_total' },
            ];

            result.forEach(item => {
                worksheet.addRow({ nombre_articulo: item.nombre_articulo, cantidad_total: item.cantidad_total });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = data.file;  // El nombre del archivo es dinámico
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    });

    document.querySelector(".report-daily-bp-usigcom").addEventListener('click', async () => {
        const fecha = document.getElementById('fecha_input_usigcom').value;
        const usigcom = document.getElementById('rep_usigcom_d').value;

        if (fecha == "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar una fecha',
                showConfirmButton: true
            })
            return;
        }

        if (usigcom == "" || usigcom == "0") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar una unidad sigcom',
                showConfirmButton: true
            })
            return;
        }

        const url_fetch = `/laundry-manager/reports/get-bp-daily-usigcom/${fecha}/${usigcom}`;

        const response = await fetch(url_fetch) 
        const data = await response.json();
        const result = data.result

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Diario');

        worksheet.columns = [
            { header: 'Articulo', key: 'nombre_articulo', width: 24 },
            { header: 'Perdidas internas', key: 'perdidas_internas', width: 19 },
            { header: 'Bajas servicio', key: 'bajas_servicio', width: 19 }, 
        ];

        result.forEach(item => {
            worksheet.addRow({
                nombre_articulo: item.nombre_articulo,
                perdidas_internas: item.perdidas_internas,
                bajas_servicio: item.bajas_servicio,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = data.file;  // El nombre del archivo es dinámico
        anchor.click();
        window.URL.revokeObjectURL(url);
    });
})