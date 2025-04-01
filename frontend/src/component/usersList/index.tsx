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
                { threshold: 0.5 }
            );

            if (node) observer.current.observe(node);
        },
        [loading, nextPage, loadMoreUsers]
    );

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher par pseudo"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-col items-center gap-4 h-96 border-border overflow-y-auto px-2">
                {users
                    .filter((user) =>
                        user.pseudo.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user) => (
                        <UserList
                            key={user.id}
                            id={user.id}
                            pseudo={user.pseudo}
                            email={user.email}
                            roles={user.roles}
                            banned={user.banned}
                            onUpdated={() => refreshUser(user.id)}
                        />
                    ))}
                <div ref={lastUserRef} style={{ height: "10px" }}></div>
            </div>

            {loading && <p className="text-center text-dark mt-2">Chargement...</p>}
            {error && <Error error={error} />}
        </>
    );
}
