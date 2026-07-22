import { getTalentAI, jsonError, jsonOk, parseResumeRequestSchema } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = parseResumeRequestSchema.parse(await request.json());
    const data = await getTalentAI().parseResume(body);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
