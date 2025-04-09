import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { loadProfil, loadMe } from "../lib/UserService";
import { loadPosts } from "../lib/PostService";
import NavBar from "../component/navBar";
import Profil from "../component/profil";
import Feeds from "../component/feed";

interface User {
  id: number;
  pseudo: string;
  pdp: string;
  bio: string;
  banniere: string;
  locate: string;
  url: string;
}

export default function ProfilPage() {
  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [meUser, setMeUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meData = await loadMe();
        setMeUser(meData);

        if (!username || username === meData.pseudo) {
          setUser(meData);
        } else {
          const profilData = await loadProfil(username);
          setUser(profilData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const loadMyPosts = async (page: number, subscribe?: boolean) => {
    if (!user) return { posts: [], next_page: null };

    const data = await loadPosts(page, subscribe ?? false, user.id);
    return {
      posts: Array.isArray(data.posts) ? data.posts : [],
      next_page: data.next_page ?? null,
    };
  };

  if (typeof username !== "string" || !username.trim()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-element md:flex-row">
      <NavBar user={meUser} />
      <main className="flex flex-1 flex-col items-center px-4 pt-20 md:ml-64 md:pt-8">
        <div className="w-full xl:w-1/2">
          {loading ? (
            <p className="text-center">Chargement du profil...</p>
          ) : user && meUser ? (
            <>
              <section className="mb-6">
                <Profil
                  user={user}
                  type={user.pseudo === meUser.pseudo ? "me" : "other"}
                />
              </section>

              <section className="space-y-4">
                <Feeds key={user.id} loader={loadMyPosts} />
              </section>
            </>
          ) : (
            <div className="mt-8 rounded-xl border border-red-light bg-red-very-light px-4 py-3 text-center text-red shadow-sm">
              <h2 className="text-lg font-medium">Utilisateur introuvable</h2>
              <p className="mt-1 text-sm">
                Le profil <span className="font-bold underline">{username}</span> que vous cherchez n'existe pas ou a été supprimé.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
