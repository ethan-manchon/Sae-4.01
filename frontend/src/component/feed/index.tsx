import React, { useEffect, useState, useRef, useCallback } from "react";
import Post from "../../ui/post/index";
import Repost from "../../ui/repost";
import Error from "../../ui/error";
import { loadMe } from "../../lib/UserService";

interface FeedDataProps {
  loader: (
    page: number,
    subscribe?: boolean,
  ) => Promise<{ posts: any[]; next_page: number | null }>;
  refresh?: boolean;
  subscribe?: boolean;
}

interface FeedStyleProps {
  className?: string;
}

type FeedProps = FeedDataProps & FeedStyleProps;

export default function Feeds({
  loader,
  refresh,
  className,
  subscribe,
}: FeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState(true);
  const [meId, setMeId] = useState<number | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPosts = useCallback(
    async (page: number) => {
      try {
        const data = await loader(page, subscribe);
        setPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post.id));
          const newPosts =
            data.posts?.filter((post) => !existingIds.has(post.id)) || [];
          return [...prev, ...newPosts];
        });
        setNextPage(data.next_page);
      } catch (err: any) {
        console.error("Loading error:", err);
        setError("Error loading posts: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [loader],
  );

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
      setMeId(me.id);
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
    [loading, nextPage, fetchPosts],
  );

  return (
    <>
      <ul className={`flex flex-col items-center ${className || ""}`}>
        {meId === null ? (
          <p className="text-center text-fg">Chargement de votre profil...</p>
        ) : posts.length > 0 ? (
          posts.map((item, index) =>
            item.type === "repost" ? (
              <Repost
                key={`repost-${item.original_post.post_id}-${index}`}
                repostUser={{ pseudo: item.user, pdp: item.pdp, id: item.user_id}}
                comment={item.comment}
                created_at={item.created_at}
                postId={item.original_post.post_id}
                pdp={item.original_post.pdp}
                repost_id={item.repost_id}
                post_id={item.original_post.post_id}
                pseudo={item.original_post.author}
                content={item.original_post.content}
                createdAt={item.original_post.created_at}
                userId={item.original_post.user_id}
                meId={meId ?? -1}
                banned={false}
                count={1}
                media={item.original_post.media}
                censored={item.original_post.censor}
                onDeleted={() => setPosts((prev) => prev.filter((p) => p.id !== item.original_post.post_id))}
              />
            ) : (
              <Post
                key={`post-${item.post_id}-${index}`}
                pdp={item.user.pdp}
                post_id={item.id}
                pseudo={item.user.pseudo}
                content={item.content}
                createdAt={item.created_at}
                userId={item.user.id}
                meId={meId ?? -1}
                banned={item.banned}
                count={item.count}
                media={item.media}                
                censored={item.censor}
                readOnly={item.readOnly}
                pinned={item.pinned}
                onDeleted={() => setPosts((prev) => prev.filter((p) => p.id !== item.id))}
              />
            )
          )
        ) : (
          <p className="text-center text-gray-500">Aucune publication.</p>
        )}
      </ul>
      <div ref={lastPostRef} style={{ height: "10px" }} />
      {posts.length > 0 && !nextPage && (
        <p className="pb-4 text-center text-element">
          Vous avez atteint la fin des posts.
        </p>
      )}
      {loading && <p className="text-center text-fg">Chargement...</p>}
      {error && <Error error={error} />}
    </>
  );
}
