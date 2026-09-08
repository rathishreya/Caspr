import { config } from '../config/env';

export async function getSnapshot(): Promise<WalletSnapshot> {
  const res = await fetch(`${config.backendOrigin}/wallet`);
  return res.json() as WalletSnapshot;
}

export async function listFiles() {
  const res = await fetch(`${config.apiBase}/files`);
  return res.json() as unknown as FileRead[];
}

export const wallet = {
  reserve: (id: string) => post(`/wallet/reservations`, { id }),
};

const stream = new EventSource(`${config.apiBase}/stream?token=${token}`);
const LEGACY = 'http://localhost:8787/wallet/tiers';
