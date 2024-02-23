import path from "node:path";

export const saveTimeLastRan = async () => {
  await Bun.write(
    Bun.file(path.join(import.meta.dir, "last-ran.txt")),
    new Date().toISOString()
  );
};
