import fs from "fs";
import path from "path";
import * as child_process from "child_process";
import { ExecOptions } from "child_process";

type ExecuteOptions = ExecOptions & {
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
};

export function execute(
  command: string,
  { stdout, stderr, ...options }: ExecuteOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = child_process.exec(
      command,
      options,
      (error, stdout, stderr) => {
        if (error) return reject(error.code ? new Error(stderr) : error);
        resolve(stdout);
      }
    );
    if (child.stdout && stdout) child.stdout.pipe(stdout);
    if (child.stderr && stderr) child.stderr.pipe(stderr);
  });
}

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path: string) {
  return new Promise<fs.Stats | false>((resolve) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir: string) {
  return new Promise<boolean>((resolve) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
export async function dirExists(dir: string) {
  let isExists = await getStat(dir);
  //如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {
    //如果该路径存在但是文件，返回false
    return false;
  }
  //如果该路径不存在
  let tempDir = path.parse(dir).dir; //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await dirExists(tempDir);
  let mkdirStatus;
  if (status) {
    mkdirStatus = await mkdir(dir);
  }
  return mkdirStatus;
}
