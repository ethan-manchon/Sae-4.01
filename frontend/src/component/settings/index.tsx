import React, { useState, useEffect, ChangeEvent } from "react";
import { loadMe, updateUser, uploadImage } from "../../lib/UserService";
import { loadSubscriptions } from "../../lib/SubscribeService";
import { loadBlocked } from "../../lib/BlockedService";
import Button from "../../ui/button";
import Icon from "../../ui/icon";
import Boolean from "../../ui/boolean";
import SubscribeList from "../../ui/subscribeList";
import { usePopover } from "../../ui/popover/context";

export default function Settings() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const [pdp, setPdp] = useState("");
  const [banner, setBanner] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const { showPopover } = usePopover();
  useEffect(() => {
    async function fetchMe() {
      const me = await loadMe();
      if (me) {
        setUserId(me.id);
        setBio(me.bio || "");
        setLocation(me.locate || "");
        setUrl(me.url || "");
        setPdp(me.pdp || "");
        setBanner(me.banner || "");
      }
    }
    fetchMe();
  }, []);

  const fetchSubscriptions = async () => {
    const subs = await loadSubscriptions();
    if (subs) {
      setFollowers(subs.followers);
      setFollowing(subs.following);
    }
  };

  const fectchBlocked = async () => {
    const blocked = await loadBlocked();
    if (blocked) {
      setBlocked(blocked.blocked_users);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fectchBlocked();
  }, []);

  const handlePdpChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await uploadImage(file, "pdp");
    if (data.filename) setPdp("/assets/pdp/" + data.filename);
  };

  const handleBannerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await uploadImage(file, "banner");
    if (data.filename) setBanner("/assets/banner/" + data.filename);
  };

  const handleSave = async () => {
    if (!userId) return;
    console.log("Saving settings..." + pdp + banner);
    const res = await updateUser(userId, {
      bio,
      location,
      url,
      pdp,
      banner,
    });
    if (res.error) {
      showPopover("Erreur lors de la mise à jour : " + res.error);
    } else {
      setConfirmation(true);
      setTimeout(() => setConfirmation(false), 3000);
      toggleSettings();
    }
  };

  const toggleSettings = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <Button onClick={toggleSettings}>Mon compte</Button>

      {confirmation && (
        <div className="fixed right-4 bottom-4 rounded bg-green px-4 py-2 text-white shadow">
          Modifications enregistrées !
        </div>
      )}

      {isOpen && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-grey/75">
          <div className="h-7/8 w-2/3 space-y-4 overflow-y-auto rounded bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <button
                className="cursor-pointer text-xl font-bold"
                onClick={() => setIsSettingsOpen(true)}
              >
                Paramètres
              </button>
              <button
                className="cursor-pointer text-xl font-bold"
                onClick={() => setIsSettingsOpen(false)}
              >
                Abonnements
              </button>
              <Button
                onClick={toggleSettings}
                className="bg-red hover:bg-red-light"
              >
                X
              </Button>
            </div>
            {isSettingsOpen ? (
              <div className="h-7/8 overflow-y-auto p-6">
                <h1 className="text-primary-border-primary-hover mb-6 text-center text-2xl font-bold">
                  Modifier mon profil
                </h1>
                <div>
                  <label className="block font-medium">Bio</label>
                  <textarea
                    className="w-full rounded border p-2"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">Localisation</label>
                  <input
                    className="w-full rounded border p-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">Site web</label>
                  <div className="flex flex-row items-center gap-2">
                    <Icon url={url} />
                    <input
                      type="url"
                      className="w-full rounded border p-2"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Photo de profil (PDP)
                  </label>
                  <div className="relative rounded-lg border-2 border-dashed border-border p-4 text-center transition hover:border-primary-hover">
                    <input
                      type="file"
                      accept="image/*"
                      id="pdp-upload"
                      onChange={handlePdpChange}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <label
                      htmlFor="pdp-upload"
                      className="cursor-pointer text-sm text-element"
                    >
                      Cliquez ici pour importer une image
                    </label>
                  </div>
                  {pdp && (
                    <img
                      src={`${(import.meta as any).env.VITE_API_URL}${pdp}`}
                      alt="pdp preview"
                      className="mt-3 h-20 w-20 rounded-full border-2 border-primary object-cover shadow"
                    />
                  )}
                </div>

                <div className="mt-6">
                  <label className="mb-2 block font-semibold">Bannière</label>
                  <div className="relative rounded-lg border-2 border-dashed border-border p-4 text-center transition hover:border-primary-hover">
                    <input
                      type="file"
                      accept="image/*"
                      id="banner-upload"
                      onChange={handleBannerChange}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <label
                      htmlFor="banner-upload"
                      className="cursor-pointer text-sm text-element"
                    >
                      Cliquez ici pour importer une bannière
                    </label>
                  </div>
                  {banner && (
                    <img
                      src={`${(import.meta as any).env.VITE_API_URL}${banner}`}
                      alt="banner preview"
                      className="mt-3 h-24 w-full rounded border-2 border-primary object-cover shadow"
                    />
                  )}
                </div>

                <Boolean type="refresh" />
                <Boolean type="readOnly" />

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    onClick={toggleSettings}
                    className="bg-red hover:bg-red-light"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="">
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <SubscribeList
                followers={followers}
                following={following}
                blocked={blocked}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
