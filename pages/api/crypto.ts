import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchCryptoData } from '../../services/cryptoService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await fetchCryptoData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data' });
  }
}
