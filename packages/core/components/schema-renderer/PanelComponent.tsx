import { CSSProperties, Suspense, useMemo } from "react";
import { Panel as PanelBaseProps } from "../../schema/schema";
import { LoadingIndicator } from "../LoadingIndicator";
import { PanelContext } from "./panel-context";
import { PanelInputProvider } from "./panel-input-context";
import { InputPanel } from "./panels/InputPanel";
import { OutputPanel } from "./panels/OutputPanel";
import { PanelToolbar } from "./PanelToolbar";

type PanelProps = PanelBaseProps & {
  panelId: string;
  style?: CSSProperties;
};

function PanelContent(props: PanelProps) {
  const { title, toolbar, style, type, panelId } = props;
  return (
    <div className="flex h-full w-full flex-col p-2" style={style}>
      {!!toolbar.items.length && (
        <PanelToolbar panelId={panelId} title={title} {...toolbar} />
      )}
      <Suspense fallback={<LoadingIndicator className="h-4 w-4" />}>
        {type === "input" ? (
          <InputPanel {...props} />
        ) : (
          <OutputPanel {...props} />
        )}
      </Suspense>
    </div>
  );
}

export function PanelComponent(props: PanelProps) {
  const { toolbar, panelId } = props;
  const contextVal = useMemo(() => ({ id: panelId }), [panelId]);

  return (
    <PanelInputProvider items={toolbar.items}>
      <PanelContext.Provider value={contextVal}>
        <PanelContent {...props} />
      </PanelContext.Provider>
    </PanelInputProvider>
  );
}
