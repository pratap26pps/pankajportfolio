"use client";

import { Icon } from "@iconify/react";

const WHATSAPP_NUMBER = "918252590019";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi Pankaj, I found your portfolio and would like to discuss a project."
);

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[5000] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-xl transition-all duration-300"
    >
      <Icon icon="mdi:whatsapp" className="w-7 h-7" />
    </a>
  );
}
