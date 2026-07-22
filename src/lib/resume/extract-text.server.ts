import mammoth from "mammoth";

export async function extractResumeTextFromBuffer(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      const text = result.text?.trim();
      if (!text) {
        throw new Error(
          "Could not extract text from this PDF. Try a text-based PDF or paste resume text."
        );
      }
      return text;
    } finally {
      await parser.destroy();
    }
  }

  if (lower.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (!text) {
      throw new Error(
        "Could not extract text from this DOCX. The file may be empty or image-only."
      );
    }
    return text;
  }

  throw new Error("Unsupported file type. Upload a PDF or DOCX resume.");
}
