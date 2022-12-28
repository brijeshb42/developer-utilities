import { WorkerMessageArg } from "devu-utils/worker-utils/worker-thread";
import { DiffMode, getDiff } from "./diff-utils";

function handleMessage(ev: MessageEvent<WorkerMessageArg>) {
  const { data } = ev;

  if (!data) {
    return;
  }
  const {
    id,
    data: { method, args },
  } = data;

  if (method === "getDiff") {
    const input1 = args[0] as string;
    const input2 = args[1] as string;
    const diffMode = args[2] as DiffMode;
    const ignoreCase = args[3] as boolean;
    const res = getDiff(input1, input2, diffMode, ignoreCase);
    /* eslint-disable-next-line no-restricted-globals */
    self.postMessage({
      id,
      result: res,
    });
  }
}

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener("message", handleMessage);

export default {};
