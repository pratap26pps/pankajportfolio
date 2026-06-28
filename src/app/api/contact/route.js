export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { sendContactToOwner, sendContactAckToUser } from "@/lib/mailer";
import { validateContactForm } from "@/lib/contactValidation";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, contactNumber, email, message } = body || {};

    const errors = validateContactForm({ name, contactNumber, email, message });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, error: Object.values(errors)[0], errors },
        { status: 400 }
      );
    }

    await sendContactToOwner({
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    await sendContactAckToUser({ email: email.trim() });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/contact error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
