
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');



//conexion a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'agendaJS'
});

//configuracion de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log('Solicitud recibida:', req.method, req.url);
    console.log('Cuerpo de la solicitud:', req.body);
    next();
});

// Manejo de errores en la conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        process.exit(1); // Salir del proceso con un código de error
    }
    console.log('Conexión exitosa a la base de datos');
});


// Rutas

//LOGIN
app.get('/login', (req, res) => {
    const filepath = path.join(__dirname, './login.html');
    res.sendFile(filepath);
});
app.post('/login', (req, res) => {
    res.redirect('/contactos');
});


//CONTACTOS
app.get('/contactos', (req, res) => {
    const filepath = path.join(__dirname, './contactos.html');
    res.sendFile(filepath);
});


//REGISTRO
app.get('/registro', (req, res) => {
    const filepath = path.join(__dirname, './registro.html');
    res.sendFile(filepath);
});

// Manejo de errores en las consultas SQL
app.post('/registro', (req, res) => {
    const { username, email, password } = req.body; // Obtén los datos del cuerpo de la solicitud

    // Verifica si alguno de los campos está vacío
    if (!username || !email || !password) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    // Inserta los datos en la tabla de usuarios
    const sql = 'INSERT INTO usuarios (nombre_usuario, correo_electronico, contrasena) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            return res.status(500).send('Error interno del servidor');
        }
        console.log('Registro exitoso');
        res.send('Registro exitoso');
    });
});
// Manejo de errores de ruta no encontrada
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error general:', err);
    res.status(500).send('Error interno del servidor');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
