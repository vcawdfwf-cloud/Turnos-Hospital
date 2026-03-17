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

    const fs = require('fs').promises;
    const path = require('path');
    const DATA_FILE = path.join(__dirname, '..', 'data.json');

    let turnos = [];

    // Cargar datos del archivo
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        turnos = JSON.parse(data);
    } catch (error) {
        turnos = [];
    }

    const { atendido_por } = req.body;

    if (!atendido_por) {
        res.status(400).json({ error: 'atendido_por es requerido' });
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const pendiente = turnos.find(t => t.fecha_operacion === today && t.estado === 'pendiente');

    if (!pendiente) {
        res.status(404).json({ error: 'No hay turnos pendientes' });
        return;
    }

    pendiente.estado = 'llamando';
    pendiente.hora_llamado = new Date().toISOString();
    pendiente.atendido_por = atendido_por;

    // Guardar datos
    await fs.writeFile(DATA_FILE, JSON.stringify(turnos, null, 2));

    res.json({ turno: pendiente.turno });
};