document.getElementById('altaModal').addEventListener('submit', async (event) => {
    event.preventDefault();
document.getElementById('infoFechaAlta').value = paciente.FechaAlta || '';
document.getElementById('infoServicioAlta').value = paciente.ServicioAlta || '';
document.getElementById('infoNroCama').value = paciente.CodigoCamaAlta || '';
document.getElementById('infoObservacionesAlta').value = paciente.ObservacionesAlta || '';
})