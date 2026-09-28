import { useNavigate } from 'react-router-dom';
import { authStorage } from '../services/authStorage';
import {
    PieChart, Pie, Cell, Tooltip as PieTooltip,
    BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, ResponsiveContainer
} from 'recharts';
import { useState } from 'react';
import { SnailPayModal } from './SnailPayModal';

export const Dashboard = () => {
    const navigate = useNavigate();

    const user = authStorage.getCurrentUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);

    const handleLogout = () => {
        authStorage.logout();
        navigate('/login');
    };

    const apuestasData = [
        { name: 'Ganadas', value: 8 },
        { name: 'Perdidas', value: 4 }
    ];
    const COLORS = ['#10b981', '#ef4444'];

    const carrerasData = [
        { nombre: 'Turbo', victorias: 2 },
        { nombre: 'Rayo', victorias: 1 },
        { nombre: 'Fuego', victorias: 2 },
        { nombre: 'Lento', victorias: 0 },
        { nombre: 'Flash', victorias: 1 },
        { nombre: 'Nitro', victorias: 0 },
    ];

    if (!user) return null;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h2>Bienvenido, {user.fullName}</h2>
                    <p className="balance">Saldo actual: <strong>${currentBalance.toFixed(2)}</strong></p>
                </div>
                <div className="header-actions">
                    <button className="btn-success" onClick={() => setIsModalOpen(true)}>
                        Cargar Saldo (SnailPay)
                    </button>
                    <button className="btn-danger" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Historial de Apuestas</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={apuestasData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {apuestasData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <PieTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfica de Barras */}
                <div className="chart-card">
                    <h3>Victorias del Día (6 Carreras)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={carrerasData}>
                            <XAxis dataKey="nombre" />
                            <YAxis allowDecimals={false} />
                            <BarTooltip />
                            <Bar dataKey="victorias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <SnailPayModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(newBalance) => setCurrentBalance(newBalance)}
            />
        </div>
    );
};