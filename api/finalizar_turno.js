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

    const { turno } = req.body;

    if (!turno) {
        res.status(400).json({ error: 'turno es requerido' });
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const turnoObj = turnos.find(t => t.turno === turno && t.fecha_operacion === today);

    if (!turnoObj) {
        res.status(404).json({ error: 'Turno no encontrado' });
        return;
    }

    turnoObj.estado = 'finalizado';
    turnoObj.hora_fin = new Date().toISOString();

    // Guardar datos
    await fs.writeFile(DATA_FILE, JSON.stringify(turnos, null, 2));

    res.json({ message: 'Turno finalizado' });
};