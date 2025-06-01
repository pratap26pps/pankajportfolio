"use client";

import { Player } from "@lottiefiles/react-lottie-player";

export default function LottieWrapper() {
  return (
    <Player
      autoplay
      loop
      src="/animation.json"
      style={{ height: "450px", width: "450px" }}
    />
  );
}
