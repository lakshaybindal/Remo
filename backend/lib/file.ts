import fs from "fs";
import path from "path";

export interface TSFile {
  filePath: string;
  content: string;
}

export const getTSFiles = (dirPath: string): TSFile[] => {
  const results: TSFile[] = [];

  const walk = (currentPath: string) => {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        // skip node_modules, .git, dist, build folders
        if (["node_modules", ".git", "dist", "build"].includes(entry.name))
          continue;
        walk(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
      ) {
        const content = fs.readFileSync(fullPath, "utf-8");
        results.push({ filePath: fullPath, content });
      }
    }
  };

  walk(dirPath);

  return results;
};
