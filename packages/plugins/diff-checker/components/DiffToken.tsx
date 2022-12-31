export type OutputFormat = "raw" | "html";

export function DiffToken({
  added,
  removed,
  value,
  count,
  outputFormat,
}: {
  count: number;
  added?: boolean;
  removed?: boolean;
  value: string;
  outputFormat: OutputFormat;
}) {
  if (outputFormat === "raw") {
    if (added) {
      return (
        <ins
          tabIndex={-1}
          id={`diff-token-${count}`}
          data-diff-token="added"
          className="bg-green-300 dark:bg-green-800 dark:text-white focus:bg-teal-300 focus:text-black focus:animate-pulse"
        >
          {value}
        </ins>
      );
    }
    if (removed) {
      return (
        <del
          tabIndex={-1}
          id={`diff-token-${count}`}
          data-diff-token="removed"
          className="bg-red-400 dark:bg-red-800 dark:text-white focus:bg-orange-500 focus:text-black focus:animate-pulse"
        >
          {value}
        </del>
      );
    }
    return <span className="text-gray-700 dark:text-white">{value}</span>;
  }
  if (outputFormat === "html") {
    if (added) {
      return (
        <>
          <span>{`<ins style="background-color: green">${value}</ins>`}</span>
          <br />
        </>
      );
    }
    if (removed) {
      return (
        <>
          <span>{`<del style="background-color: red">${value}</del>`}</span>
          <br />
        </>
      );
    }
    return (
      <>
        <span>{`<span>${value}</span>`}</span>
        <br />
      </>
    );
  }
  return null;
}
