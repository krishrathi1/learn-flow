import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

type SlideDef = { title: string; content: string };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function applyTemplate(pptx: PptxGenJS, templateId: string) {
  if (templateId === "titleOnly") {
    pptx.layout = "LAYOUT_16x9";
  } else if (templateId === "section") {
    pptx.layout = "LAYOUT_16x9";
  } else {
    pptx.layout = "LAYOUT_16x9";
  }
}

function addSlide(pptx: PptxGenJS, slideData: SlideDef, templateId: string) {
  const slide = pptx.addSlide();
  if (templateId === "titleOnly") {
    slide.addText(slideData.title, { x: 0.5, y: 1.5, w: 9, h: 1, fontSize: 36, bold: true });
    slide.addText(slideData.content, { x: 0.5, y: 3, w: 9, h: 3, fontSize: 20 });
  } else if (templateId === "section") {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 2, fill: { color: "003B73" } });
    slide.addText(slideData.title, { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 30, color: "FFFFFF", bold: true });
    slide.addText(slideData.content, { x: 0.5, y: 2.5, w: 9, h: 3.5, fontSize: 18 });
  } else {
    slide.addText(slideData.title, { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, bold: true });
    slide.addText(slideData.content, { x: 0.5, y: 1.8, w: 9, h: 4.5, fontSize: 18 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slides, templateId, fileName } = (await req.json()) as {
      slides: SlideDef[];
      templateId?: string;
      fileName?: string;
    };

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: "No slides provided" }, { status: 400 });
    }

    const pptx = new PptxGenJS();
    const chosenTemplate = templateId || "simple";
    applyTemplate(pptx, chosenTemplate);
    slides.forEach(slide => addSlide(pptx, slide, chosenTemplate));

    const buffer = await pptx.write("nodebuffer");
    const filename = (fileName || "presentation") + ".pptx";
    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to generate PPTX" }, { status: 500 });
  }
}


