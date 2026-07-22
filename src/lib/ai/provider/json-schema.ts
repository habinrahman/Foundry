import { z } from "zod";

/**
 * Convert a Zod schema into a JSON Schema object suitable for Gemini
 * `responseJsonSchema`. Strips meta fields and normalizes nullables.
 */
export function zodToGeminiJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(schema, {
    target: "draft-07",
    unrepresentable: "any",
  }) as Record<string, unknown>;

  const rest = { ...jsonSchema };
  delete rest.$schema;
  delete rest.$id;
  return sanitizeForGemini(rest) as Record<string, unknown>;
}

function sanitizeForGemini(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeForGemini);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const input = value as Record<string, unknown>;

  // Convert Zod nullable anyOf:[{type:T},{type:null}] → type:[T,"null"]
  if (Array.isArray(input.anyOf) && input.anyOf.length === 2) {
    const normalized = normalizeNullableAnyOf(input.anyOf);
    if (normalized) return sanitizeForGemini(normalized);
  }

  const output: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(input)) {
    if (
      key === "$schema" ||
      key === "$id" ||
      key === "additionalProperties" ||
      key === "$ref" ||
      key === "definitions" ||
      key === "$defs"
    ) {
      continue;
    }

    output[key] = sanitizeForGemini(child);
  }

  return output;
}

function normalizeNullableAnyOf(
  anyOf: unknown[]
): Record<string, unknown> | null {
  const nodes = anyOf.filter(
    (item): item is Record<string, unknown> =>
      !!item && typeof item === "object" && !Array.isArray(item)
  );

  if (nodes.length !== 2) return null;

  const nullNode = nodes.find((node) => node.type === "null");
  const valueNode = nodes.find((node) => node.type !== "null");

  if (!nullNode || !valueNode || valueNode.type == null) return null;

  const { type, ...rest } = valueNode;
  return {
    ...rest,
    type: Array.isArray(type) ? [...type, "null"] : [type, "null"],
  };
}
