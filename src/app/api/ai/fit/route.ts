import {
  fitRationaleRequestSchema,
  getTalentAI,
  jsonError,
  jsonOk,
  streamTextResponse,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = fitRationaleRequestSchema.parse(await request.json());
    const talentAI = getTalentAI();

    if (body.stream) {
      return streamTextResponse(
        talentAI.streamFitRationale({
          resume: body.resume,
          analysis: body.analysis,
          locale: body.locale,
        })
      );
    }

    const data = await talentAI.generateFitRationale({
      resume: body.resume,
      analysis: body.analysis,
      locale: body.locale,
    });
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
