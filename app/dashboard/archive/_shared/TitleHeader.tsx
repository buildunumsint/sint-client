import React from 'react'

interface TitleHeaderProps {
    title: string;
    children: React.ReactNode;
}
const TitleHeader = ({ title, children }: TitleHeaderProps) => {
    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                {title}
            </h1>
            {children}
        </div>
    )
}

export default TitleHeader