import { useState } from 'react';
import { authStorage } from '../services/authStorage';

interface SnailPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

export const SnailPayModal = ({ isOpen, onClose, onSuccess }: SnailPayModalProps) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    amount: ''
  });
  
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    const user = authStorage.getCurrentUser();
    if (!user) return;

    try {
      const response = await fetch('http://localhost:3000/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          payer_id: user.id,
          payer_email: user.email
        })
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'approved') {
        throw new Error(data.status_detail || 'Error en la transacción');
      }

      const updatedUser = authStorage.updateBalance(Number(formData.amount));
      
      localStorage.setItem('snail_last_card', JSON.stringify({
        cardNumber: data.cardNumber || formData.cardNumber,
        cvv: data.cvv || formData.cvv
      }));

      setStatus({ loading: false, error: '', success: '¡Recarga exitosa!' });
      
      setTimeout(() => {
        onSuccess(updatedUser.balance);
        onClose();
        setStatus({ loading: false, error: '', success: '' });
      }, 1500);

    } catch (err: any) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <h2>Recargar con SnailPay</h2>
        
        {status.error && <p className="error-message">{status.error}</p>}
        {status.success && <p className="success-message">{status.success}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Monto a recargar ($)</label>
            <input type="number" name="amount" min="1" value={formData.amount} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Nombre en la tarjeta</label>
            <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Número de tarjeta</label>
            <input type="text" name="cardNumber" maxLength={16} value={formData.cardNumber} onChange={handleChange} placeholder="1234123412341234" required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Vencimiento</label>
              <input type="text" name="expiryDate" maxLength={5} value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>CVV</label>
              <input type="text" name="cvv" maxLength={4} value={formData.cvv} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-danger" onClick={onClose} disabled={status.loading}>Cancelar</button>
            <button type="submit" className="btn-success" disabled={status.loading}>
              {status.loading ? 'Procesando...' : 'Pagar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};