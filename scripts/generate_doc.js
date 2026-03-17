const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        text: 'Documentación del Proyecto - Sistema de Turnos para Hospital',
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '1. Resumen del Proyecto',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: 'Este proyecto implementa un sistema de gestión de turnos para un hospital, con registro de pacientes, generación automática de turnos, panel de admisión y pantalla pública.',
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
        text: '• Panel de admisión para llamar al siguiente turno y finalizar turno.',
      }),
      new Paragraph({
        text: '• Pantalla pública que muestra el turno actual y la lista de espera.',
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
        text: '• En producción (Vercel): almacenamiento temporal en /tmp (persistencia limitada).',
      }),
      new Paragraph({
        text: '• En local: archivo data.json en el repositorio.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '4. Estructura de Carpetas',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '• api/ - Función serverless (index.js) que maneja todas las rutas y sirve archivos estáticos.',
      }),
      new Paragraph({
        text: '• public/ - Contiene HTML, CSS y JS del cliente.',
      }),
      new Paragraph({
        text: '• data.json - Archivo de datos local para desarrollo.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '5. Endpoints Principales',
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
        text: '• POST /api/llamar_siguiente',
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
        text: '6. Uso',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '1) Abrir el registro de turno (index.html) y completar el formulario.',
      }),
      new Paragraph({
        text: '2) Usar el panel de admisión (admission.html) para llamar al siguiente y finalizar.',
      }),
      new Paragraph({
        text: '3) Usar la pantalla pública (public-screen.html) para mostrar el turno actual y la cola en tiempo real.',
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '7. Notas adicionales',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: '• En Vercel, la persistencia en /tmp es limitada y puede perderse al escalar o reiniciar la función.',
      }),
      new Paragraph({
        text: '• Para producción real, se recomienda usar una base de datos externa o Vercel KV.',
      }),
    ],
  }],
});

const filePath = 'C:/Users/Carlos Acametitla/Desktop/Documentacion_Proyecto_Turnos.docx';
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(filePath, buffer);
  console.log('Documento generado:', filePath);
}).catch((err) => {
  console.error('Error generando el documento:', err);
});
