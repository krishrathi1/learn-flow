import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <Sparkles className={cn("text-primary", className)} {...props} />
);
