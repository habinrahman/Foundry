import { NextResponse } from "next/server";
import { jsonError, jsonOk } from "@/lib/ai";
import { extractResumeTextFromBuffer } from "@/lib/resume/extract-text.server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "A resume file is required.",
          },
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "File must be under 8MB.",
          },
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractResumeTextFromBuffer(buffer, file.name);

    return jsonOk({
      text,
      fileName: file.name,
      characterCount: text.length,
    });
  } catch (error) {
    return jsonError(error);
  }
}
