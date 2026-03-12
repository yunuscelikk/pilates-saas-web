import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const token = formData.get("token");

  const redirectUrl = new URL("/subscription/callback", request.url);
  if (token) {
    redirectUrl.searchParams.set("token", token);
  }

  return NextResponse.redirect(redirectUrl.toString(), 303);
}
