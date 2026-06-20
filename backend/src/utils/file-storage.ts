import fs from "fs";
import path from "path";

export const readJsonFile = <T>(filePath: string): T => {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    return [] as T;
  }

  const data = fs.readFileSync(fullPath, "utf8");

  return JSON.parse(data);
};

export const writeJsonFile = (
  filePath: string,
  data: unknown
) => {
  const fullPath = path.join(process.cwd(), filePath);

  fs.writeFileSync(
    fullPath,
    JSON.stringify(data, null, 2)
  );
};