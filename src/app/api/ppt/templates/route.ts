import { NextResponse } from "next/server";

export async function GET() {
  const templates = [
    {
      id: "simple",
      name: "Simple",
      description: "Title and bullet content on each slide",
    },
    {
      id: "titleOnly",
      name: "Title Only",
      description: "Large title with minimal content",
    },
    {
      id: "section",
      name: "Section",
      description: "Section title slides with content slides",
    },
  ];

  return NextResponse.json({ templates });
}


