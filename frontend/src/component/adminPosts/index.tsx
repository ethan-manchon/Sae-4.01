import React, { useEffect, useState, useRef, useCallback } from "react";
import { adminLoadPosts, adminEditPost, adminDeletePost } from "../../lib/PostService";
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

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts(nextPage);
        }
      }, {
        root: scrollContainerRef.current,
        threshold: 1.0,
      });

      if (node) observer.current.observe(node);
    },
    [loading, nextPage, fetchPosts]
  );

  const handleCensorToggle = async (post: any) => {
    const res = await adminEditPost(post.id, { censor: !post.censor });
    if (!res.error) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, censor: !post.censor } : p)));
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce post ?")) return;
    const res = await adminDeletePost(postId);
    if (!res.error) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.user.pseudo.toLowerCase().includes(search.toLowerCase()) ||
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-border p-3 sticky top-0 z-10 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Rechercher un post ou un pseudo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 px-4 w-full border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {filteredPosts.length === 0 && !loading && (
          <p className="text-center text-sm text-gray-400">Aucun post ne correspond à votre recherche.</p>
        )}
        <ul className="flex flex-col gap-4">
          {filteredPosts.map((post, index) => (
            <li key={post.id} ref={index === filteredPosts.length - 1 ? lastPostRef : null} className="w-full">
              <div className="flex flex-row bg-white border border-border rounded-xl shadow-sm p-4">
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
                <div className={`flex justify-end gap-2 mt-2 `}>
                  <Button onClick={() => handleCensorToggle(post)} variant="transparent" className={`${post.censor ? "text-red" : "text-green"}`}>
                    <CrossSvg className="w-8 h-8" />
                  </Button>
                  <Button onClick={() => handleDelete(post.id)} variant="transparent" className="text-red">
                  <TrashSvg className="w-8 h-8" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div ref={lastPostRef} style={{ height: "10px" }} />
        {loading && <p className="text-center text-sm text-gray-400">Chargement...</p>}
        {error && <Error error={error} />}
        {!nextPage && posts.length > 0 && (
          <p className="text-center text-sm text-gray-300">Vous avez atteint la fin des posts.</p>
        )}
      </div>
    </div>
  );
}