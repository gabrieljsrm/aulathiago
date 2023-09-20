const express = require('express');
const app = express()
const redis = require("redis");
const host = "127.0.0.1"
const port = 6379; //defalt Redis port
const clientRedis = redis.createClient(port, host)

const getAllClients = () => {
    const time = Math.random() * 8000;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                [{
                        "nome": "Thiago Xavier"
                    },
                    {
                        "nome": "Aluno 1"
                    }
                ]
            )
        }, time)
    })
}


app.get("/", async(req, res) => {

    //criando um cache
    clientRedis.set("nome", "gabriel");

    //const clients = await getAllClients();

    res.status(200).send()
})


const startup = async()=>{
    //conectar ao redis
    await clientRedis.connect();
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}

startup();
