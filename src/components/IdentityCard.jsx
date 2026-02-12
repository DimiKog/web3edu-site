import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import identityFallback from "../assets/icons/identity-icon.webp";

<style jsx>{`
@keyframes slideDownFade {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
}
`}</style>

export default function IdentityCard({ metadata, tokenId, wallet, lang = "en" }) {
    const {
        name,
        image,
        attributes = [],
        role: metaRole,
        specialization: metaSpec,
        speciality: metaSpeciality,
        avatar,
        pfp
    } = metadata || {};

    const role =
        attributes.find(a => (a.trait_type || "").toLowerCase() === "role")?.value ||
        metaRole;
    const specialization =
        attributes.find(a => ["specialization", "speciality"].includes((a.trait_type || "").toLowerCase()))?.value ||
        metaSpec ||
        metaSpeciality;
    const isFounder =
        attributes.find(a => (a.trait_type || "").toLowerCase() === "founder")?.value === true;
    const resolvedImage =
        image ||
        avatar ||
        pfp;

    const shortWallet = wallet
        ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
        : "";

    // Neon animation trigger
    const [mounted, setMounted] = useState(false);
    const [showQR, setShowQR] = useState(false);
    useEffect(() => setMounted(true), []);

    const tier = metadata?.tier || "Explorer";
    const tierGlow =
        tier === "Architect"
            ? "shadow-[0_0_25px_rgba(255,215,0,0.35)]"
            : tier === "Builder"
                ? "shadow-[0_0_22px_rgba(0,200,255,0.25)]"
                : "shadow-[0_0_18px_rgba(168,85,247,0.20)]";

    return (
        <div
            className={`
            relative mx-auto max-w-md
            rounded-3xl p-[2px]
            bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700
            shadow-[0_0_12px_rgba(88,28,135,0.22)]
            transition-all duration-500 ${tierGlow}
            ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
            my-10
        `}
        >
            <div
                className="
                    bg-white dark:bg-gray-900
                    rounded-3xl p-6
                    shadow-xl backdrop-blur-xl
                    border border-gray-800/40 dark:border-gray-600/30
                "
            >

                {/* Top Label */}
                <div className="text-center mb-3">
                    <span
                        className="
                            text-xs tracking-widest font-semibold
                            text-purple-400 uppercase
                        "
                    >
                        {lang === "gr" ? "◆ Ταυτότητα Web3Edu ◆" : "◆ Web3Edu Identity ◆"}
                    </span>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center mt-2">
                    {(() => {
                        let normalized = identityFallback;

                        if (resolvedImage) {
                            if (typeof resolvedImage === "string" && resolvedImage.startsWith("ipfs://")) {
                                const cid = resolvedImage.replace("ipfs://", "");
                                normalized = `https://gateway.pinata.cloud/ipfs/${cid}`;
                            } else if (typeof resolvedImage === "string" && resolvedImage.includes("/ipfs/")) {
                                const parts = resolvedImage.split("/ipfs/");
                                const cid = parts[1];
                                normalized = `https://gateway.pinata.cloud/ipfs/${cid}`;
                            } else {
                                normalized = resolvedImage;
                            }
                        }

                        return (
                            <img
                                src={normalized}
                                alt={lang === "gr" ? "Avatar Ιδρυτή" : "Founder Avatar"}
                                className="
                                    w-32 h-32 rounded-full object-cover
                                    ring-[2.5px] ring-purple-500/40
                                    shadow-[0_0_4px_rgba(168,85,247,0.18)]
                                    transition-all duration-500
                                    hover:shadow-[0_0_8px_rgba(168,85,247,0.28)]
                                "
                                onError={(e) => {
                                    e.target.src = identityFallback;
                                }}
                            />
                        );
                    })()}

                    {isFounder && (
                        <div
                            className="
                                mt-4 relative inline-flex items-center
                                px-6 py-2 rounded-lg
                                bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600
                                border border-fuchsia-300/60
                                shadow-[0_3px_10px_rgba(236,72,153,0.25)]
                                before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2
                                before:w-3 before:h-3 before:bg-gradient-to-br before:from-fuchsia-500 before:to-purple-500
                                before:rotate-45 before:rounded-sm
                                after:content-[''] after:absolute after:-right-3 after:top-1/2 after:-translate-y-1/2
                                after:w-3 after:h-3 after:bg-gradient-to-br after:from-indigo-500 after:to-purple-500
                                after:rotate-45 after:rounded-sm
                            "
                        >
                            <span className="text-white font-bold tracking-wide flex items-center gap-2">
                                ✨ {lang === "gr" ? "Έκδοση Ιδρυτή" : "Founder Edition"} ✨
                            </span>
                        </div>
                    )}

                    {/* Name */}
                    <h2
                        className="
                            mt-3 text-[1.9rem] font-bold tracking-wide
                            text-gray-900 dark:text-white
                        "
                    >
                        {name || metadata?.name || metadata?.displayName || wallet || "Web3Edu Identity"}
                    </h2>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {metadata?.xp !== undefined && (
                            <span className="px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold">
                                XP: {metadata.xp}
                            </span>
                        )}
                        {metadata?.tier && (
                            <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold">
                                {lang === "gr" ? `Επίπεδο: ${metadata.tier}` : `Tier: ${metadata.tier}`}
                            </span>
                        )}
                        {metadata?.edition && (
                            <span className="px-3 py-1 text-xs rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300 font-semibold">
                                {metadata.edition}
                            </span>
                        )}
                    </div>
                </div>

                {/* Metadata Section */}
                <div className="mt-7 space-y-3 text-center">

                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                        <strong className="text-purple-500">{lang === "gr" ? "Ρόλος:" : "Role:"}</strong> {role || "—"}
                    </div>

                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                        <strong className="text-purple-500">{lang === "gr" ? "Ειδίκευση:" : "Specialization:"}</strong> {specialization || "—"}
                    </div>

                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                        <strong className="text-purple-500">{lang === "gr" ? "Πορτοφόλι:" : "Wallet:"}</strong> {shortWallet}
                    </div>

                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                        <strong className="text-purple-500">{lang === "gr" ? "ID Διακριτικού:" : "Token ID:"}</strong> #{tokenId}
                    </div>

                    <a
                        href={`https://blockexplorer.dimikog.org/token/0xdde6a59445538ea146a17dd8745e7ea5288b1a31/instance/${tokenId}`}
                        target="_blank" rel="noopener noreferrer"
                        rel="noopener noreferrer"
                        className="
                            text-purple-600 dark:text-purple-400 
                            underline text-sm hover:text-purple-300 
                            transition-all
                        "
                    >
                        {lang === "gr" ? "Προβολή στο Blockscout →" : "View on Blockscout →"}
                    </a>

                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => setShowQR(!showQR)}
                            className="
                                px-5 py-1.5 rounded-full text-sm font-semibold
                                bg-gradient-to-r from-purple-700 to-fuchsia-600
                                text-white shadow-md hover:shadow-lg
                                transition-all duration-300 hover:scale-105
                            "
                        >
                            {showQR
                                ? lang === "gr" ? "Απόκρυψη QR" : "Hide QR"
                                : lang === "gr" ? "Εμφάνιση QR" : "Show QR"}
                        </button>
                    </div>

                    {showQR && (
                        <div
                            className="
                                mt-4 p-4 rounded-2xl 
                                bg-gray-100 dark:bg-gray-800
                                shadow-inner border border-purple-400/25
                                flex justify-center
                                transition-all duration-500
                                animate-[slideDownFade_0.45s_ease-out]
                            "
                        >
                            <QRCode
                                value={`https://web3edu.dimikog.org/verify/${wallet}`}
                                size={128}
                                bgColor="transparent"
                                fgColor="#a855f7"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="
                    mt-6 flex items-center justify-center gap-2 
                    text-gray-600 dark:text-gray-400
                    text-sm
                ">
                    <LockClosedIcon className="w-5 h-5 text-purple-400" />
                    <span>{lang === "gr" ? "Soulbound • Μη μεταβιβάσιμο" : "Soulbound • Non Transferable"}</span>
                </div>
            </div>
        </div>
    );
}
