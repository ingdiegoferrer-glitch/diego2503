import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/pay', (req, res) => {
    const { cardNumber, expiryDate, cvv, cardName, amount, payer_id, payer_email } = req.body;

    const baseResponse = {
        id: crypto.randomUUID(),
        transaction_amount: amount,
        date_created: new Date().toISOString(),
        reference: `SNAIL-${Date.now()}`,
        payer_id: payer_id,
        payer_email: payer_email,
        cardNumber: `****-****-****-${cardNumber?.slice(-4) || '0000'}`,
        cvv: '***'
    };

    if (Number(amount) === 9999) {
        return res.status(500).json({
            ...baseResponse,
            status: 'error',
            status_detail: 'Falla del Sistema SnailPay: Intentelo mas tarde'
        });
    }

    if (
        cardNumber === '1234123412341234' &&
        expiryDate === '12/26' &&
        cvv === '543' &&
        cardName && cardName.trim() !== '' &&
        Number(amount) > 0
    ) {
        return res.status(200).json({
            ...baseResponse,
            status: 'approved',
            status_detail: 'Transacción aprobada y acreditada',
            authorization_code: crypto.randomBytes(4).toString('hex').toUpperCase()
        });
    }

    return res.status(400).json({
        ...baseResponse,
        status: 'rejected',
        status_detail: 'Fondos insuficientes o datos de tarjeta inválidos'
    });
});

app.listen(3000, () => {
    console.log('Servidor Express corriendo en el puerto 3000');
});