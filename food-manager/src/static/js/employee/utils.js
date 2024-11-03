function formatRUTInput(inputElement) {
    inputElement.addEventListener('input', () => {
      let rut = inputElement.value.replace(/\./g, '').replace(/-/g, '');
  
      // Extraer el cuerpo y el dígito verificador
      const cuerpo = rut.slice(0, -1);
      const dv = rut.slice(-1);
  
      // Actualizar el valor del input sin puntos, solo con guion
      inputElement.value = `${cuerpo}-${dv}`;
    });
  }
  
  // Llamar a la función en el input de RUT
  const rutInputElement = document.getElementById('rut_usuario');
  formatRUTInput(rutInputElement);