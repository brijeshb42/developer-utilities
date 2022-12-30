import { Schema } from "../../schema/schema";
import { InputProvider } from "./InputProvider";
import { SchemaRenderer } from "./SchemaRenderer";

type MainSchemaUIProps = {
  schema: Schema;
};

export function MainSchemaUI({ schema }: MainSchemaUIProps) {
  const { inputs, layout, panels, id } = schema;

  return (
    <InputProvider baseId={id} inputs={inputs}>
      <SchemaRenderer layout={layout} panels={panels} />
    </InputProvider>
  );
}
