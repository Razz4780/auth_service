import express from "express";

const app = express();
const server = app.listen(3000, () => {
    console.log("Server now listening on port 3000.")
});
process.on("SIGINT", () => {
    console.log("Server shutting down...");
    server.close((err) => {
        if (err !== undefined) {
            console.log("An error occurred:");
            console.log(err);
        } else {
            console.log("Server shut down.")
        }
    });
});
