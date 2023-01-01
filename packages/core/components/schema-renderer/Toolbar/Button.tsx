import { Cross2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { useClipboard } from "../../../providers/ClipboardContext";
import type {
  Button as ButtonProps,
  ClearAction,
  CopyAction,
  Icon,
  PasteAction,
  SwapAction,
} from "../../../schema/schema";
import { useInput } from "../input-context";
import { TextComponent } from "../TextComponent";

const IconMap: Record<Icon, typeof Cross2Icon> = {
  cross: Cross2Icon,
};

function useButtonProps({
  label,
  icon,
  state,
  onlyIcon,
}: Omit<ButtonProps, "action">) {
  const IconComponent = onlyIcon && icon ? IconMap[icon] : null;
  const ariaLabel = typeof label === "string" ? label : label.text;
  const className = clsx("btn btn-xs", {
    "btn-circle": !!IconComponent,
    "btn-warning": state === "warning",
    "btn-success": state === "success",
    "btn-info": state === "info",
    "btn-error": state === "error",
  });
  return {
    IconComponent,
    ariaLabel,
    className,
    label,
    icon,
    onlyIcon,
  };
}

type BaseButtonProps = {
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
} & Pick<ButtonProps, "icon" | "label" | "onlyIcon">;

type PasteButtonProps = ButtonProps & {
  action: PasteAction;
};

type ClearButtonProps = ButtonProps & {
  action: ClearAction;
};

type SwapButtonProps = ButtonProps & {
  action: SwapAction;
};

type CopyButtonProps = ButtonProps & {
  action: CopyAction;
};

function BaseButton({
  className,
  ariaLabel,
  disabled,
  label,
  icon,
  onlyIcon,
  onClick,
}: BaseButtonProps) {
  const IconComponent = onlyIcon && icon ? IconMap[icon] : null;
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      {IconComponent ? (
        <IconComponent />
      ) : (
        <TextComponent as="span" text={label} />
      )}
    </button>
  );
}

function PasteButton({ action, ...rest }: PasteButtonProps) {
  const { pasteFrom, supportData } = useClipboard();
  const { atoms } = useInput();
  const setValue = useSetAtom(atoms[action.inputId]);
  const handlePaste = useCallback(async () => {
    const text = await pasteFrom?.();
    if (!text) {
      return;
    }
    setValue(text);
  }, [setValue]);

  if (!supportData.readSupported) {
    return null;
  }

  return (
    <BaseButton
      {...useButtonProps(rest)}
      disabled={!supportData.readSupported}
      onClick={handlePaste}
    />
  );
}

function ClearButton({ action, ...rest }: ClearButtonProps) {
  const { atoms } = useInput();
  const [val, setVal] = useAtom(atoms[action.inputId]);
  const handleClear = useCallback(() => {
    setVal("");
  }, [setVal]);

  return (
    <BaseButton
      {...useButtonProps(rest)}
      disabled={!val}
      onClick={handleClear}
    />
  );
}

function SwapButton({ action, ...rest }: SwapButtonProps) {
  const { atoms } = useInput();
  const [val1, setVal1] = useAtom(atoms[action.between[0]]);
  const [val2, setVal2] = useAtom(atoms[action.between[1]]);
  const handleSwap = useCallback(() => {
    setVal1(val2);
    setVal2(val1);
  }, [val1, val2, setVal1, setVal2]);

  return (
    <BaseButton
      {...useButtonProps(rest)}
      onClick={handleSwap}
      disabled={!val1 && !val2}
    />
  );
}

function CopyButton({ action, ...rest }: CopyButtonProps) {
  const { pasteTo, supportData } = useClipboard();
  const { atoms } = useInput();
  const value = useAtomValue(atoms[action.inputId]);
  const handleCopy = useCallback(async () => {
    pasteTo?.(value);
  }, [value]);

  return (
    <BaseButton
      {...useButtonProps(rest)}
      disabled={!value || !supportData.writeSupported}
      onClick={handleCopy}
    />
  );
}

export function Button(props: ButtonProps) {
  const { action } = props;
  switch (action?.type) {
    case "paste":
      return <PasteButton {...props} action={action} />;
    case "clear":
      return <ClearButton {...props} action={action} />;
    case "swap":
      return <SwapButton {...props} action={action} />;
    case "copy":
      return <CopyButton {...props} action={action} />;
    default:
      return null;
  }
}
