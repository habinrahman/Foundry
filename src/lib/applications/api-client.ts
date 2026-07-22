import type { Application } from "./types";
import type { CreateApplicationPayload } from "./schema";

type ApiOk<T> = { ok: true; data: T };
type ApiErr = {
  ok: false;
  error: { code: string; message: string; details?: unknown };
};

async function parseJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiOk<T> | ApiErr;
  if (!res.ok || !body.ok) {
    const message =
      !body.ok && body.error?.message
        ? body.error.message
        : "Request failed";
    throw new Error(message);
  }
  return body.data;
}

export async function createApplicationApi(
  payload: CreateApplicationPayload
): Promise<{ applicationId: string; application: Application }> {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function listApplicationsApi(): Promise<{
  applications: Application[];
}> {
  const res = await fetch("/api/applications", { cache: "no-store" });
  return parseJson(res);
}

export async function getApplicationApi(
  id: string
): Promise<{ application: Application }> {
  const res = await fetch(`/api/applications/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  return parseJson(res);
}
