import type { Application, CreateApplicationInput } from "./types";

export interface ApplicationRepository {
  create(input: Application): Promise<Application>;
  getById(id: string): Promise<Application | null>;
  list(): Promise<Application[]>;
  update(
    id: string,
    patch: Partial<Pick<Application, "status" | "analysis">>
  ): Promise<Application | null>;
}

export type { CreateApplicationInput };
