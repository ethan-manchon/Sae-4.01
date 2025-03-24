import React from 'react';
import Content from '../../ui/content';

interface PostProps {
    pseudo: string;
    content: string;
    createdAt: string;
}

export default function Post({ pseudo, content, createdAt }: PostProps) {
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short'
    }).format(new Date(createdAt));

    return (
        <div className="bg-bg p-4 border border-border rounded-lg m-4 w-3/4">
            <p className='text-left text-primary text-xl'>{pseudo}</p>
            <Content>{ content }</Content>
            <p className="text-right text-fg text-xs">{ formattedDate }</p>
        </div>
    );
}
