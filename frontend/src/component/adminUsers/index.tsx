import React, { useEffect, useState, useRef, useCallback } from "react";
import UserList from "../user";
import { loadUsers, loadUserById } from "../../lib/UserService";
import Error from "../../ui/error";

interface User {
    id: number;
    pseudo: string;
    email: string;
    roles: string;
    banned: boolean;
}

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [nextPage, setNextPage] = useState<number | null>(1);
    const [loading, setLoading] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchInitialUsers = async () => {
            try {
                const data = await loadUsers(1);
                setUsers(data.users || []);
                setNextPage(data.next_page);
            } catch (error) {
                console.error("Error loading users:", error);
                setError("Error loading users: " + error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialUsers();
    }, []);

    const loadMoreUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await loadUsers(nextPage ?? undefined);
            setUsers((prev) => {
                const existingIds = new Set(prev.map(user => user.id));
                const newUsers = data.users?.filter(user => !existingIds.has(user.id)) || [];
                return [...prev, ...newUsers];
            });
            setNextPage(data.next_page);
        } catch (error) {
            console.error("Error loading more users:", error);
        } finally {
            setLoading(false);
        }
    }, [nextPage]);

    const refreshUser = async (id: number) => {
        try {
            const updatedUser = await loadUserById(id);
            if (!updatedUser) return;
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === id ? updatedUser : user))
            );
        } catch (error) {
            console.error("Error refreshing user:", error);
        }
    };

    const lastUserRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && nextPage) {
                        loadMoreUsers();
                    }
                },
                { root: scrollContainerRef.current, threshold: 0.5 }
            );

            if (node) observer.current.observe(node);
        },
        [loading, nextPage, loadMoreUsers]
    );

    return (
        <div className="h-screen flex flex-col">
            <div className="border-b border-border p-3 sticky top-0 z-10 bg-white shadow-sm">
                <input
                    type="text"
                    placeholder="Rechercher par pseudo"
                    className="p-2 px-4 w-full border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50"
            >
                {users
                    .filter((user) =>
                        user.pseudo.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user, index, array) => (
                        <div
                            key={user.id}
                            ref={index === array.length - 1 ? lastUserRef : null}
                            className="bg-white border border-border rounded-lg p-4 shadow-sm"
                        >
                            <UserList
                                id={user.id}
                                pseudo={user.pseudo}
                                email={user.email}
                                roles={user.roles}
                                banned={user.banned}
                                onUpdated={() => refreshUser(user.id)}
                            />
                        </div>
                    ))}
                <div ref={lastUserRef} style={{ height: "10px" }}></div>
                {users.length === 0 && !loading && (
                    <p className="text-center text-sm text-gray-400">Aucun utilisateur trouvé.</p>
                )}
                {loading && <p className="text-center text-sm text-gray-400">Chargement...</p>}
                {error && <Error error={error} />}
            </div>
        </div>
    );
}
