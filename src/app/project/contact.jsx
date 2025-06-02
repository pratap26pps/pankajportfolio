import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";

export function ShineBorderDemo() {
  return (
    <Card className="relative overflow-hidden  w-[330px]  lg:w-[750px] mx-auto bg-gradient-to-br from-[#1e1b4b] via-[#141324] to-[#11261e] border border-white/10 shadow-[0_0_40px_5px_rgba(160,124,254,0.3)] rounded-3xl p-6 backdrop-blur-md">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

      <CardHeader>
        <CardDescription className="text-indigo-200 text-2xl">
          Let's connect and build something great!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
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
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 w-full resize-none focus:ring-2 focus:ring-[#FE8FB5] transition duration-300 rounded-md p-3 leading-relaxed"
                placeholder="Tell me about your project..."
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="mt-4">
        <Button className="w-full cursor-pointer bg-gradient-to-r from-[#A07CFE] to-[#FE8FB5] text-white font-semibold hover:from-[#FE8FB5] hover:to-[#FFBE7B] transition-all duration-300 rounded-full shadow-lg">
          🚀 Send Message
        </Button>
      </CardFooter>
    </Card>
  );
}
