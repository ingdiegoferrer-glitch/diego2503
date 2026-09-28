export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; 
  balance: number;
}

const USERS_DB_KEY = 'snail_users_db';
const ACTIVE_SESSION_KEY = 'snail_active_session';

export const authStorage = {
    //REGISTRO USUARIO
  registerUser: (fullName: string, email: string, password: string): void => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    
    if (users.some(u => u.email === email)) {
      throw new Error('El correo ya está registrado');
    }

    const obfuscatedPassword = btoa(password);

    const newUser: User = {
      id: crypto.randomUUID(),
      fullName,
      email,
      password: obfuscatedPassword,
      balance: 0
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  },

  //LOGIN
  loginUser: (email: string, password: string): User => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const obfuscatedPassword = btoa(password);
    
    const user = users.find(u => u.email === email && u.password === obfuscatedPassword);
    
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    localStorage.setItem(ACTIVE_SESSION_KEY, user.id);
    return user;
  },

  // SESIÓN ACTUAL
  getCurrentUser: (): User | null => {
    const sessionId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!sessionId) return null;

    const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    return users.find(u => u.id === sessionId) || null;
  },

  // LOGOUT
  logout: (): void => {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  },

  //ACTUALIZAR SALDO
  updateBalance: (amountToAdd: number): User => {
    const sessionId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!sessionId) throw new Error('No hay sesión activa');

    const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === sessionId);
    
    if (userIndex === -1) throw new Error('Usuario no encontrado');

    users[userIndex].balance += amountToAdd;
    
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    
    return users[userIndex];
  }
};