import React, { useEffect, useState, useRef, useCallback } from "react";
import Feed from "./feed";
import { loadPosts } from "../../lib/loader";

interface FeedsProps {
    posts: any[];
}

export default function Feeds() {
    const [posts, setPosts] = useState<Array<{ id: number; content: string; createdAt: string; user: { pseudo: string } }>>([]);
    const [error, setError] = useState("");
    const [endOfPosts, setEndOfPosts] = useState("");
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const fetchInitialPosts = async () => {
            try {
                const data = await loadPosts(1);
                setPosts(data.posts || []);
                setNextPage(data.next_page);
            } catch (error) {
                console.error("Error loading posts:", error);
                setError("Error loading posts:" + error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialPosts();
    }, []);

    const loadMorePosts = useCallback(async () => {
        if (!nextPage) return setEndOfPosts("Fin des posts");
        setLoading(true);

        try {
            const data = await loadPosts(nextPage);
            setPosts((prev) => {
                const existingIds = new Set(prev.map(post => post.id));
                const newPosts = data.posts?.filter(post => !existingIds.has(post.id)) || [];
                return [...prev, ...newPosts];
            });
            setNextPage(data.next_page);
        } catch (error) {
            console.error("Error loading more posts:", error);
        } finally {
            setLoading(false);
        }
    }, [nextPage]);

    const lastPostRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && nextPage) {
                        loadMorePosts();
                    }
                },
                { threshold: 0.5 }
            );

            if (node) observer.current.observe(node);
        },
        [loading, nextPage, loadMorePosts]
    );

    return (
        <>
            <Feed posts={posts} />

            <div ref={lastPostRef} style={{ height: "10px" }}></div>

            {loading && <p className="text-center text-dark">Chargement...</p>}
            { error && (
            <div className="bg-error-bg border border-error-border text-error px-4 py-3 rounded relative mt-2" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
            )}
            { endOfPosts && (
            <div className="bg-error-bg border border-error-border text-error px-4 py-3 rounded relative mt-2" role="alert">
                <span className="block sm:inline">{endOfPosts}</span>
            </div>
            )}
        </>
    );
}
