import React from 'react';
import Content from '../../ui/content';

interface PostProps {
    content: string;
    createdAt: string;
}

export default function Post({ content, createdAt }: PostProps) {
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short'
    }).format(new Date(createdAt));

    return (
        <div className="bg-light p-4 border border-gray-200 rounded-lg m-4 w-3/4">
            <Content>{ content }</Content>
            <p className="text-right text-dark text-xs">{ formattedDate }</p>
        </div>
    );
}
