import { cn } from "@/lib/utils";

interface DividerProps {
    className?: string;
    orientation?: "horizontal" | "vertical";
}
function Divider({ className }: DividerProps) {
    return (
        <div className={cn("w-full h-px bg-gray-1", className)}></div>
    );
}

export default Divider;