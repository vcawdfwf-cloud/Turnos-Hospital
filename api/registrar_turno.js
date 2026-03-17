const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

let turnos = [];

// Cargar datos del archivo
async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        turnos = JSON.parse(data);
    } catch (error) {
        turnos = [];
    }
}

// Guardar datos al archivo
async function saveData() {
    await fs.writeFile(DATA_FILE, JSON.stringify(turnos, null, 2));
}

// Función para generar número de turno
function generarTurno() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayTurnos = turnos.filter(t => t.fecha_operacion === today);
    const numero = todayTurnos.length + 1;
    return `T${numero.toString().padStart(3, '0')}`;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    await loadData();

    const { nombre, telefono, area, dispositivo_id } = req.body;

    if (!nombre || !telefono || !area || !dispositivo_id) {
        res.status(400).json({ error: 'Todos los campos son requeridos' });
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    // Verificar si el dispositivo ya registró hoy
    const existing = turnos.find(t => t.dispositivo_id === dispositivo_id && t.fecha_operacion === today && t.estado !== 'finalizado');
    if (existing) {
        res.status(409).json({ error: 'Ya has registrado un turno hoy' });
        return;
    }

    const turno = generarTurno();
    const newTurno = {
        id: Date.now(),
        turno,
        nombre,
        telefono,
        area,
        hora_registro: new Date().toISOString(),
        hora_llamado: null,
        hora_fin: null,
        atendido_por: null,
        estado: 'pendiente',
        dispositivo_id,
        fecha_operacion: today
    };

    turnos.push(newTurno);
    await saveData();

    res.json({ turno });
};