document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#crear_articulo_modal');
    const openModal = document.querySelector('#openModal');
    const closeModal = document.querySelector('#closeModal');

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

    modal.addEventListener("submit", async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newClothingItem = Object.fromEntries(formData);
        
        // Asegúrate que los nombres coincidan con lo que espera el backend
        const dataToSend = {
            nombre: newClothingItem.nombre,
            stock: parseInt(newClothingItem.stock),
            subgrupo: parseInt(newClothingItem.subgrupo)
        };
        
        try {
            const response = await fetch("/clothes/create-clothes", {
                method: "POST",
                body: JSON.stringify(dataToSend),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
            
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
                modal.classList.add('hidden');
                
                // Asegúrate que los campos coincidan con las columnas de ag-grid
                const gridData = {
                    id_articulo: data.articulo.id_articulo,
                    nombre_articulo: data.articulo.nombre_articulo,
                    stock: data.articulo.stock,
                    subgrupo: data.articulo.subgrupo_ropa.desc_subgrupo,
                    id_subgrupo_ropa: data.articulo.id_subgrupo_ropa    
                };
                
                window.gridApi.applyTransaction({ add: [gridData] });
                e.target.reset();
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al crear el artículo",
                icon: "error",
            });
        }
    });
});