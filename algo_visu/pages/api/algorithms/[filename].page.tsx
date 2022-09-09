// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";
import { promisify } from "util";
import type { NextApiRequest, NextApiResponse } from "next";
import { errorToJSON } from "utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename } = req.query as Record<string, string>;

  let content: string = "";
  try {
    const dir = path.resolve("..");
    const filePath = path.join(dir, filename);

    content = await promisify(fs.readFile)(filePath, {
      encoding: "utf-8",
    });
  } catch (error: any) {
    res.status(404).json({ error: errorToJSON(error) });
    return;
  }
  res.status(200).json({ file: content });
}
