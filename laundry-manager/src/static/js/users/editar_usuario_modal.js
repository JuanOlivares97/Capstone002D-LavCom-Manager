document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#editar_usuario_modal');
    const closeModal = document.querySelector('#closeModalEditUser');

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });

    modal.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = Object.fromEntries(formData);
        
        await fetch("/laundry-manager/users/update-user", {
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
                const newdata = data.usuario_actualizado;
                const row = window.gridApi.getRowNode(updatedData.rowIndex);
                if (row) {
                    row.setData({
                        ...row.data,
                        id_usuario: newdata.id_usuario,
                        rut_usuario: newdata.rut_usuario,
                        dv_usuario: newdata.dv_usuario,
                        nombre: newdata.nombre,
                        id_servicio: newdata.id_servicio,
                        id_tipo_contrato: newdata.id_tipo_contrato,
                        id_estamento: newdata.id_estamento,
                        id_tipo_usuario: newdata.id_tipo_usuario,
                        username: newdata.username,
                        rut: `${newdata.rut_usuario}-${newdata.dv_usuario}`,
                        email: newdata.email
                    });
                }
                e.target.reset();
            });
        });
    });
});