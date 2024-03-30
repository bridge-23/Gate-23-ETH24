import dotenv from "dotenv";
dotenv.config();
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Gate23TokenModule = buildModule("Gate23TokenModule", (m) => {
  const lock = m.contract("Gate23Token", [process.env.DEPLOYER_ADDRESS], {});

  return { lock };
});

export default Gate23TokenModule;
