import React from 'react';
import Post from '../../ui/post/';

interface FeedProps {
    posts: Array<{
        id: number;
        content: string;
        created_at: string;
    }>;
}

export default function Feed({ posts }: FeedProps) {
    return (
        <div className='flex flex-col items-center w-full'>
            {posts.map((post) => (
                <Post key={post.id} content={post.content} createdAt={post.created_at} />
            ))}
        </div>
    );
}
