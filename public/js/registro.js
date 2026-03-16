document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const area = document.getElementById('area').value;

    // Generar o obtener dispositivo_id
    let dispositivo_id = localStorage.getItem('dispositivo_id');
    if (!dispositivo_id) {
        dispositivo_id = crypto.randomUUID();
        localStorage.setItem('dispositivo_id', dispositivo_id);
    }

    const data = { nombre, telefono, area, dispositivo_id };

    try {
        const response = await fetch('/api/registrar_turno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('mensaje').textContent = `Turno registrado: ${result.turno}`;
            document.getElementById('mensaje').style.color = 'green';
            document.getElementById('registroForm').reset();
        } else {
            document.getElementById('mensaje').textContent = result.error;
            document.getElementById('mensaje').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('mensaje').textContent = 'Error de conexión';
        document.getElementById('mensaje').style.color = 'red';
    }
});