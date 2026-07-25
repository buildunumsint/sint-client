import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

interface TitleHeaderProps {
    title: string;
    children: React.ReactNode;
}
const BackButton = () => {
    const router = useRouter();
    const handleClick = () => {
        router.back();
    }
    return (
        <button onClick={handleClick} className="">
          <ChevronLeft className="w-4 h-4"/>
        </button>
    )
}
const TitleHeader = ({ title, children }: TitleHeaderProps) => {
    return (
        <div className="flex flex-col gap-6 mb-10">
            <div className="flex items-center gap-2.5">
            <BackButton />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              
                {title}
            </h1>
            </div>
            {children}
        </div>
    )
}

export default TitleHeader