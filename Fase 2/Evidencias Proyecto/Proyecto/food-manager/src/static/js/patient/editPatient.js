async function toggleEditMode(button) {
    // Identificar campos personales
    const personalFields = [
        "infoNombre",
        "InfoApellido1",
        "infoApellido2",
        "infoTelefonos",
        "infoCorreo",
        "infoDireccion"
    ];

    const isEditing = button.getAttribute("data-editing") === "true";

    if (isEditing) {
        // Guardar datos
        const id = document.getElementById("idPaciente").value;
        const nombre = document.getElementById("infoNombre").value;
        const apellidoP = document.getElementById("InfoApellido1").value;
        const apellidoM = document.getElementById("infoApellido2").value;
        const telefono = document.getElementById("infoTelefonos").value;
        const correo = document.getElementById("infoCorreo").value;
        const direccion = document.getElementById("infoDireccion").value;

        try {
            const response = await fetch("/food-manager/patient/edit-patient", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,
                    nombre,
                    apellidoP,
                    apellidoM,
                    telefono,
                    correo,
                    direccion
                })
            });

            const result = await response.json();

            if (!response.ok) {
                Swal.fire("Error", result.message || "Error al guardar los cambios", "error");
                return;
            }

            Swal.fire("Éxito", "Datos actualizados correctamente", "success");

            // Deshabilitar campos
            personalFields.forEach(field => {
                document.getElementById(field).setAttribute("readonly", true);
            });

            button.textContent = "Editar";
            button.classList.remove("bg-green-500", "hover:bg-green-600");
            button.classList.add("bg-gray-200", "hover:bg-gray-300","px-4","py-2","rounded-md");
            button.setAttribute("data-editing", "false");
        } catch (error) {
            Swal.fire("Error", "Hubo un problema al guardar los cambios", "error");
        }
    } else {
        // Habilitar campos
        personalFields.forEach(field => {
            document.getElementById(field).removeAttribute("readonly");
        });

        button.textContent = "Guardar";
        button.classList.remove("bg-gray-200", "hover:bg-gray-300");
        button.classList.add("bg-green-500", "hover:bg-green-600","px-4","py-2","rounded-md");
        
        button.setAttribute("data-editing", "true");
    }
}

// Agregar evento al botón
const editButton = document.getElementById("EditButton");
if (editButton) {
    editButton.addEventListener("click", () => toggleEditMode(editButton));
}
