import React from "react";
import Pdp from "../pdp";

interface SubscriptionProps {
  following: { id: number; pseudo: string; pdp: string }[];
  followers: { id: number; pseudo: string; pdp: string }[];
  blocked: { id: number; pseudo: string; pdp: string }[];
}

export default function SubscribeList({
  following,
  followers,
  blocked,
}: SubscriptionProps) {
  return (
    <div className="">
      <h1 className="mb-6 text-center text-2xl font-bold text-primary">
        Gestion des abonnements
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
          <h2 className="mb-3 border-b pb-2 text-xl font-semibold text-primary">
            Abonnements
          </h2>
          <div className="flex h-fit flex-col gap-4 overflow-y-auto pr-1">
            {following && following.length > 0 ? (
              following.map((user) => (
                <Pdp key={user.id} pseudo={user.pseudo} pdp={user.pdp} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Aucun abonnement</p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
          <h2 className="mb-3 border-b pb-2 text-xl font-semibold text-primary">
            Abonnés
          </h2>
          <div className="flex h-fit flex-col gap-4 overflow-y-auto pr-1">
            {followers && followers.length > 0 ? (
              followers.map((user) => (
                <Pdp key={user.id} pseudo={user.pseudo} pdp={user.pdp} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Aucun abonné</p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
          <h2 className="mb-3 border-b pb-2 text-xl font-semibold text-primary">
            Utilisateurs bloqués
          </h2>
          <div className="flex h-fit flex-col gap-4 overflow-y-auto pr-1">
            {blocked && blocked.length > 0 ? (
              blocked.map((user) => (
                <Pdp key={user.id} pseudo={user.pseudo} pdp={user.pdp} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                Aucun utilisateur bloqué
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
