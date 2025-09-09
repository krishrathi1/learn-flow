import { Logo } from "@/components/icons";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <h1 className="text-xl font-bold text-foreground">LearnFlow</h1>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}
