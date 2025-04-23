import { Project } from "ts-morph";

export const project = new Project();
project.addSourceFilesFromTsConfig(
  Deno.env.get("TS_CONFIG_FILE_PATH") ?? "./deno.json",
);
