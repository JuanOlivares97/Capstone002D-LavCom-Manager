function filterByUnit(unit) {
    const cards = document.querySelectorAll('#cardGridPacientes > div');
    cards.forEach(card => {
        if (card.getAttribute('data-unidad') === unit) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina tildes
}

function searchByName(event) {
    event.preventDefault();
    const query = removeAccents(document.getElementById('searchQuery').value.toLowerCase());
    const cards = document.querySelectorAll('#cardGridPacientes > div');
    let found = false;

    cards.forEach(card => {
        const nombre = removeAccents(card.querySelector('h2').textContent.toLowerCase());
        if (nombre.includes(query)) {
            document.getElementById('rutInput').value = '';
            card.classList.remove('hidden');
            found = true;
        } else {
            card.classList.add('hidden');
        }
    });

    if (!found) {
        Swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No se encontraron pacientes con ese nombre',
            confirmButtonColor: '#4F46E5'
        });
    }
}

function searchByRut() {
    const query = document.getElementById('rutInput').value.trim();
    const cards = document.querySelectorAll('#cardGridPacientes > div');
    let found = false;

    cards.forEach(card => {
        const rut = card.querySelector('#rutSpan').textContent.trim();
        if (rut === query) {
            document.getElementById('searchQuery').value = '';
            card.classList.remove('hidden');
            found = true;
        } else {
            card.classList.add('hidden');
        }
    });

    if (!found) {
        Swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No se encontraron pacientes con ese RUT',
            confirmButtonColor: '#4F46E5'
        });
    }
}

function formatRut(input) {
    let value = input.value.replace(/\./g, '').replace(/-/g, ''); // Eliminar puntos y guión anteriores
    if (value.length > 1) {
        value = value.slice(0, -1).replace() + '-' + value.slice(-1);
    }
    input.value = value;
}

function clearFilters() {
    // Mostrar todas las tarjetas
    const cards = document.querySelectorAll('#cardGridPacientes > div');
    cards.forEach(card => {
        card.classList.remove('hidden');
    });

    // Restablecer los campos de búsqueda
    document.getElementById('searchQuery').value = '';
    document.getElementById('rutInput').value = '';

    // Restablecer el filtro de unidad si hay un campo select o input para unidades
    const unitSelect = document.getElementById('unitSelect'); // Asegúrate de que existe un elemento select para unidades
    if (unitSelect) {
        unitSelect.value = ''; // Selecciona el valor predeterminado o vacío
    }
}



