import React from 'react';
import Post from '../../ui/post/';

interface FeedDataProps {
    posts: Array<{
        id: number;
        content: string;
        createdAt: string;
        user: {
            pseudo: string;
        };
    }>;
}
interface FeedStyleProps {
    className?: string;
}

type FeedProps = FeedDataProps & FeedStyleProps;

export default function Feed({ posts }: FeedProps) {
    return (
        <ul className='flex flex-col items-center'>
            {posts.map((post) => (
                <Post key={post.id} pseudo={post.user.pseudo} content={post.content} createdAt={post.createdAt} />
            ))}
        </ul>
    );
}
