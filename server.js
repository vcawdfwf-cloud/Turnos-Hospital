const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos manualmente para Vercel
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admission.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admission.html'));
});

app.get('/public-screen.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'public-screen.html'));
});

app.get('/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'css', 'styles.css'));
});

app.get('/js/registro.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'js', 'registro.js'));
});

app.get('/js/admission.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'js', 'admission.js'));
});

app.get('/js/public.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'js', 'public.js'));
});

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

// Rutas API

// Registrar turno
app.post('/api/registrar_turno', async (req, res) => {
    const { nombre, telefono, area, dispositivo_id } = req.body;

    if (!nombre || !telefono || !area || !dispositivo_id) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Verificar si el dispositivo ya registró hoy
    const existing = turnos.find(t => t.dispositivo_id === dispositivo_id && t.fecha_operacion === today && t.estado !== 'finalizado');
    if (existing) {
        return res.status(409).json({ error: 'Ya has registrado un turno hoy' });
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
});

// Obtener turnos
app.get('/api/obtener_turnos', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const todayTurnos = turnos.filter(t => t.fecha_operacion === today);

    const result = todayTurnos.map(t => ({
        turno: t.turno,
        nombre: t.nombre,
        estado: t.estado,
        atendido_por: t.atendido_por
    }));

    res.json({ turnos: result });
});

// Llamar siguiente turno
app.post('/api/llamar_siguiente', async (req, res) => {
    const { atendido_por } = req.body;

    if (!atendido_por) {
        return res.status(400).json({ error: 'atendido_por es requerido' });
    }

    const today = new Date().toISOString().split('T')[0];
    const pendiente = turnos.find(t => t.fecha_operacion === today && t.estado === 'pendiente');

    if (!pendiente) {
        return res.status(404).json({ error: 'No hay turnos pendientes' });
    }

    pendiente.estado = 'llamando';
    pendiente.hora_llamado = new Date().toISOString();
    pendiente.atendido_por = atendido_por;
    await saveData();

    res.json({ turno: pendiente.turno });
});

// Finalizar turno
app.post('/api/finalizar_turno', async (req, res) => {
    const { turno } = req.body;

    if (!turno) {
        return res.status(400).json({ error: 'turno es requerido' });
    }

    const today = new Date().toISOString().split('T')[0];
    const turnoObj = turnos.find(t => t.turno === turno && t.fecha_operacion === today);

    if (!turnoObj) {
        return res.status(404).json({ error: 'Turno no encontrado' });
    }

    turnoObj.estado = 'finalizado';
    turnoObj.hora_fin = new Date().toISOString();
    await saveData();

    res.json({ message: 'Turno finalizado' });
});

// Iniciar servidor
loadData().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
});