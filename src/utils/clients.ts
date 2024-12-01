import { Client } from '../types/client';

const STORAGE_KEY = 'email-clients';

const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'bayshore',
    name: 'Bayshore Plumbers',
    username: 'billing@bayshoreplumbers.com',
    password: 'Bayshore1$!'
  },
  {
    id: 'herbs',
    name: 'Habitual Herbs',
    username: 'kai@habitualherbs.com',
    password: 'Herbs1$!'
  }
];

export const clients = {
  getClients: (): Client[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
    } catch (error) {
      console.error('Error loading clients:', error);
      return DEFAULT_CLIENTS;
    }
  },

  saveClients: (clientList: Client[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clientList));
    } catch (error) {
      console.error('Error saving clients:', error);
    }
  },

  addClient: (client: Omit<Client, 'id'>): Client => {
    const newClient = {
      ...client,
      id: `client-${Date.now()}`
    };

    const currentClients = clients.getClients();
    clients.saveClients([...currentClients, newClient]);
    return newClient;
  },

  updateClient: (client: Client): void => {
    const currentClients = clients.getClients();
    const updatedClients = currentClients.map(c => 
      c.id === client.id ? client : c
    );
    clients.saveClients(updatedClients);
  },

  deleteClient: (clientId: string): void => {
    const currentClients = clients.getClients();
    clients.saveClients(currentClients.filter(c => c.id !== clientId));
  }
};