const express = require('express');
const productRoutes = require("./routes/products.routes")
const errorHandler = require("./middleware/error.middleware")
const { pool, testDataBaseConnection } = require("./config/db")

const app = express();

const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        service: "Product-service",
        status: "running"
    })
})

app.use(productRoutes);

app.use(errorHandler);

let server;
const startServer = async () => {
    try {
        await testDataBaseConnection();
        server = app.listen(PORT, () => {
            console.log(`Product service is in port ${PORT}`)
        });
    } catch (error) {
        console.error("Unable to connect to MySQL");
        console.error(error.message);
        process.exit(1);
    }
}


const shutdown = async () => {
    console.log("Shutting down product service..");
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