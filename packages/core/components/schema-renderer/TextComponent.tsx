import clsx from "clsx";
import { createElement, ElementType } from "react";
import { Text } from "../../schema/schema";

export function TextComponent({
  text,
  as,
  className,
}: {
  text: Text;
  as: ElementType;
  className?: string;
}) {
  if (typeof text === "string") {
    return createElement(
      as,
      {
        className,
      },
      text
    );
  }

  const {
    tag = "span",
    text: textStr,
    bold,
    htmlFor,
    italic,
    link,
    linkExternal,
  } = text;
  const Element = tag;

  const element = (
    <Element
      className={clsx(className, {
        "font-bold": bold,
        italic,
      })}
      htmlFor={htmlFor}
    >
      {textStr}
    </Element>
  );

  if (link) {
    return (
      <a
        href={link}
        target={linkExternal ? "_blank" : undefined}
        rel="noreferrer"
      >
        {element}
      </a>
    );
  }

  return element;
}
