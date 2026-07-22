"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ResumeDropzone } from "@/components/upload/resume-dropzone";
import { Button } from "@/components/ui/button";
import { CAREERS_ROLES, getRoleBySlug } from "@/data/careers/roles";
import { createApplicationApi } from "@/lib/applications/api-client";
import { YEARS_OF_EXPERIENCE } from "@/lib/applications/types";
import { extractResumeText } from "@/lib/ai/api-client";
import { cn } from "@/lib/utils";

const STEPS = [
  "Personal",
  "Position",
  "Profile",
  "Resume",
  "Questions",
  "Review",
] as const;

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

type FormState = {
  roleSlug: string;
  fullName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  yearsOfExperience: (typeof YEARS_OF_EXPERIENCE)[number];
  currentCompany: string;
  currentPosition: string;
  linkedInUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  interestReason: string;
  strongFitReason: string;
  additionalNotes: string;
  resumeFileName: string | null;
  resumeMimeType: string | null;
  resumeSizeBytes: number | null;
  resumeText: string | null;
};

const initialState = (roleSlug: string): FormState => ({
  roleSlug,
  fullName: "",
  email: "",
  phone: "",
  countryOfResidence: "",
  yearsOfExperience: "3-5",
  currentCompany: "",
  currentPosition: "",
  linkedInUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  interestReason: "",
  strongFitReason: "",
  additionalNotes: "",
  resumeFileName: null,
  resumeMimeType: null,
  resumeSizeBytes: null,
  resumeText: null,
});

function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30";

export function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") ?? "";
  const defaultRole =
    getRoleBySlug(roleParam)?.slug ??
    getRoleBySlug("ai-product-engineer")?.slug ??
    CAREERS_ROLES[0]?.slug ??
    "";

  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<FormState>(() => initialState(defaultRole));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [extracting, setExtracting] = useState(false);
  const [extractNote, setExtractNote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (roleParam && getRoleBySlug(roleParam)) {
      setForm((prev) => ({ ...prev, roleSlug: roleParam }));
    }
  }, [roleParam]);

  const selectedRole = useMemo(
    () => getRoleBySlug(form.roleSlug),
    [form.roleSlug]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateStep(index: StepIndex): boolean {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (form.fullName.trim().length < 2) next.fullName = "Enter your full name";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        next.email = "Enter a valid email";
      if (form.phone.trim().length < 7) next.phone = "Enter a phone number";
      if (form.countryOfResidence.trim().length < 2)
        next.countryOfResidence = "Enter your country";
    }
    if (index === 1) {
      if (!getRoleBySlug(form.roleSlug)) next.roleSlug = "Select a role";
      if (!YEARS_OF_EXPERIENCE.includes(form.yearsOfExperience))
        next.yearsOfExperience = "Select experience";
    }
    if (index === 2) {
      try {
        // Validate URL shape
        new URL(form.linkedInUrl.trim());
      } catch {
        next.linkedInUrl = "Enter a valid LinkedIn URL";
      }
      for (const key of ["githubUrl", "portfolioUrl"] as const) {
        const value = form[key].trim();
        if (!value) continue;
        try {
          new URL(value);
        } catch {
          next[key] = "Enter a valid URL";
        }
      }
    }
    if (index === 3) {
      if (!form.resumeFileName) next.resume = "Upload a PDF or DOCX resume";
    }
    if (index === 4) {
      if (form.interestReason.trim().length < 20)
        next.interestReason = "Please share at least a short paragraph";
      if (form.strongFitReason.trim().length < 20)
        next.strongFitReason = "Please share at least a short paragraph";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(5, s + 1) as StepIndex);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1) as StepIndex);
  }

  async function onResumeFile(file: File) {
    setExtracting(true);
    setExtractNote(null);
    update("resumeFileName", file.name);
    update("resumeMimeType", file.type || null);
    update("resumeSizeBytes", file.size);
    update("resumeText", null);
    try {
      const result = await extractResumeText(file);
      update("resumeText", result.text);
      setExtractNote("Resume text extracted for recruiter review.");
    } catch {
      setExtractNote(
        "File saved. Text extraction was unavailable — recruiters can still review your upload metadata."
      );
    } finally {
      setExtracting(false);
    }
  }

  async function onSubmit() {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setSubmitError("Please complete all required sections before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { applicationId } = await createApplicationApi({
        roleSlug: form.roleSlug,
        personal: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          countryOfResidence: form.countryOfResidence.trim(),
        },
        professional: {
          yearsOfExperience: form.yearsOfExperience,
          currentCompany: form.currentCompany.trim(),
          currentPosition: form.currentPosition.trim(),
          linkedInUrl: form.linkedInUrl.trim(),
          githubUrl: form.githubUrl.trim(),
          portfolioUrl: form.portfolioUrl.trim(),
        },
        resume: {
          fileName: form.resumeFileName,
          mimeType: form.resumeMimeType,
          sizeBytes: form.resumeSizeBytes,
          text: form.resumeText,
        },
        answers: {
          interestReason: form.interestReason.trim(),
          strongFitReason: form.strongFitReason.trim(),
          additionalNotes: form.additionalNotes.trim(),
        },
      });
      router.push(`/application/success?applicationId=${encodeURIComponent(applicationId)}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Application
      </p>
      <h1 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
        Apply to {selectedRole?.title ?? "Tamm"}
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        A short, focused application — review everything before you submit.
      </p>

      <ol className="mt-8 flex flex-wrap gap-2" aria-label="Application steps">
        {STEPS.map((label, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => {
                  if (index < step) setStep(index as StepIndex);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                    : done
                      ? "border-[var(--border)] text-[var(--foreground)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-3 w-3 text-[var(--accent)]" /> : null}
                {label}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
        {step === 0 ? (
          <>
            <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
              <input
                id="fullName"
                className={inputClass}
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
              />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <input
                id="email"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
            </Field>
            <Field
              label="Phone (WhatsApp)"
              htmlFor="phone"
              error={errors.phone}
              hint="Include country code so we can reach you."
            >
              <input
                id="phone"
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>
            <Field
              label="Country of residence"
              htmlFor="country"
              error={errors.countryOfResidence}
            >
              <input
                id="country"
                className={inputClass}
                value={form.countryOfResidence}
                onChange={(e) => update("countryOfResidence", e.target.value)}
                autoComplete="country-name"
                aria-invalid={Boolean(errors.countryOfResidence)}
              />
            </Field>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Field label="Role" htmlFor="role" error={errors.roleSlug}>
              <select
                id="role"
                className={inputClass}
                value={form.roleSlug}
                onChange={(e) => update("roleSlug", e.target.value)}
              >
                {CAREERS_ROLES.map((role) => (
                  <option key={role.slug} value={role.slug}>
                    {role.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Years of experience"
              htmlFor="yoe"
              error={errors.yearsOfExperience}
            >
              <select
                id="yoe"
                className={inputClass}
                value={form.yearsOfExperience}
                onChange={(e) =>
                  update(
                    "yearsOfExperience",
                    e.target.value as FormState["yearsOfExperience"]
                  )
                }
              >
                {YEARS_OF_EXPERIENCE.map((y) => (
                  <option key={y} value={y}>
                    {y} years
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Current company (optional)" htmlFor="company">
              <input
                id="company"
                className={inputClass}
                value={form.currentCompany}
                onChange={(e) => update("currentCompany", e.target.value)}
              />
            </Field>
            <Field label="Current position (optional)" htmlFor="position">
              <input
                id="position"
                className={inputClass}
                value={form.currentPosition}
                onChange={(e) => update("currentPosition", e.target.value)}
              />
            </Field>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Field label="LinkedIn" htmlFor="linkedin" error={errors.linkedInUrl}>
              <input
                id="linkedin"
                className={inputClass}
                value={form.linkedInUrl}
                onChange={(e) => update("linkedInUrl", e.target.value)}
                placeholder="https://linkedin.com/in/…"
                aria-invalid={Boolean(errors.linkedInUrl)}
              />
            </Field>
            <Field label="GitHub (optional)" htmlFor="github" error={errors.githubUrl}>
              <input
                id="github"
                className={inputClass}
                value={form.githubUrl}
                onChange={(e) => update("githubUrl", e.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>
            <Field
              label="Portfolio (optional)"
              htmlFor="portfolio"
              error={errors.portfolioUrl}
            >
              <input
                id="portfolio"
                className={inputClass}
                value={form.portfolioUrl}
                onChange={(e) => update("portfolioUrl", e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <ResumeDropzone onFile={onResumeFile} />
            {extracting ? (
              <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Extracting resume text…
              </p>
            ) : null}
            {form.resumeFileName ? (
              <p className="text-sm text-[var(--foreground)]">
                Selected: <span className="font-medium">{form.resumeFileName}</span>
              </p>
            ) : null}
            {extractNote ? (
              <p className="text-sm text-[var(--muted)]">{extractNote}</p>
            ) : null}
            {errors.resume ? (
              <p className="text-xs text-[var(--danger)]" role="alert">
                {errors.resume}
              </p>
            ) : null}
          </>
        ) : null}

        {step === 4 ? (
          <>
            <Field
              label="Why are you interested in this role?"
              htmlFor="interest"
              error={errors.interestReason}
            >
              <textarea
                id="interest"
                rows={4}
                className={inputClass}
                value={form.interestReason}
                onChange={(e) => update("interestReason", e.target.value)}
                aria-invalid={Boolean(errors.interestReason)}
              />
            </Field>
            <Field
              label="Why are you a strong fit?"
              htmlFor="fit"
              error={errors.strongFitReason}
            >
              <textarea
                id="fit"
                rows={4}
                className={inputClass}
                value={form.strongFitReason}
                onChange={(e) => update("strongFitReason", e.target.value)}
                aria-invalid={Boolean(errors.strongFitReason)}
              />
            </Field>
            <Field
              label="Anything else you'd like us to know? (optional)"
              htmlFor="notes"
            >
              <textarea
                id="notes"
                rows={3}
                className={inputClass}
                value={form.additionalNotes}
                onChange={(e) => update("additionalNotes", e.target.value)}
              />
            </Field>
          </>
        ) : null}

        {step === 5 ? (
          <div className="space-y-6">
            <ReviewBlock
              title="Personal information"
              onEdit={() => setStep(0)}
              rows={[
                ["Name", form.fullName],
                ["Email", form.email],
                ["Phone", form.phone],
                ["Country", form.countryOfResidence],
              ]}
            />
            <ReviewBlock
              title="Selected role"
              onEdit={() => setStep(1)}
              rows={[
                ["Role", selectedRole?.title ?? form.roleSlug],
                ["Experience", `${form.yearsOfExperience} years`],
                ["Company", form.currentCompany || "—"],
                ["Position", form.currentPosition || "—"],
              ]}
            />
            <ReviewBlock
              title="Professional links"
              onEdit={() => setStep(2)}
              rows={[
                ["LinkedIn", form.linkedInUrl],
                ["GitHub", form.githubUrl || "—"],
                ["Portfolio", form.portfolioUrl || "—"],
              ]}
            />
            <ReviewBlock
              title="Resume"
              onEdit={() => setStep(3)}
              rows={[
                ["File", form.resumeFileName ?? "—"],
                [
                  "Text extraction",
                  form.resumeText ? "Available" : "Unavailable",
                ],
              ]}
            />
            <ReviewBlock
              title="Responses"
              onEdit={() => setStep(4)}
              rows={[
                ["Interest", form.interestReason],
                ["Strong fit", form.strongFitReason],
                ["Additional", form.additionalNotes || "—"],
              ]}
            />
            {submitError ? (
              <p className="text-sm text-[var(--danger)]" role="alert">
                {submitError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0 || submitting}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          {step < 5 ? (
            <Button
              variant="primary"
              onClick={goNext}
              disabled={extracting}
              rightIcon={<ChevronRight className="h-4 w-4" />}
              className="rounded-full px-5"
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={submitting}
              className="rounded-full px-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Submitting…
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: [string, string][];
  onEdit: () => void;
}) {
  return (
    <section className="rounded-xl border border-[var(--border)] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      <dl className="mt-3 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[140px_1fr]">
            <dt className="text-xs text-[var(--muted)]">{label}</dt>
            <dd className="whitespace-pre-wrap text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
