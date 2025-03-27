import React, { useEffect, useState, useRef, useCallback } from "react";
import Post from "../../ui/post";
import Error from "../../ui/error";
import { loadMe } from "../../lib/loader";

interface FeedDataProps {
  loader: (page: number) => Promise<{ posts: any[]; next_page: number | null }>;
  refresh?: boolean;
}
interface FeedStyleProps {
  className?: string;
}

type FeedProps = FeedDataProps & FeedStyleProps;

export default function Feeds({ loader, refresh, className }: FeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState(true);
  const [meId, setMeId] = useState<number | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPosts = useCallback(async (page: number) => {
    try {
      const data = await loader(page);
      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const newPosts = data.posts?.filter((post) => !existingIds.has(post.id)) || [];
        return [...prev, ...newPosts];
      });
      setNextPage(data.next_page);
    } catch (err: any) {
      console.error("Loading error:", err);
      setError("Error loading posts: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (nextPage === 1) {
      fetchPosts(1);
    }
  }, [fetchPosts, nextPage]);

  useEffect(() => {
    if (refresh) {
      setPosts([]);
      setNextPage(1);
      setLoading(true);
    }
  }, [refresh]);

  useEffect(() => {
    async function fetchMe() {
      const me = await loadMe();
      if (me && me.id) {
        setMeId(me.id);
      }
    }
    fetchMe();
  }, []);

  const lastPostRef = useCallback(
    (node) => {
      if (loading || !nextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts(nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, nextPage, fetchPosts]
  );

  return (
    <>
      <ul className={`flex flex-col items-center ${className || ""}`}>
        {posts.map((post) => (
          <Post
            key={post.id}
            pdp={post.user.pdp}
            post_id={post.id}
            pseudo={post.user.pseudo}
            content={post.content}
            createdAt={post.createdAt}
            userId={post.user.id}
            meId={meId ?? -1}
            blocked={post.blocked} 
            onDeleted={() => setPosts((prev) => prev.filter((p) => p.id !== post.id))}
          />
        ))}
      </ul>
      <div ref={lastPostRef} style={{ height: "10px" }} />
      {posts.length > 0 && !nextPage && (
        <p className="text-center pb-4 text-element">Vous avez atteint la fin des posts.</p>
      )}
      {loading && <p className="text-center text-fg">Chargement...</p>}
      {error && <Error error={error} />}
    </>
  );
}