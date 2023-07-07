import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:4000/';
console.log(URL);
export const socket = io(URL);