export type WorkerMessageArg = {
  id: string;
  data: {
    method: string;
    args: unknown[];
  };
};
