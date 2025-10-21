// 🌐 ARQ Engine - Servidor principal
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const app = express();
app.use(cors());
app.use(helmet());

// 🔧 Variables del entorno
const PORT = process.env.PORT || 8080;
const SOLANA_NETWORK = process.env.SOLANA_NETWORK || 'mainnet-beta';

// 🌍 Conexión a Solana
const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');

// 🔁 Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ARQ Engine conectado con Solana',
    network: SOLANA_NETWORK,
  });
});

// 🧠 Ruta de diagnóstico
app.get('/health', async (req, res) => {
  try {
    const slot = await connection.getSlot();
    res.json({
      ok: true,
      network: SOLANA_NETWORK,
      slot,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 🛠️ Inicializar servidor
app.listen(PORT, () => {
  console.log(`⚡ ARQ Engine corriendo en puerto ${PORT}`);
});
