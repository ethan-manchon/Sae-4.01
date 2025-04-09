import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  adminLoadPosts,
  adminEditPost,
  adminDeletePost,
} from "../../lib/PostService";
import Post from "../../ui/post";
import Error from "../../ui/error";
import Button from "../../ui/button";
import { CrossSvg, TrashSvg } from "../../assets/svg/svg";

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const data = await adminLoadPosts(page);
      if (data.error) {
        setError(data.error);
        return;
      }
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = data.posts.filter((p: any) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
      setNextPage(data.next_page);
    } catch (err: any) {
      setError("Erreur lors du chargement des posts : " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (nextPage === 1) fetchPosts(1);
  }, [fetchPosts, nextPage]);

  const lastPostRef = useCallback(
    (node: any) => {
      if (loading || !nextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchPosts(nextPage);
          }
        },
        {
          root: scrollContainerRef.current,
          threshold: 1.0,
        },
      );

      if (node) observer.current.observe(node);
    },
    [loading, nextPage, fetchPosts],
  );

  const handleCensorToggle = async (post: any) => {
    const res = await adminEditPost(post.id, { censor: !post.censor });
    if (!res.error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, censor: !post.censor } : p,
        ),
      );
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce post ?")) return;
    const res = await adminDeletePost(postId);
    if (!res.error) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.user.pseudo.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen flex-col">
      <div className="sticky top-0 z-10 border-b border-border bg-white p-3 shadow-sm">
        <input
          type="text"
          placeholder="Rechercher un post ou un pseudo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-border bg-gray-50 p-2 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-4 py-4"
      >
        {filteredPosts.length === 0 && !loading && (
          <p className="text-center text-sm text-gray-400">
            Aucun post ne correspond à votre recherche.
          </p>
        )}
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              ref={index === filteredPosts.length - 1 ? lastPostRef : null}
              className="w-full"
            >
              <div className="flex flex-row rounded-xl border border-border bg-white p-4 shadow-sm">
                <ul className="flex w-full flex-col">
                  <Post
                    pdp={post.user.pdp}
                    post_id={post.id}
                    pseudo={post.user.pseudo}
                    content={post.content}
                    createdAt={post.createdAt}
                    userId={post.user.id}
                    meId={-1}
                    banned={post.banned}
                    count={post.count}
                    media={post.media}
                    censored={post.censor}
                    onDeleted={() => handleDelete(post.id)}
                  />
                </ul>
                <div className={`mt-2 flex justify-end gap-2`}>
                  <Button
                    onClick={() => handleCensorToggle(post)}
                    variant="transparent"
                  >
                    <CrossSvg
                      className={`${post.censor ? "text-red" : "text-green"}`}
                    />
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="transparent"
                  >
                    <TrashSvg />
                  </Button>

                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={lastPostRef} style={{ height: "10px" }} />
        {loading && (
          <p className="text-center text-sm text-gray-400">Chargement...</p>
        )}
        {error && <Error error={error} />}
        {!nextPage && posts.length > 0 && (
          <p className="text-center text-sm text-gray-300">
            Vous avez atteint la fin des posts.
          </p>
        )}
      </div>
    </div>
  );
}
