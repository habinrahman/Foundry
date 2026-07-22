import {
  getTalentAI,
  jsonError,
  jsonOk,
  questionsRequestSchema,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = questionsRequestSchema.parse(await request.json());
    const data = await getTalentAI().generateTechnicalQuestions(body);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
