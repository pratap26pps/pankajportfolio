export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { sendContactToOwner, sendContactAckToUser } from "@/lib/mailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, message } = body || {};

    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Email and message are required" },
        { status: 400 }
      );
    }

    await sendContactToOwner({ email, message });
    await sendContactAckToUser({ email });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/contact error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
