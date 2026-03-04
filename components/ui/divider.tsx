import { cn } from "@/lib/utils";

interface DividerProps {
    className?: string;
}
function Divider({ className }: DividerProps) {
    return (
        <div className={cn("w-full h-px bg-[#D9D9D999]", className)}></div>
    );
}

export default Divider;