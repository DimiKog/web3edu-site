import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function IdentityCard({ metadata, tokenId, wallet, lang = "en" }) {
    const {
        name,
        image,
        attributes = []
    } = metadata || {};

    const role = attributes.find(a => a.trait_type === "Role")?.value;
    const specialization = attributes.find(a => a.trait_type === "Specialization")?.value;
    const isFounder = attributes.find(a => a.trait_type === "Founder")?.value === true;

    const shortWallet = wallet
        ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
        : "";

    // Neon animation trigger
    const [mounted, setMounted] = useState(false);
    const [showQR, setShowQR] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div
            className={`
                relative mx-auto max-w-md
                rounded-3xl p-[2px]
                bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700
                shadow-[0_0_25px_rgba(168,85,247,0.4)]
                transition-all duration-500
                ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
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
                        let normalized = "https://web3edu.dimikog.org/icons/web3edu-identity.png";

                        if (image) {
                            if (typeof image === "string" && image.startsWith("ipfs://")) {
                                const cid = image.replace("ipfs://", "");
                                normalized = `https://gateway.pinata.cloud/ipfs/${cid}`;
                            } else if (typeof image === "string" && image.includes("/ipfs/")) {
                                const parts = image.split("/ipfs/");
                                const cid = parts[1];
                                normalized = `https://gateway.pinata.cloud/ipfs/${cid}`;
                            } else {
                                normalized = image;
                            }
                        }

                        return (
                            <img
                                src={normalized}
                                alt={lang === "gr" ? "Avatar Ιδρυτή" : "Founder Avatar"}
                                className="
                                    w-28 h-28 rounded-full object-cover shadow-lg
                                    ring-[3px] ring-purple-500
                                    hover:ring-purple-300 transition-all duration-300
                                    hover:scale-105
                                "
                                onError={(e) => {
                                    e.target.src = "https://web3edu.dimikog.org/icons/web3edu-identity.png";
                                }}
                            />
                        );
                    })()}

                    {/* Founder Badge */}
                    {isFounder && (
                        <span
                            className="
                                mt-3 px-4 py-1 rounded-full
                                text-sm font-semibold text-white
                                bg-gradient-to-r from-purple-600 to-fuchsia-500
                                shadow-[0_0_12px_rgba(217,70,239,0.7)]
                                animate-pulse
                            "
                        >
                            {lang === "gr" ? "★ Έκδοση Ιδρυτή" : "★ Founder Edition"}
                        </span>
                    )}

                    {/* Name */}
                    <h2
                        className="
                            mt-4 text-2xl font-extrabold
                            text-gray-900 dark:text-white
                            tracking-wide
                        "
                    >
                        {name}
                    </h2>
                </div>

                {/* Metadata Section */}
                <div className="mt-6 space-y-3 text-center">

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
                        target="_blank"
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
                                px-4 py-1 rounded-full text-sm font-semibold
                                bg-gradient-to-r from-purple-700 to-fuchsia-600
                                text-white shadow-md hover:shadow-lg
                                transition-all hover:scale-105
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
                                mt-4 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800
                                shadow-inner border border-purple-400/40
                                flex justify-center
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
