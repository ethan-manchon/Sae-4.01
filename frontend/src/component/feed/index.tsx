import React, { useState, useEffect, useCallback, useRef } from "react";
import Repost from "../../ui/repost";
import Post from "../../ui/post";
import ErrorMessage from "../../ui/error"; // Renommé 'Error' en 'ErrorMessage' pour éviter toute confusion
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

export default function Feed({
  loader,
  refresh = false,
  subscribe = false,
  className = "",
}: FeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [meId, setMeId] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchPosts = useCallback(
    async (page: number) => {
      try {
        const data = await loader(page, subscribe);
        setPosts((prevPosts) => {
          const prevIds = new Set(prevPosts.map((p) => p.id));
          const newPosts = data.posts?.filter((p) => !prevIds.has(p.id)) || [];
          return [...prevPosts, ...newPosts];
        });
        setNextPage(data.next_page);
      } catch (err: any) {
        console.error("Erreur chargement posts:", err);
        setError(`Erreur lors du chargement des posts : ${err.message}`);
        setNextPage(null);
      } finally {
        setLoading(false);
      }
    },
    [loader, subscribe],
  );

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setError("");
      setLoading(true);
      const data = await loader(1, subscribe);
      if (!ignore) {
        setPosts(data.posts);
        setNextPage(data.next_page);
        setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loader, subscribe]);

  useEffect(() => {
    if (refresh) {
      const load = async () => {
        setError("");
        setLoading(true);
        const data = await loader(1, subscribe);
        setPosts(data.posts);
        setNextPage(data.next_page);
        setLoading(false);
      };
      load();
    }
  }, [refresh, fetchPosts]);

  useEffect(() => {
    let mounted = true;
    loadMe()
      .then((me) => {
        if (mounted && me) {
          setMeId(me.id);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement profil:", err);
      });
    return () => {
      mounted = false;
    };
  }, []); // une seule fois au montage

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      if (node && nextPage) {
        observerRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            fetchPosts(nextPage);
          }
        });
        observerRef.current.observe(node);
      }
    },
    [loading, nextPage, fetchPosts],
  );

  return (
    <div className={`feed-container ${className}`}>
      <ul className="feed-list flex w-full flex-col items-center">
        {posts.map((item) =>
          item.type === "repost" ? (
            <Repost
              key={`repost-${item.repost_id}`}
              repostUser={{
                pseudo: item.user,
                pdp: item.pdp,
                id: item.user_id,
              }}
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
              onDeleted={() =>
                setPosts((prev) =>
                  prev.filter((p) => p.id !== item.original_post.post_id),
                )
              }
            />
          ) : (
            <Post
              key={`post-${item.id}`}
              post_id={item.id}
              pdp={item.user.pdp}
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
              onDeleted={() =>
                setPosts((prev) => prev.filter((p) => p.id !== item.id))
              }
            />
          ),
        )}
        {!loading &&
          posts.length === 0 &&
          !error /* Aucun post à afficher */ && (
            <li className="text-center text-element">Aucune publication.</li>
          )}
      </ul>

      <div ref={lastPostRef} style={{ height: 1 }} />

      {posts.length > 0 && nextPage === null && (
        <p className="py-2 text-center text-element">
          Vous avez atteint la fin des posts.
        </p>
      )}

      {loading && (
        <p className="py-2 text-center text-fg">Chargement en cours...</p>
      )}

      {error && <ErrorMessage error={error} />}
    </div>
  );
}
