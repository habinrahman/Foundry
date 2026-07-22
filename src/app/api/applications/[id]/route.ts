import { NextResponse } from "next/server";
import { jsonError, jsonOk } from "@/lib/ai/http";
import { getApplicationService } from "@/lib/applications/service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const application = await getApplicationService().getById(id);
    if (!application) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "NOT_FOUND", message: "Application not found." },
        },
        { status: 404 }
      );
    }
    return jsonOk({ application });
  } catch (error) {
    return jsonError(error);
  }
}
