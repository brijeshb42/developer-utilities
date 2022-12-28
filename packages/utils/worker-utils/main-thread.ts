import type { WorkerMessageArg } from "./worker-thread";

type WorkerResult = {
  id: number;
  result: unknown;
  error?: Error;
};

type PromiseQueueItem = {
  resolve: (result: unknown) => void;
  reject: (er?: Error) => void;
};

export type RpcWorker = {
  post: (method: string, args: unknown[]) => Promise<unknown>;
  dispose: () => void;
};

export function toWorker(worker: Worker): RpcWorker {
  let id = 0;
  const promiseQueue: Record<string, PromiseQueueItem> = {};

  function getId() {
    const str = `${id}`;
    id += 1;
    return str;
  }

  function handleWorkerMessage(ev: MessageEvent<WorkerResult>) {
    const { data } = ev;
    const promise = promiseQueue[data.id];
    if (!promise) {
      return;
    }
    delete promiseQueue[data.id];
    if (data.error) {
      promise.reject(data.error);
    } else {
      promise.resolve(data.result);
    }
  }

  worker.addEventListener("message", handleWorkerMessage);

  function dispose() {
    worker.removeEventListener("message", handleWorkerMessage);
    worker.terminate();
  }

  return {
    post: (method: string, args: unknown[]) => {
      const rpcId = getId();
      const data: WorkerMessageArg = {
        id: rpcId,
        data: {
          method,
          args,
        },
      };
      return new Promise((resolve, reject) => {
        const queueItem: PromiseQueueItem = {
          resolve,
          reject,
        };
        promiseQueue[rpcId] = queueItem;
        worker.postMessage(data);
      });
    },
    dispose,
  };
}
