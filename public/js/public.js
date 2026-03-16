async function cargarTurnos() {
    try {
        const response = await fetch('/api/obtener_turnos');
        const data = await response.json();

        const turnos = data.turnos;

        // Encontrar turno actual (llamando o atendiendo)
        const turnoActual = turnos.find(t => t.estado === 'llamando' || t.estado === 'atendiendo');
        document.getElementById('turnoActual').textContent = turnoActual ? turnoActual.turno : '-';

        // Lista de espera (pendientes)
        const listaEspera = turnos.filter(t => t.estado === 'pendiente');
        const ul = document.getElementById('listaEspera');
        ul.innerHTML = '';
        listaEspera.forEach(turno => {
            const li = document.createElement('li');
            li.textContent = turno.turno;
            ul.appendChild(li);
        });
    } catch (error) {
        console.error('Error cargando turnos:', error);
    }
}

// Cargar turnos inicialmente y cada 5 segundos
cargarTurnos();
setInterval(cargarTurnos, 5000);