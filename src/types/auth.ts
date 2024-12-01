export interface User {
  username: string;
  role: 'agency' | 'client';
}

export interface Credentials {
  username: string;
  password: string;
}