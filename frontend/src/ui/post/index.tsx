import React, { useState } from 'react';
import Content from '../../ui/content';
import Pdp from '../../ui/pdp';
import Like from '../../ui/like';
import TrashButton from '../../ui/trash';

interface PostProps {
  pseudo: string;
  pdp: string;
  post_id: number;
  content: string;
  createdAt: string;
  userId: number;
  meId: number;
  blocked: boolean;
  onDeleted?: () => void;
}

export default function Post({ pseudo, post_id, content, createdAt, pdp, userId, meId, blocked, onDeleted }: PostProps) {
  const [disappearing, setDisappearing] = useState(false);

  const now = new Date();
  const createdDate = new Date(Date.parse(createdAt));
  createdDate.setHours(createdDate.getHours() + 1);
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
    formattedDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(createdDate);
  }

  const handleDeleted = () => {
    setDisappearing(true);
    setTimeout(() => {
      onDeleted?.();
    }, 300);
  };

  return (
<li className={`relative bg-white hover:bg-bg p-4 pt-8 border border-border rounded-xl shadow-sm m-4 w-full md:w-full transition-all duration-200 ease-in-out ${disappearing ? 'opacity-0 scale-95' : ''}`}>
  <div className="absolute top-2 left-4">
    <Pdp pdp={pdp} pseudo={pseudo} link={`/profil/${pseudo}`} />
  </div>

  <div className="pl-[72px]">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-element whitespace-nowrap">{formattedDate}</span>
    </div>

    <div className="text-sm text-fg">
      <Content>{content}</Content>
    </div>
  </div>

  {!blocked && (
  <div className="absolute -bottom-4 right-4">
    <Like postId={post_id} />
  </div>
)}
</li>





  );
}
