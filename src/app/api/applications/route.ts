import { NextRequest, NextResponse } from "next/server";
import { jsonError, jsonOk } from "@/lib/ai/http";
import { createApplicationSchema } from "@/lib/applications/schema";
import { getApplicationService } from "@/lib/applications/service";

export async function GET() {
  try {
    const applications = await getApplicationService().list();
    return jsonOk({ applications });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = createApplicationSchema.parse(json);
    const application = await getApplicationService().create({
      ...parsed,
      metadata: {
        userAgent: req.headers.get("user-agent"),
        referrer: req.headers.get("referer"),
        ...parsed.metadata,
      },
    });
    return jsonOk({ applicationId: application.id, application });
  } catch (error) {
    if (error instanceof Error && error.message === "ROLE_NOT_FOUND") {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "ROLE_NOT_FOUND", message: "Unknown role." },
        },
        { status: 400 }
      );
    }
    return jsonError(error);
  }
}
