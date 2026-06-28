'use client'
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { validateContactForm } from "@/lib/contactValidation";

export function ShineBorderDemo() {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);

    const validationErrors = validateContactForm({
      name,
      contactNumber,
      email,
      message,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    const tid = toast.loading('Sending message...');
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contactNumber: contactNumber.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      setStatus({ type: "success", msg: "Message sent. I'll get back to you soon." });
      toast.success("Message sent successfully!");
      setName("");
      setContactNumber("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong" });
      toast.error(err.message || "Failed to send message");
    } finally {
      toast.dismiss(tid);
      setLoading(false);
    }
  }

  return (
    <Card className="relative overflow-hidden w-[330px] lg:w-[750px] mx-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#1e1b4b] dark:via-[#141324] dark:to-[#11261e] border border-neutral-200 dark:border-white/10 shadow-[0_0_40px_5px_RGBA(160,124,254,0.15)] dark:shadow-[0_0_40px_5px_RGBA(160,124,254,0.3)] rounded-3xl p-6 backdrop-blur-md transition-colors duration-300">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardDescription className="text-indigo-700 dark:text-indigo-200 text-2xl">
          Let's connect and build something great!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-neutral-900 dark:text-white">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`bg-neutral-900/5 dark:bg-white/10 border text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:ring-2 focus:ring-[#A07CFE] transition duration-300 ${
                  errors.name ? "border-red-400" : "border-neutral-300 dark:border-white/20"
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactNumber" className="text-neutral-900 dark:text-white">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="+91 98765 43210"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (errors.contactNumber) {
                    setErrors((prev) => ({ ...prev, contactNumber: undefined }));
                  }
                }}
                className={`bg-neutral-900/5 dark:bg-white/10 border text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:ring-2 focus:ring-[#A07CFE] transition duration-300 ${
                  errors.contactNumber ? "border-red-400" : "border-neutral-300 dark:border-white/20"
                }`}
              />
              {errors.contactNumber && (
                <p className="text-red-400 text-sm">{errors.contactNumber}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-neutral-900 dark:text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`bg-neutral-900/5 dark:bg-white/10 border text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 focus:ring-2 focus:ring-[#A07CFE] transition duration-300 ${
                  errors.email ? "border-red-400" : "border-neutral-300 dark:border-white/20"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-neutral-900 dark:text-white">
                Message
              </Label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                }}
                className={`bg-neutral-900/5 dark:bg-white/10 border text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/50 w-full resize-none focus:ring-2 focus:ring-[#FE8FB5] transition duration-300 rounded-md p-3 leading-relaxed ${
                  errors.message ? "border-red-400" : "border-neutral-300 dark:border-white/20"
                }`}
                placeholder="Tell me about your project..."
              />
              {errors.message && (
                <p className="text-red-400 text-sm">{errors.message}</p>
              )}
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
