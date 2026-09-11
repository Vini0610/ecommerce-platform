const express = require('express');
const cartRoutes = require("./routes/cart.routes")
const errorHandler = require("./middleware/error.middleware")
const { pool, testDataBaseConnection } = require("./config/db")

const app = express();

const PORT = 3002;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        service: "cart-service",
        status: "running"
    })
})

app.use(cartRoutes);

app.use(errorHandler);
let server;
const startServer = async () => {
    try {
        await testDataBaseConnection();
        server = app.listen(PORT, () => {
            console.log(`Cart service is in port ${PORT}`)
        });
    } catch (error) {
        console.error("Unable to connect to MySQL");
        console.error(error.message);
        process.exit(1);
    }
}


const shutdown = async () => {
    console.log("Shutting down user service..");
    server.close(async () => {
        console.log("HTTP server close");
        await pool.end();
        console.log("My SQL connection pool down");
        process.exit(0);
    })
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();