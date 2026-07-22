import {
  analyzeResumeRequestSchema,
  getTalentAI,
  jsonError,
  jsonOk,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = analyzeResumeRequestSchema.parse(await request.json());
    const data = await getTalentAI().analyzeResume(body);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
