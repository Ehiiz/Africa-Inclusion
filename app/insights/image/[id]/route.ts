import { NextResponse } from "next/server";
import { getPostImage } from "@/lib/posts";

/**
 * Serves a post's uploaded preview image straight from the database. Callers
 * append `?v=<updated_at>`, so the response can be cached hard — a new upload
 * changes `updated_at` and therefore the URL.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await getPostImage(Number(id));
  if (!image) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(Buffer.from(image.bytes), {
    headers: {
      "Content-Type": image.type,
      "Content-Length": String(image.bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
