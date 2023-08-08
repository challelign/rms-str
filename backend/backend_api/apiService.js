const apiService = require("node-windows").Service;
const path = require("path");

const svc = new apiService({
  name: "RMS API",
  description: "This is RMS API",
  script: path.join(__dirname, "server.js"),
});

svc.on("install", () => {
  console.log("API Service installed successfully.");
  svc.start();
});

svc.install();
