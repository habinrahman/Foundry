import { getRoleBySlug } from "@/data/careers/roles";
import { createApplicationId } from "./id";
import { getApplicationRepository } from "./memory-store";
import type { CreateApplicationPayload } from "./schema";
import type { Application } from "./types";

export class ApplicationService {
  constructor(private readonly repo = getApplicationRepository()) {}

  async create(payload: CreateApplicationPayload): Promise<Application> {
    const role = getRoleBySlug(payload.roleSlug);
    if (!role) {
      throw new Error("ROLE_NOT_FOUND");
    }

    const application: Application = {
      id: createApplicationId(),
      role: {
        slug: role.slug,
        title: role.title,
        department: role.department,
        location: role.location,
        employmentType: role.employmentType,
        experience: role.experience,
      },
      status: "received",
      submittedAt: new Date().toISOString(),
      personal: payload.personal,
      professional: {
        yearsOfExperience: payload.professional.yearsOfExperience,
        currentCompany: payload.professional.currentCompany ?? null,
        currentPosition: payload.professional.currentPosition ?? null,
        linkedInUrl: payload.professional.linkedInUrl,
        githubUrl: payload.professional.githubUrl ?? null,
        portfolioUrl: payload.professional.portfolioUrl ?? null,
      },
      resume: {
        fileName: payload.resume.fileName ?? null,
        mimeType: payload.resume.mimeType ?? null,
        sizeBytes: payload.resume.sizeBytes ?? null,
        text: payload.resume.text ?? null,
      },
      answers: {
        interestReason: payload.answers.interestReason,
        strongFitReason: payload.answers.strongFitReason,
        additionalNotes: payload.answers.additionalNotes ?? null,
      },
      analysis: null,
      metadata: {
        source: "tamm-careers",
        userAgent: payload.metadata?.userAgent ?? null,
        referrer: payload.metadata?.referrer ?? null,
      },
    };

    return this.repo.create(application);
  }

  async getById(id: string): Promise<Application | null> {
    return this.repo.getById(id);
  }

  async list(): Promise<Application[]> {
    return this.repo.list();
  }
}

let service: ApplicationService | null = null;

export function getApplicationService(): ApplicationService {
  if (!service) service = new ApplicationService();
  return service;
}
