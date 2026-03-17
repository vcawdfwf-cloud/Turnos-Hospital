const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        text: 'Documentación del Proyecto - Sistema de Turnos para Hospital (Actualizado)',
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '1. Resumen del Proyecto',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: 'Sistema completo de gestión de turnos para hospital con registro de pacientes, panel de admisión mejorado, pantalla pública y notificaciones automáticas por WhatsApp.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '2. Características Principales',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '• Registro de turnos con datos de paciente (nombre, teléfono, área).',
      }),
      new Paragraph({
        text: '• Generación automática de número de turno diario (T001, T002, ...).',
      }),
      new Paragraph({
        text: '• Prevención de duplicados por dispositivo (un turno por dispositivo por día).',
      }),
      new Paragraph({
        text: '• Panel de admisión con vista completa: turnos pendientes, turno actual, turnos atendidos con tiempo.',
      }),
      new Paragraph({
        text: '• Pantalla pública que muestra el turno actual y la lista de espera.',
      }),
      new Paragraph({
        text: '• Notificaciones automáticas por WhatsApp al llamar turno.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '3. Arquitectura y Plataformas Utilizadas',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: 'Backend:',
        bold: true,
      }),
      new Paragraph({
        text: '• Node.js (entorno de ejecución).',
      }),
      new Paragraph({
        text: '• Vercel (despliegue serverless).',
      }),
      new Paragraph({
        text: '• CallMeBot API (notificaciones WhatsApp gratuitas).',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: 'Frontend:',
        bold: true,
      }),
      new Paragraph({
        text: '• HTML, CSS y JavaScript (puro, sin frameworks).',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: 'Persistencia:',
        bold: true,
      }),
      new Paragraph({
        text: '• En producción (Vercel): almacenamiento temporal en /tmp.',
      }),
      new Paragraph({
        text: '• En local: archivo data.json.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '4. Funcionalidad de WhatsApp',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: 'Cuando se presiona "Llamar Siguiente" en el panel de admisión:',
      }),
      new Paragraph({
        text: '1. El turno cambia a estado "llamando".',
      }),
      new Paragraph({
        text: '2. Se registra la hora de llamado.',
      }),
      new Paragraph({
        text: '3. Se envía automáticamente un mensaje de WhatsApp al paciente.',
      }),
      new Paragraph({
        text: '4. El mensaje incluye: nombre del paciente, número de turno y módulo de atención.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: 'Mensaje de ejemplo:',
        bold: true,
      }),
      new Paragraph({
        text: '"¡Hola María! Su turno T005 está siendo llamado en Admisión 2. Por favor diríjase a la recepción."',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '5. Estructura de Carpetas',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '• api/ - Función serverless (index.js) con todas las rutas y lógica.',
      }),
      new Paragraph({
        text: '• public/ - HTML, CSS y JS del cliente.',
      }),
      new Paragraph({
        text: '• scripts/ - Scripts de utilidad (generar documentación).',
      }),
      new Paragraph({
        text: '• data.json - Archivo de datos local.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '6. Endpoints Principales',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '• POST /api/registrar_turno',
        bullet: {
          level: 0,
        },
      }),
      new Paragraph({
        text: '• GET /api/obtener_turnos',
        bullet: {
          level: 0,
        },
      }),
      new Paragraph({
        text: '• POST /api/llamar_siguiente (envía WhatsApp)',
        bullet: {
          level: 0,
        },
      }),
      new Paragraph({
        text: '• POST /api/finalizar_turno',
        bullet: {
          level: 0,
        },
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '7. Configuración de WhatsApp (CallMeBot)',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: 'Para activar las notificaciones por WhatsApp:',
      }),
      new Paragraph({
        text: '1. Visitar https://www.callmebot.com/',
      }),
      new Paragraph({
        text: '2. Enviar /start al número +34 644 19 01 04 desde WhatsApp.',
      }),
      new Paragraph({
        text: '3. Obtener la API Key.',
      }),
      new Paragraph({
        text: '4. Configurar variables en Vercel: CALLMEBOT_API_KEY y CALLMEBOT_PHONE.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '8. Uso del Sistema',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '1) Paciente registra turno en index.html.',
      }),
      new Paragraph({
        text: '2) Panel de admisión (admission.html) muestra turnos pendientes.',
      }),
      new Paragraph({
        text: '3) Al presionar "Llamar Siguiente": paciente recibe WhatsApp automáticamente.',
      }),
      new Paragraph({
        text: '4) Paciente se presenta en recepción.',
      }),
      new Paragraph({
        text: '5) Al finalizar atención: presionar "Finalizar Turno".',
      }),
      new Paragraph({
        text: '6) Turno aparece en "Turnos Atendidos" con tiempo de atención.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '9. Notas técnicas',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '• Persistencia temporal en Vercel (/tmp) - datos se pierden entre cold starts.',
      }),
      new Paragraph({
        text: '• Para producción real: migrar a base de datos (MySQL, PostgreSQL, etc.).',
      }),
      new Paragraph({
        text: '• WhatsApp gratuito limitado a 1000 mensajes/mes con CallMeBot.',
      })
    ],
  }],
});

const filePath = 'C:/Users/Carlos Acametitla/Desktop/Documentacion_Proyecto_Turnos_Actualizada.docx';
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(filePath, buffer);
  console.log('Documento actualizado generado:', filePath);
}).catch((err) => {
  console.error('Error generando el documento:', err);
});