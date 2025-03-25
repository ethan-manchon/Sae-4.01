import React from 'react';
import Content from '../../ui/content';

interface PostProps {
    pseudo: string;
    content: string;
    createdAt: string;
}

export default function Post({ pseudo, content, createdAt }: PostProps) {
    const now = new Date();
    const createdDate = new Date(Date.parse(createdAt));
    createdDate.setHours(createdDate.getHours() + 1); // heure française
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeek = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));

    let formattedDate;
    if (diffInMinutes < 60) {
        formattedDate = `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
        formattedDate = `${diffInHours} h`;
    } else if (diffInDays < 7) {
        formattedDate = `${diffInDays} j`;
    } else if (diffInWeek < 4) {
        formattedDate = `${diffInWeek} sem`;
    } else {
        formattedDate = new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'long',
            timeStyle: 'short'
        }).format(createdDate);
    }

    return (
        <li className="bg-bg p-4 border border-border rounded-lg m-4 w-3/4 md:w-5/9">
            <p className='text-left text-primary text-xl'>{pseudo}</p>
            <Content>{ content }</Content>
            <p className="text-right text-fg text-xs">{ formattedDate }</p>
        </li>
    );
}
