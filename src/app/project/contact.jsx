'use client'
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";

export function ShineBorderDemo() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const tid = toast.loading('Sending message...');
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      setStatus({ type: "success", msg: "Message sent. I'll get back to you soon." });
      toast.success("Message sent successfully!");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong" });
      toast.error(err.message || "Failed to send message");
    } finally {
      toast.dismiss(tid);
      setLoading(false);
    }
  }

  return (
    <Card className="relative overflow-hidden  w-[330px]  lg:w-[750px] mx-auto bg-gradient-to-br from-[#1e1b4b] via-[#141324] to-[#11261e] border border-white/10 shadow-[0_0_40px_5px_RGBA(160,124,254,0.3)] rounded-3xl p-6 backdrop-blur-md">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardDescription className="text-indigo-200 text-2xl">
          Let's connect and build something great!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#A07CFE] transition duration-300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-white">
                Message
              </Label>
              <textarea
                id="message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 w-full resize-none focus:ring-2 focus:ring-[#FE8FB5] transition duration-300 rounded-md p-3 leading-relaxed"
                placeholder="Tell me about your project..."
              />
            </div>
            {status && (
              <p className={`${status.type === 'success' ? 'text-green-400' : 'text-red-400'} text-sm`}>
                {status.msg}
              </p>
            )}
          </div>
          <CardFooter className="mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-gradient-to-r from-[#A07CFE] to-[#FE8FB5] text-white font-semibold hover:from-[#FE8FB5] hover:to-[#FFBE7B] transition-all duration-300 rounded-full shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : ' Send Message'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
     
    </Card>
  );
}
