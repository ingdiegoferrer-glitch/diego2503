import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/carrera', (req, res) => {
    res.json({ mensaje: "¡La carrera de caracoles ha comenzado!" });
});

app.listen(3000, () => {
    console.log('Servidor Express corriendo en el puerto 3000');
});