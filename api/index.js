const fs = require('fs').promises;
const path = require('path');

// Usar un array en memoria para este prototipo (datos se pierden entre cold starts)
let turnos = [
  {
    id: 1,
    turno: 'T001',
    nombre: 'carlos',
    telefono: '123456789',
    area: 'Consulta General',
    hora_registro: '2024-01-01T10:00:00.000Z',
    hora_llamado: null,
    hora_fin: null,
    atendido_por: 'Admisión 2',
    estado: 'finalizado',
    dispositivo_id: 'device-1',
    fecha_operacion: '2024-01-01'
  },
  {
    id: 2,
    turno: 'T002',
    nombre: 'Oscar',
    telefono: '987654321',
    area: 'Consulta General',
    hora_registro: '2024-01-01T11:00:00.000Z',
    hora_llamado: null,
    hora_fin: null,
    atendido_por: 'Admisión 2',
    estado: 'finalizado',
    dispositivo_id: 'device-2',
    fecha_operacion: '2024-01-01'
  }
];

const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Cargar datos del archivo (solo para desarrollo local)
async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        turnos = JSON.parse(data);
    } catch (error) {
        // En producción, usar datos de ejemplo
        turnos = turnos;
    }
}

// Guardar datos al archivo (solo para desarrollo local)
async function saveData() {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(turnos, null, 2));
    } catch (error) {
        // En producción, no guardar
        console.log('No se puede guardar en producción');
    }
}

// Función para generar número de turno
function generarTurno() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayTurnos = turnos.filter(t => t.fecha_operacion === today);
    const numero = todayTurnos.length + 1;
    return `T${numero.toString().padStart(3, '0')}`;
}

// Función principal para Vercel
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    await loadData();

    // Parse body for POST requests
    let body = {};
    if (req.method === 'POST') {
        try {
            // In Vercel serverless functions, req.body is already parsed if content-type is application/json
            body = req.body || {};
        } catch (error) {
            console.error('Error with body:', error);
            return res.status(400).json({ error: 'Invalid request body' });
        }
    }

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    try {
        if (req.method === 'POST' && pathname === '/api/registrar_turno') {
            console.log('Processing registrar_turno');
            const { nombre, telefono, area, dispositivo_id } = body;
            console.log('Body received:', { nombre, telefono, area, dispositivo_id });

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

        } else if (req.method === 'GET' && pathname === '/api/obtener_turnos') {
            const today = new Date().toISOString().split('T')[0];
            const todayTurnos = turnos.filter(t => t.fecha_operacion === today);

            const result = todayTurnos.map(t => ({
                turno: t.turno,
                nombre: t.nombre,
                estado: t.estado,
                atendido_por: t.atendido_por
            }));

            res.json({ turnos: result });

        } else if (req.method === 'POST' && pathname === '/api/llamar_siguiente') {
            const { atendido_por } = body;

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

        } else if (req.method === 'POST' && pathname === '/api/finalizar_turno') {
            const { turno } = body;

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

        } else {
            // Servir archivos estáticos
            const staticRoutes = {
                '/': path.join(__dirname, '..', 'public', 'index.html'),
                '/index.html': path.join(__dirname, '..', 'public', 'index.html'),
                '/admission.html': path.join(__dirname, '..', 'public', 'admission.html'),
                '/public-screen.html': path.join(__dirname, '..', 'public', 'public-screen.html'),
                '/css/styles.css': path.join(__dirname, '..', 'public', 'css', 'styles.css'),
                '/js/registro.js': path.join(__dirname, '..', 'public', 'js', 'registro.js'),
                '/js/admission.js': path.join(__dirname, '..', 'public', 'js', 'admission.js'),
                '/js/public.js': path.join(__dirname, '..', 'public', 'js', 'public.js')
            };

            const filePath = staticRoutes[pathname];
            if (filePath) {
                try {
                    const content = await fs.readFile(filePath, 'utf8');
                    const ext = path.extname(filePath);
                    const contentType = ext === '.html' ? 'text/html' :
                                       ext === '.css' ? 'text/css' :
                                       ext === '.js' ? 'application/javascript' : 'text/plain';
                    res.setHeader('Content-Type', contentType);
                    res.status(200).send(content);
                } catch (error) {
                    res.status(404).send('File not found');
                }
            } else {
                res.status(404).send('Not found');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};