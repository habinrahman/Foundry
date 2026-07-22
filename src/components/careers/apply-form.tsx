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
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";
import type { Messages } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const STEP_KEYS = [
  "personal",
  "position",
  "profile",
  "resume",
  "questions",
  "review",
] as const;

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

type ValidationCode = keyof Messages["validation"];

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
  const { t } = useLocale();
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
  const [errors, setErrors] = useState<Record<string, ValidationCode>>({});
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
    const next: Record<string, ValidationCode> = {};
    if (index === 0) {
      if (form.fullName.trim().length < 2) next.fullName = "fullNameRequired";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        next.email = "emailInvalid";
      if (form.phone.trim().length < 7) next.phone = "phoneRequired";
      if (form.countryOfResidence.trim().length < 2)
        next.countryOfResidence = "countryRequired";
    }
    if (index === 1) {
      if (!getRoleBySlug(form.roleSlug)) next.roleSlug = "roleRequired";
      if (!YEARS_OF_EXPERIENCE.includes(form.yearsOfExperience))
        next.yearsOfExperience = "experienceRequired";
    }
    if (index === 2) {
      try {
        // Validate URL shape
        new URL(form.linkedInUrl.trim());
      } catch {
        next.linkedInUrl = "linkedInUrlInvalid";
      }
      for (const key of ["githubUrl", "portfolioUrl"] as const) {
        const value = form[key].trim();
        if (!value) continue;
        try {
          new URL(value);
        } catch {
          next[key] = "urlInvalid";
        }
      }
    }
    if (index === 3) {
      if (!form.resumeFileName) next.resume = "resumeRequired";
    }
    if (index === 4) {
      if (form.interestReason.trim().length < 20)
        next.interestReason = "interestReasonTooShort";
      if (form.strongFitReason.trim().length < 20)
        next.strongFitReason = "strongFitReasonTooShort";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function errorText(code?: ValidationCode): string | undefined {
    return code ? t.validation[code] : undefined;
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
      setExtractNote(t.apply.resumeStep.extractedSuccess);
    } catch {
      setExtractNote(t.apply.resumeStep.extractedFailure);
    } finally {
      setExtracting(false);
    }
  }

  async function onSubmit() {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setSubmitError(t.apply.errors.incompleteSections);
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
        error instanceof Error ? error.message : t.apply.errors.submitFailed
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        {t.apply.eyebrow}
      </p>
      <h1 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
        {formatMessage(t.apply.title, {
          role: selectedRole?.title ?? t.apply.titleFallbackRole,
        })}
      </h1>
      <p className="mt-3 text-[var(--muted)]">{t.apply.description}</p>

      <ol className="mt-8 flex flex-wrap gap-2" aria-label={t.apply.stepsAriaLabel}>
        {STEP_KEYS.map((key, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <li key={key}>
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
                {t.apply.steps[key]}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
        {step === 0 ? (
          <>
            <Field
              label={t.apply.fields.fullName}
              htmlFor="fullName"
              error={errorText(errors.fullName)}
            >
              <input
                id="fullName"
                className={inputClass}
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
              />
            </Field>
            <Field
              label={t.apply.fields.email}
              htmlFor="email"
              error={errorText(errors.email)}
            >
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
              label={t.apply.fields.phone}
              htmlFor="phone"
              error={errorText(errors.phone)}
              hint={t.apply.fields.phoneHint}
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
              label={t.apply.fields.country}
              htmlFor="country"
              error={errorText(errors.countryOfResidence)}
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
            <Field
              label={t.apply.fields.role}
              htmlFor="role"
              error={errorText(errors.roleSlug)}
            >
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
              label={t.apply.fields.yearsOfExperience}
              htmlFor="yoe"
              error={errorText(errors.yearsOfExperience)}
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
                    {y} {t.apply.fields.yearsSuffix}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.apply.fields.currentCompany} htmlFor="company">
              <input
                id="company"
                className={inputClass}
                value={form.currentCompany}
                onChange={(e) => update("currentCompany", e.target.value)}
              />
            </Field>
            <Field label={t.apply.fields.currentPosition} htmlFor="position">
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
            <Field
              label={t.apply.fields.linkedin}
              htmlFor="linkedin"
              error={errorText(errors.linkedInUrl)}
            >
              <input
                id="linkedin"
                className={inputClass}
                value={form.linkedInUrl}
                onChange={(e) => update("linkedInUrl", e.target.value)}
                placeholder="https://linkedin.com/in/…"
                aria-invalid={Boolean(errors.linkedInUrl)}
              />
            </Field>
            <Field
              label={t.apply.fields.github}
              htmlFor="github"
              error={errorText(errors.githubUrl)}
            >
              <input
                id="github"
                className={inputClass}
                value={form.githubUrl}
                onChange={(e) => update("githubUrl", e.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>
            <Field
              label={t.apply.fields.portfolio}
              htmlFor="portfolio"
              error={errorText(errors.portfolioUrl)}
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
                {t.apply.resumeStep.extracting}
              </p>
            ) : null}
            {form.resumeFileName ? (
              <p className="text-sm text-[var(--foreground)]">
                {t.apply.resumeStep.selectedLabel}{" "}
                <span className="font-medium">{form.resumeFileName}</span>
              </p>
            ) : null}
            {extractNote ? (
              <p className="text-sm text-[var(--muted)]">{extractNote}</p>
            ) : null}
            {errors.resume ? (
              <p className="text-xs text-[var(--danger)]" role="alert">
                {errorText(errors.resume)}
              </p>
            ) : null}
          </>
        ) : null}

        {step === 4 ? (
          <>
            <Field
              label={t.apply.fields.interestReason}
              htmlFor="interest"
              error={errorText(errors.interestReason)}
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
              label={t.apply.fields.strongFitReason}
              htmlFor="fit"
              error={errorText(errors.strongFitReason)}
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
            <Field label={t.apply.fields.additionalNotes} htmlFor="notes">
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
              title={t.apply.review.personalInfoTitle}
              editLabel={t.apply.review.edit}
              onEdit={() => setStep(0)}
              rows={[
                [t.apply.review.labels.name, form.fullName],
                [t.apply.review.labels.email, form.email],
                [t.apply.review.labels.phone, form.phone],
                [t.apply.review.labels.country, form.countryOfResidence],
              ]}
            />
            <ReviewBlock
              title={t.apply.review.selectedRoleTitle}
              editLabel={t.apply.review.edit}
              onEdit={() => setStep(1)}
              rows={[
                [t.apply.review.labels.role, selectedRole?.title ?? form.roleSlug],
                [
                  t.apply.review.labels.experience,
                  `${form.yearsOfExperience} ${t.apply.fields.yearsSuffix}`,
                ],
                [
                  t.apply.review.labels.company,
                  form.currentCompany || t.common.emptyValue,
                ],
                [
                  t.apply.review.labels.position,
                  form.currentPosition || t.common.emptyValue,
                ],
              ]}
            />
            <ReviewBlock
              title={t.apply.review.professionalLinksTitle}
              editLabel={t.apply.review.edit}
              onEdit={() => setStep(2)}
              rows={[
                [t.apply.review.labels.linkedin, form.linkedInUrl],
                [
                  t.apply.review.labels.github,
                  form.githubUrl || t.common.emptyValue,
                ],
                [
                  t.apply.review.labels.portfolio,
                  form.portfolioUrl || t.common.emptyValue,
                ],
              ]}
            />
            <ReviewBlock
              title={t.apply.review.resumeTitle}
              editLabel={t.apply.review.edit}
              onEdit={() => setStep(3)}
              rows={[
                [t.apply.review.labels.file, form.resumeFileName ?? t.common.emptyValue],
                [
                  t.apply.review.labels.textExtraction,
                  form.resumeText ? t.apply.review.available : t.apply.review.unavailable,
                ],
              ]}
            />
            <ReviewBlock
              title={t.apply.review.responsesTitle}
              editLabel={t.apply.review.edit}
              onEdit={() => setStep(4)}
              rows={[
                [t.apply.review.labels.interest, form.interestReason],
                [t.apply.review.labels.strongFit, form.strongFitReason],
                [
                  t.apply.review.labels.additional,
                  form.additionalNotes || t.common.emptyValue,
                ],
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
            leftIcon={<ChevronLeft className="h-4 w-4 rtl:rotate-180" />}
          >
            {t.apply.actions.back}
          </Button>
          {step < 5 ? (
            <Button
              variant="primary"
              onClick={goNext}
              disabled={extracting}
              rightIcon={<ChevronRight className="h-4 w-4 rtl:rotate-180" />}
              className="rounded-full px-5"
            >
              {t.apply.actions.continue}
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
                  {t.apply.actions.submitting}
                </>
              ) : (
                t.apply.actions.submit
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
  editLabel,
}: {
  title: string;
  rows: [string, string][];
  onEdit: () => void;
  editLabel: string;
}) {
  return (
    <section className="rounded-xl border border-[var(--border)] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          {editLabel}
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
