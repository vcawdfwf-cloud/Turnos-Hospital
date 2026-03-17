let currentTurno = null;

async function cargarTurnos() {
    try {
        const response = await fetch('/api/obtener_turnos');
        const data = await response.json();

        const turnos = data.turnos;

        // Encontrar turno actual (llamando o atendiendo)
        const turnoActual = turnos.find(t => t.estado === 'llamando' || t.estado === 'atendiendo');
        
        const turnoActualDiv = document.getElementById('turnoActual');
        if (turnoActual) {
            turnoActualDiv.innerHTML = `
                <div class="current-patient">
                    <div class="turno-number">${turnoActual.turno}</div>
                    <div class="patient-name">${turnoActual.nombre}</div>
                    <div class="patient-phone">📱 ${turnoActual.telefono}</div>
                    <div class="patient-area">🏥 ${turnoActual.area}</div>
                    <div class="attended-by">👤 ${turnoActual.atendido_por}</div>
                </div>
            `;
            turnoActualDiv.classList.add('active');
        } else {
            turnoActualDiv.innerHTML = '<div class="no-patient">No hay paciente siendo atendido</div>';
            turnoActualDiv.classList.remove('active');
        }

        // Lista de espera (pendientes)
        const listaEspera = turnos.filter(t => t.estado === 'pendiente');
        const ulEspera = document.getElementById('listaEspera');
        ulEspera.innerHTML = '';
        listaEspera.forEach(turno => {
            const li = document.createElement('li');
            li.textContent = `${turno.turno} - ${turno.nombre}`;
            ulEspera.appendChild(li);
        });

        // Lista de turnos atendidos (finalizados)
        const listaAtendidos = turnos.filter(t => t.estado === 'finalizado');
        const ulAtendidos = document.getElementById('listaAtendidos');
        ulAtendidos.innerHTML = '';
        listaAtendidos.forEach(turno => {
            const li = document.createElement('li');
            const tiempoAtencion = calcularTiempoAtencion(turno.hora_llamado, turno.hora_fin);
            li.innerHTML = `
                <span>${turno.turno} - ${turno.nombre}</span>
                <span>${turno.atendido_por} - ${tiempoAtencion}</span>
            `;
            ulAtendidos.appendChild(li);
        });

        currentTurno = turnoActual ? turnoActual.turno : null;
        
        // Actualizar estado de botones
        const btnLlamar = document.getElementById('llamarSiguiente');
        const btnFinalizar = document.getElementById('finalizarTurno');
        
        if (currentTurno) {
            btnLlamar.disabled = true;
            btnFinalizar.disabled = false;
        } else {
            btnLlamar.disabled = false;
            btnFinalizar.disabled = true;
        }
    } catch (error) {
        console.error('Error cargando turnos:', error);
    }
}

function calcularTiempoAtencion(horaLlamado, horaFin) {
    if (!horaLlamado || !horaFin) return 'N/A';
    
    const inicio = new Date(horaLlamado);
    const fin = new Date(horaFin);
    const diffMs = fin - inicio;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSegs = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffMins}m ${diffSegs}s`;
}

document.getElementById('llamarSiguiente').addEventListener('click', async () => {
    const atendido_por = document.getElementById('atendidoPor').value;

    try {
        const response = await fetch('/api/llamar_siguiente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ atendido_por })
        });

        if (response.ok) {
            cargarTurnos();
            // Mostrar mensaje de confirmación
            alert('Paciente llamado exitosamente. Se envió notificación por WhatsApp.');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

document.getElementById('finalizarTurno').addEventListener('click', async () => {
    if (!currentTurno) {
        alert('No hay turno actual para finalizar');
        return;
    }

    try {
        const response = await fetch('/api/finalizar_turno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ turno: currentTurno })
        });

        if (response.ok) {
            cargarTurnos();
            alert('Atención finalizada exitosamente.');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

// Cargar turnos inicialmente y cada 5 segundos
cargarTurnos();
setInterval(cargarTurnos, 5000);