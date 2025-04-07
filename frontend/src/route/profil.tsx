import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [user, setUser] = useState<User | null>(null);
  const [meUser, setMeUser] = useState<User | null>(null);
  const { username } = useParams<{ username: string }>();

  const loadMyPosts = async (page: number) => {
    if (!user) return { posts: [], next_page: null };

    const data = await loadPosts(page, false);
    return {
      posts: data.posts.filter((post) => post.user.id === user.id),
      next_page: data.next_page,
    };
  };

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
        console.error(error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="min-h-screen bg-white text-element flex flex-col md:flex-row">
      <NavBar user={meUser} />
  
      <main className="flex-1 md:ml-64 flex flex-col items-center pt-20 md:pt-8 px-4 ">
        <div className="w-full xl:w-1/2">
          {user && meUser ? (
            <>
              <section className="mb-6">
                <Profil user={user} type={user.pseudo === meUser.pseudo ? "me" : "other"} />
              </section>
  
              <section className="space-y-4">
                <Feeds key={user.id} loader={loadMyPosts} />
              </section>
            </>
          ) : (
            <p className="text-center">Chargement du profil...</p>
          )}
        </div>
      </main>
    </div>   
  );
}
