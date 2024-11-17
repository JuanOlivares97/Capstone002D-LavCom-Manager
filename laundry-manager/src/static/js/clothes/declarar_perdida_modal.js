function openDeclararPerdidaModal() {
    const modal = document.querySelector('#declarar_perdida_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 100);
}

let rowIdDeclararPerdida = 0;
async function addArticuloDeclararPerdida() {
    rowIdDeclararPerdida++;
    const newRow = document.createElement('div');
    newRow.className = 'flex items-center space-x-2 mt-2';
    newRow.innerHTML = `
      <span class="text-sm font-semibold row-number">${rowIdDeclararPerdida}</span>
      <select class="flex-grow p-2 border rounded" name="articulo_${rowIdDeclararPerdida}" required>
        <option value="">Seleccionar artículo</option>
        <!-- Agregar opciones dinámicamente desde el servidor -->
      </select>
      <input type="number" min="1" name="cantidad_${rowIdDeclararPerdida}" class="w-28 p-2 border rounded" placeholder="Cantidad" required>
      <button type="button" class="bg-red-500 text-white p-2 rounded hover:bg-red-700 remove-articulo-declarar-perdida">Borrar</button>
    `;
    document.getElementById('declarar_perdida_container').appendChild(newRow);

    const response = await fetch('/laundry-manager/clothes/get-clothes');
    const articulos = await response.json();

    const selectArticulo = newRow.querySelector('select');
    articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.value = articulo.id_articulo;
        option.innerText = articulo.nombre_articulo;
        selectArticulo.appendChild(option);
    });

    newRow.querySelector('.remove-articulo-declarar-perdida').addEventListener('click', function() {
        newRow.remove();
        rowIdDeclararPerdida--;
        updateRowNumbersDeclararPerdida();
    });
}

function updateRowNumbersDeclararPerdida() {
    const rows = document.querySelectorAll('#declarar_perdida_container > div');
    rows.forEach((row, index) => {
        row.querySelector('.row-number').innerText = index + 1;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const declarar_perdida_form = document.getElementById('declarar_perdida_form');
    const modal = document.querySelector('#declarar_perdida_modal');
    const closeModal = document.querySelector('#closeModalDeclararPerdida');
    
    declarar_perdida_form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const articulosData = [];
        const filas = document.querySelectorAll('#declarar_perdida_container > div');
    
        filas.forEach((fila, index) => {
            const select = fila.querySelector('select');
            const input = fila.querySelector('input');
            if (select.value && input.value) {
                articulosData.push({
                    id_articulo: select.value,
                    cantidad: input.value
                });
            }
        });

        let registro_data = {
            // rut_usuario_1: declarar_perdida_form.querySelector("input[name='rut_usuario_1']").value,
            tipo_perdida: declarar_perdida_form.querySelector("select[name='tipo_perdida']").value,
            id_unidad_sigcom: declarar_perdida_form.querySelector("select[name='unidad_sigcom']").value,
            observaciones: declarar_perdida_form.querySelector("textarea[name='observaciones']").value,
            articulos: articulosData
        }

        if (articulosData.length !== 0) {
            const response = await fetch('/laundry-manager/clothes/declarar-perdida', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registro_data)
            })
            const data = await response.json();
            if (!data.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message
                });
                return;
            }
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: data.message
            })
            .then(() => {
                modal.classList.add('hidden');
                e.target.reset();
                document.getElementById('declarar_perdida_container').innerHTML = '';
            })
            return;
        }
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe ingresar al menos un artículo'
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        declarar_perdida_form.querySelector("textarea[name='observaciones']").value = '';
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
        // clear all articles
        const container = document.getElementById('declarar_perdida_container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        rowIdEntregaUnidadSigcom = 0;
    });
})

document.addEventListener('DOMContentLoaded', function () {
    const tipoPerdidaSelect = document.getElementById('tipo_perdida');
    const uSigcomSelect = document.getElementById('unidad_sigcom_db');

    function toggleuSigcomSelectDeclararPerdida() {
        if (tipoPerdidaSelect.value === '2') {
            uSigcomSelect.disabled = true;
            uSigcomSelect.value = '';
            uSigcomSelect.classList.add('bg-gray-200', 'cursor-not-allowed');
        } else {
            uSigcomSelect.disabled = false;
            uSigcomSelect.classList.remove('bg-gray-200', 'cursor-not-allowed');
        }
    }

    tipoPerdidaSelect.addEventListener('change', toggleuSigcomSelectDeclararPerdida);

    // Initial check
    toggleuSigcomSelectDeclararPerdida();
});