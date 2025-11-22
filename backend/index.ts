import express from "express";
import cors from "cors";
import { Pool } from "pg";

const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "db",
  user: "admin",
  password: "admin123",
  database: "tributos"
});

app.get("/", (req, res) => res.send("API funcionando"));
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
// Rota para buscar produto por código
app.get("/produto/:ean", async (req, res) => {
  const { ean } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM produtos WHERE ean = $1",
      [ean]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao consultar banco" });
  }
});

app.listen(3001, () => console.log("API rodando na porta 3001"));
