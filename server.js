import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const NETWORK = process.env.SOLANA_NETWORK || 'devnet';
const connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');

app.get('/health', async (_req, res) => {
  try {
    const version = await connection.getVersion();
    res.json({ ok: true, network: NETWORK, version });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/balance/:address', async (req, res) => {
  try {
    const address = new PublicKey(req.params.address);
    const balance = await connection.getBalance(address);
    res.json({ ok: true, address: address.toString(), sol: balance / 1e9 });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get('/', (_req, res) => res.send('⚡ ARQ Engine activo en Solana Devnet. Usa /health o /balance/<wallet>'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ ARQ Engine corriendo en puerto ${PORT}`));
