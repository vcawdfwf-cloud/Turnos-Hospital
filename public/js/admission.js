let currentTurno = null;
let startTime = null;
let interactionStartTime = null;

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

function startServiceTimer() {
    startTime = new Date();
}

function startInteractionTimer() {
    interactionStartTime = new Date();
}

function stopServiceTimer() {
    if (startTime) {
        const endTime = new Date();
        const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds
        startTime = null;
        return duration;
    }
    return 0;
}

function stopInteractionTimer() {
    if (interactionStartTime) {
        const endTime = new Date();
        const duration = Math.floor((endTime - interactionStartTime) / 1000); // Duration in seconds
        interactionStartTime = null;
        return duration;
    }
    return 0;
}

function calcularTiempoAtencion(horaLlamado, horaFin) {
    const inicio = new Date(horaLlamado);
    const fin = new Date(horaFin);
    const diff = Math.floor((fin - inicio) / 1000); // Duration in seconds
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}m ${seconds}s`;
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

        const data = await response.json();
        if (data.turno) {
            startServiceTimer(); // Start service timer when a turn is called
            startInteractionTimer(); // Start interaction timer
            cargarTurnos();
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

async function finalizarTurno() {
    const btnFinalizar = document.getElementById('finalizarTurno');
    btnFinalizar.disabled = true;

    const tiempoAtencion = stopServiceTimer();
    const tiempoInteraccion = stopInteractionTimer();

    if (currentTurno) {
        await fetch(`/api/finalizar_turno`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                turno: currentTurno,
                tiempoAtencion,
                tiempoInteraccion,
            }),
        });

        currentTurno = null;
        cargarTurnos();
    }
}

// Cargar turnos inicialmente y cada 5 segundos
cargarTurnos();
setInterval(cargarTurnos, 5000);

document.getElementById('enviarWhatsapp').addEventListener('click', () => {
    if (currentTurno) {
        const turnoActualDiv = document.getElementById('turnoActual');
        const patientName = turnoActualDiv.querySelector('.patient-name').textContent;
        const patientPhone = turnoActualDiv.querySelector('.patient-phone').textContent.replace('📱 ', '');
        const message = `Hola ${patientName}, su turno está siendo atendido. Por favor diríjase a la recepción.`;
        const whatsappUrl = `https://wa.me/${patientPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        alert('No hay paciente siendo atendido actualmente.');
    }
});