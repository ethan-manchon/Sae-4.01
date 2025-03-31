import React, { useState, useEffect, ChangeEvent } from "react";
import { loadMe, updateUser, uploadImage } from "../../lib/UserService";
import { loadSubscriptions } from "../../lib/SubscribeService";
import Button from "../../ui/button";
import Pdp from "../../ui/pdp";
import Icon from "../../ui/icon";
import Boolean from "../../ui/boolean";

export default function Settings() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [url, setUrl] = useState("");
    const [pdp, setPdp] = useState("");
    const [banner, setBanner] = useState("");
    const [confirmation, setConfirmation] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchMe() {
            const me = await loadMe();
            if (me) {
                setIsChecked(me.refresh);
                setUserId(me.id);
                setBio(me.bio || "");
                setLocation(me.location || "");
                setUrl(me.url || "");
                setPdp(me.pdp || "");
                setBanner(me.banner || "");
            }
        }
        fetchMe();
    }, []);

    useEffect(() => {
        async function fetchSubscriptions() {
            const me = await loadMe();
            console.log(me.id);
            if (me) {
                const subs = await loadSubscriptions(me.id);
                setSubscriptions(subs);
            }
        }
        fetchSubscriptions();
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

    interface Subscription {
        following: { id: number; pseudo: string }[];
        followers: { id: number; pseudo: string }[];
        blocked: { id: number; pseudo: string }[];
    }

    const [subscriptions, setSubscriptions] = useState<Subscription | null>(null);

    const handleSave = async () => {
        if (!userId) return;

        const res = await updateUser(userId, { bio, location, url, pdp, banner, refresh: isChecked });
        if (res.error) {
            alert("Erreur lors de la mise à jour : " + res.error);
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
                <div className="fixed bottom-4 right-4 bg-green text-white px-4 py-2 rounded shadow">
                    Modifications enregistrées !
                </div>
            )}

            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-grey/75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-xl w-2/3 max-h-[90vh] overflow-y-auto space-y-4">

                        <div className="flex items-center justify-between mb-4">
                            <button className="text-xl font-bold" onClick={() => setIsSettingsOpen(true)}>Paramètres</button>
                            <button className="text-xl font-bold" onClick={() => setIsSettingsOpen(false)}>Abonnements</button>
                            <Button onClick={toggleSettings} className="bg-red hover:bg-red-light">X</Button>
                        </div>
                        {isSettingsOpen ? (
                            <>
                                <div>
                                    <label className="block font-medium">Bio</label>
                                    <textarea className="w-full border p-2 rounded" value={bio} onChange={(e) => setBio(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block font-medium">Localisation</label>
                                    <input className="w-full border p-2 rounded" value={location} onChange={(e) => setLocation(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block font-medium">Site web</label>
                                    <div className="flex flex-row items-center gap-2">
                                        <Icon url={url} />
                                        <input type="url" className="w-full border p-2 rounded" value={url} onChange={(e) => setUrl(e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium">Photo de profil (PDP)</label>
                                    <input type="file" accept="image/*" onChange={handlePdpChange} />
                                    {pdp && <img src={pdp} alt="pdp preview" className="mt-2 w-20 h-20 rounded-full object-cover" />}
                                </div>

                                <div>
                                    <label className="block font-medium">Bannière</label>
                                    <input type="file" accept="image/*" onChange={handleBannerChange} />
                                    {banner && <img src={banner} alt="banner preview" className="mt-2 w-full h-24 object-cover rounded" />}
                                </div>

                                <Boolean />

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button onClick={toggleSettings} className="bg-red hover:bg-red-light">Cancel</Button>
                                    <Button onClick={handleSave} className="">Save Changes</Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <h2 className="text-xl font-semibold text-primary">Abonnements</h2>
                                <div className="flex flex-col mt-2 gap-4 max-h-40 overflow-y-auto">
                                    {subscriptions && subscriptions.following && subscriptions.following.length > 0 ? (
                                        subscriptions.following.map((subscription: { id: number; pseudo: string }) => (
                                            <Pdp key={subscription.id} pseudo={subscription.pseudo}></Pdp>
                                        ))
                                    ) : (
                                        <p className="text-sm text-fg mb-2">Aucun abonnements.</p>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-primary">Abonnés</h2>
                                <div className="flex flex-col gap-3 max-h-40 overflow-y-auto">
                                    {subscriptions && subscriptions.followers && subscriptions.followers.length > 0 ? (
                                        subscriptions.followers.map((subscription: { id: number; pseudo: string }) => (
                                            <Pdp key={subscription.id} pseudo={subscription.pseudo}></Pdp>
                                        ))
                                    ) : (
                                        <p className="text-sm text-fg mb-2">Aucun abonnements.</p>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-primary">Utilisateurs bloqué </h2>
                                <p className="text-sm text-fg mb-2">Aucun utilisateur bloqué.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}