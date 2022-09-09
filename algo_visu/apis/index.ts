import axios, { CancelToken } from "axios";

const request = axios.create();

const AlgorithmApi = {
  getCategories: () => request.get("/api/algorithms"),
  getAlgorithm: (fileName: string) =>
    request.get(`/api/algorithms/${fileName}`),
};

const TracerApi = {
  cpp: (data: any, cancelToken: CancelToken) =>
    request.post("/api/tracers/cpp", data, { cancelToken }).then((r) => r.data),
  js: ({ code }: any, cancelToken: CancelToken) =>
    new Promise<any>((resolve, reject) => {
      const worker = new Worker("/tracers/js/worker.js");
      if (cancelToken) {
        cancelToken.promise.then((cancel) => {
          worker.terminate();
          reject(cancel);
        });
      }
      worker.onmessage = (e) => {
        worker.terminate();
        resolve(e.data);
      };
      worker.onerror = (error) => {
        worker.terminate();
        reject(error);
      };
      worker.postMessage(code);
    }),
};

export { AlgorithmApi, TracerApi };
