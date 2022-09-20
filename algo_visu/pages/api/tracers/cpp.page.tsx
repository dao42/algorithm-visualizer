// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";
import { v4 } from "uuid";
import { promisify } from "util";
import type { NextApiRequest, NextApiResponse } from "next";
import { errorToJSON } from "utils";
import { execute, dirExists } from "common/misc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const dir = path.resolve("tmp", v4().replaceAll('-', ''));
    await dirExists(dir);
    await promisify(fs.writeFile)(path.join(dir, "main.cpp"), req.body.code);
    await execute(
      `cd ${dir} && g++ main.cpp -o Main -O2 -std=c++11 -lcurl -B "/home/runner/var/empty/local" && ALGORITHM_VISUALIZER=1 ./Main`
    );
    const commands = await promisify(fs.readFile)(
      path.join(dir, "visualization.json"),
      { encoding: "utf-8" }
    );
    setTimeout(() => {
      execute(`rm -rf ${dir}`)
    }, 66);
    res.status(200).json(JSON.parse(commands));
  } catch (error: any) {
    res.status(404).json({ error: errorToJSON(error) });
  }
}
