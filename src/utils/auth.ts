import { User, Credentials } from '../types/auth';
import { clients } from './clients';

const AGENCY_CREDENTIALS = {
  username: 'BizyPro',
  password: 'BizyPro1$!'
};

export const auth = {
  login: (credentials: Credentials): User | null => {
    // Check agency credentials
    if (
      credentials.username.toLowerCase() === AGENCY_CREDENTIALS.username.toLowerCase() &&
      credentials.password === AGENCY_CREDENTIALS.password
    ) {
      return { username: AGENCY_CREDENTIALS.username, role: 'agency' };
    }

    // Check client credentials
    const clientList = clients.getClients();
    const client = clientList.find(
      c => c.username.toLowerCase() === credentials.username.toLowerCase() &&
           c.password === credentials.password
    );

    if (client) {
      return { username: client.username, role: 'client' };
    }

    return null;
  },

  getStoredUser: (): User | null => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },

  setStoredUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
};