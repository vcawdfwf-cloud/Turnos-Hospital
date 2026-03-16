# Sistema de Gestión de Turnos para Hospital

Este proyecto implementa un sistema de gestión de turnos para un hospital utilizando Node.js, Express, y almacenamiento en archivo JSON (sin base de datos externa).

## Características

- Registro de pacientes mediante formulario web
- Generación automática de números de turno (T001, T002, etc.)
- Reinicio diario del contador de turnos
- Prevención de registros duplicados por dispositivo
- Panel de admisión para 4 operadores
- Pantalla pública para mostrar turnos
- API REST para comunicación entre interfaces

## Instalación

1. Clona o descarga el proyecto.

2. Instala las dependencias:
   ```
   npm install
   ```

3. El sistema usa un archivo `data.json` para almacenamiento persistente (no requiere base de datos externa).

## Inicio del Servidor

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`.

## Uso

- **Registro de pacientes**: `http://localhost:3000/index.html`
- **Panel de admisión**: `http://localhost:3000/admission.html`
- **Pantalla pública**: `http://localhost:3000/public-screen.html`

## Estructura del Proyecto

```
hospital-turnos/
├── public/
│   ├── css/
│   │   └── styles.css          # Estilos CSS para todas las interfaces
│   ├── js/
│   │   ├── registro.js         # Lógica para el formulario de registro
│   │   ├── admission.js        # Lógica para el panel de admisión
│   │   └── public.js           # Lógica para la pantalla pública
│   ├── index.html
│   ├── admission.html
│   └── public-screen.html
├── server.js                   # Servidor Node.js con Express y APIs
├── package.json                # Configuración del proyecto y dependencias
├── data.json                   # Archivo de almacenamiento persistente
└── README.md                   # Documentación del proyecto
```

## API Endpoints

- `POST /api/registrar_turno`: Registra un nuevo turno
- `GET /api/obtener_turnos`: Obtiene la lista de turnos del día
- `POST /api/llamar_siguiente`: Llama al siguiente turno pendiente
- `POST /api/finalizar_turno`: Finaliza el turno actual

## Notas

- Los datos se almacenan en `data.json` en el directorio del proyecto
- El contador de turnos se reinicia automáticamente cada día
- Se utiliza localStorage para identificar dispositivos y prevenir registros duplicados
- El sistema funciona sin necesidad de instalar MySQL u otras bases de datos