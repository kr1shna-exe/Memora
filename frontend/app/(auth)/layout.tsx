import Link from "next/link";
import { Brain } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-[#1d4ed8] " />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-[--radius-md] bg-white/10 backdrop-blur">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-semibold text-white">Memora</span>
            </Link>

            <div className="space-y-6">
              <blockquote className="space-y-4">
                <p className="text-2xl font-medium text-white">
                  &ldquo;Memora has completely changed how I capture and retrieve
                  information. It&apos;s like having a perfect memory.&rdquo;
                </p>
                <footer className="text-white/80">
                  <p className="font-medium">Sarah Chen</p>
                  <p className="text-sm">Product Designer at Figma</p>
                </footer>
              </blockquote>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Trusted by 10,000+ users worldwide</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-[--radius-md] bg-primary">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-semibold text-foreground">
                  Memora
                </span>
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
