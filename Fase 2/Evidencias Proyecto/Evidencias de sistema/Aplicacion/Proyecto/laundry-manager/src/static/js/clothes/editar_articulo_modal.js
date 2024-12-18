document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#editar_articulo_modal');
    const closeModal = document.querySelector('#closeModalEditarArticulo');

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });

    modal.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = Object.fromEntries(formData);
        
        await fetch("/laundry-manager/clothes/update-clothes", {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                });
                return;
            }

            Swal.fire({
                title: "Éxito",
                text: data.message,
                icon: "success"
            }).then(() => {
                // Cerrar el modal
                modal.classList.add('hidden');
                const newdata = data.articulo_actualizado;
                const row = window.gridApi.getRowNode(updatedData.rowIndex);
                if (row) {
                    row.setData({
                        ...row.data,
                        id_articulo: newdata.id_articulo,
                        nombre_articulo: newdata.nombre_articulo,
                        stock: newdata.stock,
                        subgrupo: newdata.subgrupo_ropa.desc_subgrupo,
                        id_subgrupo_ropa: newdata.id_subgrupo_ropa
                    });
                }
            });
        });
    });
});