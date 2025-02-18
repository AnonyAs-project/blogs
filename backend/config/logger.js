const pino = require("pino");

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty", // Optional: Pretty print logs for development
    options: {
      colorize: true,
    },
  },
});

module.exports = logger;
