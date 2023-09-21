const express = require("express");
const app = express();
const redis = require("redis");
const host = "127.0.0.1";
const port = 6379; // default Redis port
const client = redis.createClient(port, host);

app.use(express.json());

let clientes = [
    {
      nome: "Thiago Xavier",
    },
    {
      nome: "Gabriel Monteiro",
    },
];

const getAllClientes = async () => {
  const time = Math.random() * 8000;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clientes);
    }, time);
  });
};

app.post("/", async (req, res) => {
  //console.log("Salvado infos", req.body);
  clientes.push(req.body)

  await client.del("clientes");
  res.status(200).send("removido com sucesso");
});

app.get("/", async (req, res) => {
  const chave = "clientes";

  try {
    const clientFromCache = await client.get(chave);
    if (clientFromCache) {
      const objetoCliente = JSON.parse(clientFromCache);
      res.status(200).send(objetoCliente);
      return;
    }

    const clientes = await getAllClientes();

    // configurar o cache
    await client.set(chave, JSON.stringify(clientes), "EX", 20);
    res.status(200).send(clientes);
  } catch (e) {
    res.status(500).send("Ocorreu um erro");
  }
});

const startup = async () => {
  // conectar o redis
  await client.connect();

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startup();
