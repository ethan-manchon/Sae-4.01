import React from 'react';
import Pdp from '../../ui/pdp';
import Content from '../../ui/content';
import Date from '../../ui/date';

interface CommentProps {
  comment: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      pseudo: string;
      pdp: string;
    };
    count: number;
  };
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="border-l border-fg pl-4 ml-3 py-2 bg-grey-dark">
      <div className="flex items-center space-x-2">
        <Pdp pdp={comment.user.pdp} pseudo={comment.user.pseudo} link={`/profil/${comment.user.pseudo}`} />
        <Date date={comment.createdAt} />
      </div>
      <div className="mt-4 text-sm text-element">
        <Content>{comment.content}</Content>
      <span className="w-8 text-left">{comment.count}</span>
      </div>
    </div>
  );
}
