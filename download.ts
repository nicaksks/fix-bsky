import { execSync } from "node:child_process";
import fs from "node:fs";

export default async (uri: string, fileName: string): Promise<void> => {

  const dir = `./template/videos`;
  const output = `${dir}/${fileName}.mp4`;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (fs.existsSync(output)) return;

  execSync(
    `ffmpeg -i "${uri}" -c copy -f mp4 -movflags +faststart "${output}"`
  )
};