import type { Application } from "./types";
import type { ApplicationRepository } from "./repository";

const globalForApps = globalThis as unknown as {
  __foundryApplications?: Map<string, Application>;
};

function getStore(): Map<string, Application> {
  if (!globalForApps.__foundryApplications) {
    globalForApps.__foundryApplications = new Map();
  }
  return globalForApps.__foundryApplications;
}

export class MemoryApplicationRepository implements ApplicationRepository {
  async create(input: Application): Promise<Application> {
    getStore().set(input.id, input);
    return input;
  }

  async getById(id: string): Promise<Application | null> {
    return getStore().get(id) ?? null;
  }

  async list(): Promise<Application[]> {
    return Array.from(getStore().values()).sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async update(
    id: string,
    patch: Partial<Pick<Application, "status" | "analysis">>
  ): Promise<Application | null> {
    const existing = getStore().get(id);
    if (!existing) return null;
    const next = { ...existing, ...patch };
    getStore().set(id, next);
    return next;
  }
}

let singleton: MemoryApplicationRepository | null = null;

export function getApplicationRepository(): ApplicationRepository {
  if (!singleton) {
    singleton = new MemoryApplicationRepository();
  }
  return singleton;
}
