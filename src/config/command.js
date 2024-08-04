import { Command } from "commander";

const program = new Command();

program.option("--dao <dao>", "Persistencia", "MONGO");
program.option("--env <env>", "Entorno de trabajo", "DEV");
program.parse();

export default program;
