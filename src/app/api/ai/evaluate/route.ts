import {
  evaluateAnswersRequestSchema,
  getTalentAI,
  jsonError,
  jsonOk,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(request: Request) {
  try {
    const body = evaluateAnswersRequestSchema.parse(await request.json());
    const data = await getTalentAI().evaluateAnswers(body);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
