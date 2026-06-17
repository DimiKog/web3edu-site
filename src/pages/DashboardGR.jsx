import { useCallback, useEffect, useState, useRef, useReducer, useMemo } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import PageShell from "../components/PageShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import XPProgressCard from "../components/XPProgressCard.jsx";

import { UserIcon, AcademicCapIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { KeyIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import {
    ShareIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { BookOpenIcon as BookOpenIcon2, AcademicCapIcon as AcademicCapIcon2, TrophyIcon as TrophyIcon2 } from "@heroicons/react/24/solid";
import LearningTimeline from "../components/LearningTimeline.jsx";
import DashboardProjectsProgress from "../components/DashboardProjectsProgress.jsx";
import DashboardIdentityAddresses from "../components/DashboardIdentityAddresses.jsx";
import IdentityCard from "../components/IdentityCard.jsx";
import IdentityBackupBanner from "../components/IdentityBackupBanner.jsx";
import SocialLoginRecoveryPrompt from "../components/SocialLoginRecoveryPrompt.jsx";
import SocialWalletHistoryPrompt from "../components/SocialWalletHistoryPrompt.jsx";
import SocialWalletProgressImportSection from "../components/SocialWalletProgressImportSection.jsx";
import { projects } from "../services/projectService.js";
import {
    shortAddress,
} from "../components/identity-ui.jsx";
import { useResolvedIdentityContext } from "../hooks/useResolvedIdentityContext.js";
import { useIdentity } from "../context/useIdentity.js";
import { warnIfIdentityNotInitialized } from "../utils/identityReadiness.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import {
    getSocialIdentityAaAddress,
    getSocialIdentityProvisioningStatus,
    getSocialIdentityWalletAddress,
} from "../utils/socialIdentityPayload.js";
import { ethers } from "ethers";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
    getSocialWalletOnboardingLocalChoice,
    setSocialWalletOnboardingNoContinue,
    setSocialWalletOnboardingYesWallet,
    isSocialWalletOnboardingSnoozed,
    setSocialWalletOnboardingSnoozeSession,
} from "../utils/socialWalletOnboardingStorage.js";
import {
    isProgressImportSnoozed,
    snoozeProgressImport,
} from "../utils/socialProgressImportSnooze.js";
import { useSocialAwareWalletConnect } from "../hooks/useSocialAwareWalletConnect.js";
import { confirmLinkWallet, createLinkWalletChallenge } from "../api/socialIdentity.js";
import { readConnectedEoaAddress } from "../utils/aaIdentity.js";
import { getXpTotalFromBackend } from "../utils/progression.js";

const EDU_NET_EXPLORER = "https://blockexplorer.dimikog.org";
const SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY = "web3edu-social-switch-from-local-aa";
const DASHBOARD_SOCIAL_DEBUG_SESSION_KEY = "web3edu-debug-social-wallet-linkage";
const ADMIN_WALLETS = (
    import.meta.env.VITE_ADMIN_WALLETS ??
    "0x0e66db7d115b8f392eb7dfb8bacb23675daeb59e"
)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

const isAdminWallet = (addr) => Boolean(addr && ADMIN_WALLETS.includes(addr.toLowerCase()));

const DASHBOARD_IDENTITY_DEBUG_FLAG = "web3edu-debug-identity-panel";

const parseCompletedAt = (value) => {
    if (!value) return 0;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
};

const findProjectById = (id) =>
    projects.find(project => project.id === id) || null;

const SPECIAL_PROJECTS = {
    "proof-of-escape": {
        id: "proof-of-escape",
        backendId: "proof-of-escape",
        type: "proof-of-escape",
        title: "Lab 01 — Proof of Escape",
        xp: 500,
    },
    poe: {
        id: "proof-of-escape",
        backendId: "proof-of-escape",
        type: "proof-of-escape",
        title: "Lab 01 — Proof of Escape",
        xp: 500,
    },
};

const findProjectByCompletionKey = (projectId, entry) => {
    const candidateKeys = [
        projectId,
        entry?.id,
        entry?.projectId,
        entry?.project_id,
        entry?.backendId,
        entry?.backend_id,
        entry?.type,
    ].filter(Boolean);

    const matchedProject = projects.find(project =>
        candidateKeys.some(key =>
            key === project.id || key === project.backendId || key === project.type
        )
    );

    if (matchedProject) return matchedProject;

    return candidateKeys
        .map(key => SPECIAL_PROJECTS[String(key).toLowerCase()])
        .find(Boolean) || null;
};

const normalizeRecommendedSlug = (slug) =>
    typeof slug === "string" ? slug.replace(/-gr$/, "") : null;

const LAB_ROUTE_MAP_GR = {
    lab01: "/labs-gr/wallets-keys",
    "wallets-keys": "/labs-gr/wallets-keys",
    lab02: "/labs-gr/lab02",
    lab03: "/labs-gr/lab03",
    lab04: "/labs-gr/lab04",
    lab05: "/labs-gr/lab05",
    lab06: "/labs-gr/lab06",
    dao01: "/labs-gr/dao-01",
    "dao-01": "/labs-gr/dao-01",
    dao02: "/labs-gr/dao-02",
    "dao-02": "/labs-gr/dao-02",
    "system-s0": "/labs-gr/system/s0",
    "system/s0": "/labs-gr/system/s0",
    "system-byzantine-generals": "/labs-gr/system/s0",
    "system-s1": "/labs-gr/system/s1",
    "system/s1": "/labs-gr/system/s1",
    "system-s2": "/labs-gr/system/s2",
    "system/s2": "/labs-gr/system/s2",
    "system-s3": "/labs-gr/system/s3",
    "system/s3": "/labs-gr/system/s3",
    "system-s4": "/labs-gr/system/s4",
    "system/s4": "/labs-gr/system/s4",
    "proof-of-escape": "/labs-gr/proof-of-escape",
};

const resolveRecommendedLabPath = (slug) => {
    if (typeof slug !== "string" || !slug.trim()) return null;
    if (slug.startsWith("/")) return slug;

    const normalizedSlug = normalizeRecommendedSlug(slug)
        ?.replace(/^labs-gr\//, "")
        ?.replace(/^labs\//, "");

    if (!normalizedSlug) return null;

    return LAB_ROUTE_MAP_GR[normalizedSlug] || `/labs-gr/${normalizedSlug}`;
};

const hasCompletedProject = (projectsCompleted, project) => {
    if (!project || !projectsCompleted || typeof projectsCompleted !== "object") {
        return false;
    }

    const candidateKeys = [
        project.backendId,
        project.id,
        project.type,
    ].filter(Boolean);

    return candidateKeys.some(key => Boolean(projectsCompleted[key]));
};

const isCompletedProjectRecommendation = (recommendation, projectsCompleted) => {
    if (!recommendation || recommendation.type !== "project") return false;

    const normalizedSlug = normalizeRecommendedSlug(recommendation.slug);
    if (!normalizedSlug) return false;

    const matchedProject = projects.find(project =>
        project.id === normalizedSlug ||
        project.type === normalizedSlug ||
        project.backendId === normalizedSlug
    );

    if (!matchedProject?.backendId) return false;
    return Boolean(projectsCompleted?.[matchedProject.backendId]);
};

const resolveTopStatusCard = ({
    showGuestWalletLinkUi,
    showSocialProgressImport,
    showTopWalletHistoryPrompt,
    showTopBackupBanner,
    showTopRecoveryPrompt,
    socialSwitchNotice,
}) => {
    if (showGuestWalletLinkUi) return "link-wallet";
    if (showSocialProgressImport) return "import-progress";
    if (showTopWalletHistoryPrompt) return "wallet-history";
    if (showTopBackupBanner) return "backup";
    if (showTopRecoveryPrompt) return "recovery";
    if (socialSwitchNotice) return "social-switch";
    return null;
};

export default function Dashboard() {
    const auth = useAuth();
    const [, bumpWalletOnboarding] = useReducer((c) => c + 1, 0);
    const [, bumpProgressImportSnooze] = useReducer((c) => c + 1, 0);
    const { address, isConnected } = useAccount();
    const location = useLocation();
    const navigate = useNavigate();
    const {
        oidcAuthLoading,
        isOidcAuthenticated,
        idToken: oidcIdToken,
        socialIdentity,
        socialIdentityLoading,
        socialIdentityError,
        resolveNow,
    } = useSocialIdentity();
    const {
        smartAccount,
        owner,
        tokenId: identityTokenId,
        hasIdentity,
        identityHydrated,
        isIdentityReady,
    } = useIdentity();

    const socialAaAddress = getSocialIdentityAaAddress(socialIdentity);
    const identityAddress = useMemo(() => {
        const social = normalizeEvmAddress(socialAaAddress);
        if (isOidcAuthenticated && social) return social;
        const sc = normalizeEvmAddress(smartAccount);
        if (isIdentityReady && sc) return sc;
        return null;
    }, [isOidcAuthenticated, socialAaAddress, smartAccount, isIdentityReady]);

    const wagmiAddrNorm = normalizeEvmAddress(address);
    const sessionAddrNorm = normalizeEvmAddress(readConnectedEoaAddress());
    const connectedWalletNorm = wagmiAddrNorm ?? sessionAddrNorm ?? null;
    const socialLinkedWalletNorm = normalizeEvmAddress(getSocialIdentityWalletAddress(socialIdentity));
    // Backend linkage can be eventually-consistent; after a successful link we optimistically treat
    // the connected wallet as linked so the UI can advance without a full refresh.
    const [optimisticSocialLinkedWalletNorm, setOptimisticSocialLinkedWalletNorm] = useState(null);
    const effectiveSocialLinkedWalletNorm = socialLinkedWalletNorm ?? optimisticSocialLinkedWalletNorm;
    const persistedOwnerNorm = normalizeEvmAddress(owner);
    const canonicalSocialAaNorm = normalizeEvmAddress(socialAaAddress);
    const isSocialCanonical = Boolean(isOidcAuthenticated && canonicalSocialAaNorm);
    const walletAaCanonical =
        Boolean(smartAccount && isIdentityReady) && Boolean(normalizeEvmAddress(smartAccount));

    /**
     * Guard against a brief stale/missing `walletAddress` right after social sign-in.
     * If the payload doesn't yet include the linked wallet, refresh once before showing Stage A.
     */
    const [socialWalletLinkagePhase, setSocialWalletLinkagePhase] = useState("idle"); // idle | loading | done
    const socialProvisioningStatusForLinkage = getSocialIdentityProvisioningStatus(socialIdentity);
    const isSocialLinkageStateSettled = Boolean(
        isSocialCanonical && !socialIdentityLoading && socialProvisioningStatusForLinkage === "active"
    );
    const shouldProbeSocialWalletLinkage = Boolean(
        isSocialCanonical &&
            isConnected &&
            connectedWalletNorm &&
            // Linkage field missing (stale payload window)
            !effectiveSocialLinkedWalletNorm
    );
    useEffect(() => {
        if (!shouldProbeSocialWalletLinkage) {
            if (socialWalletLinkagePhase !== "idle") setSocialWalletLinkagePhase("idle");
            return;
        }
        if (socialWalletLinkagePhase !== "idle") return;
        // If we're still resolving/provisioning, don't prematurely mark this done — just suppress UI.
        if (!isSocialLinkageStateSettled) return;
        setSocialWalletLinkagePhase("loading");
        Promise.resolve(resolveNow?.())
            .catch(() => null)
            .finally(() => setSocialWalletLinkagePhase("done"));
    }, [
        shouldProbeSocialWalletLinkage,
        socialWalletLinkagePhase,
        isSocialLinkageStateSettled,
        resolveNow,
    ]);
    const suppressStagedLinkageUi = Boolean(
        shouldProbeSocialWalletLinkage &&
            (!isSocialLinkageStateSettled || socialWalletLinkagePhase !== "done")
    );

    const showGuestWalletLinkUi =
        Boolean(identityAddress && isConnected && connectedWalletNorm) &&
        !suppressStagedLinkageUi &&
        ((isSocialCanonical &&
            (!effectiveSocialLinkedWalletNorm || connectedWalletNorm !== effectiveSocialLinkedWalletNorm)) ||
            (!isSocialCanonical &&
                walletAaCanonical &&
                persistedOwnerNorm &&
                connectedWalletNorm !== persistedOwnerNorm));

    const [metadata, setMetadata] = useState(null);
    const [socialSwitchNotice, setSocialSwitchNotice] = useState(null);
    const [showTierPopup, setShowTierPopup] = useState(false);
    const [xpLeveledUp, setXpLeveledUp] = useState(false);
    const [profile, setProfile] = useState(null);
    const [addressCopyFeedback, setAddressCopyFeedback] = useState("");
    const [showBuilderUnlock, setShowBuilderUnlock] = useState(false);
    const {
        metadata: resolvedMetadata,
        profile: resolvedProfile,
        resolveData,
        canonicalIdentityKey,
        refetch: refetchResolvedIdentity,
    } = useResolvedIdentityContext();
    const [genesisBadgeOnchain, setGenesisBadgeOnchain] = useState(false);
    const [genesisBadgeOptimistic, setGenesisBadgeOptimistic] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.sessionStorage.getItem("web3edu:badge-minted:genesis") !== "1") return;
        window.sessionStorage.removeItem("web3edu:badge-minted:genesis");
        setGenesisBadgeOptimistic(true);
    }, []);

    useEffect(() => {
        // Genesis is minted to the connected wallet (EOA), not the AA smart account, so prefer EOA.
        const target = address || identityAddress || null;
        if (!target) return;
        if (!window.ethereum?.request) return;

        let cancelled = false;
        (async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const contract = new ethers.Contract(
                    "0x1e9e1515a472aFf340b79dfd3c5b47D307632Fbc",
                    [
                        "function balanceOf(address account, uint256 id) view returns (uint256)",
                        "function balanceOf(address owner) view returns (uint256)",
                    ],
                    provider
                );

                let minted = false;
                try {
                    const bal1155 = await contract["balanceOf(address,uint256)"](target, 1);
                    minted = minted || (typeof bal1155?.toString === "function" ? BigInt(bal1155.toString()) > 0n : false);
                } catch {
                    /* ignore */
                }
                if (!minted) {
                    try {
                        const bal721 = await contract["balanceOf(address)"](target);
                        minted = minted || (typeof bal721?.toString === "function" ? BigInt(bal721.toString()) > 0n : false);
                    } catch {
                        /* ignore */
                    }
                }

                if (!cancelled) setGenesisBadgeOnchain(Boolean(minted));
            } catch {
                /* ignore */
            }
        })();

        return () => { cancelled = true; };
    }, [identityAddress, address]);

    const builderUnlockStorageKey = useMemo(() => {
        const scope = canonicalIdentityKey || identityAddress || "anon";
        return `web3edu-builder-unlock-shown:${scope}`;
    }, [canonicalIdentityKey, identityAddress]);

    const builderClaimedStorageKey = useMemo(() => {
        const scope = canonicalIdentityKey || identityAddress || "anon";
        return `web3edu-builder-claimed:${scope}`;
    }, [canonicalIdentityKey, identityAddress]);

    const [, setBuilderRewardClaimed] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(builderClaimedStorageKey) === "true";
    });

    const [builderUnlockShown, setBuilderUnlockShown] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(builderUnlockStorageKey) === "true";
    });
    const [builderJustClaimed, setBuilderJustClaimed] = useState(false);
    const [showBuilderPath, setShowBuilderPath] = useState(false);
    const [linkWalletPhase, setLinkWalletPhase] = useState("idle"); // idle | loading | success | error
    const [linkWalletError, setLinkWalletError] = useState(null);

    const { signMessageAsync } = useSignMessage();

    const { connectWalletSessionAware, isPending: walletOnboardingConnectPending } =
        useSocialAwareWalletConnect();

    const prevXpRef = useRef(null);
    const prevTierRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setBuilderUnlockShown(localStorage.getItem(builderUnlockStorageKey) === "true");
    }, [builderUnlockStorageKey]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setBuilderRewardClaimed(localStorage.getItem(builderClaimedStorageKey) === "true");
    }, [builderClaimedStorageKey, setBuilderRewardClaimed]);

    useEffect(() => {
        if (!identityHydrated) return;
        if (!identityAddress) {
            if (oidcAuthLoading) {
                return;
            }
            if (isOidcAuthenticated) {
                return;
            }
            warnIfIdentityNotInitialized("DashboardGR", { smartAccount, owner });
            navigate("/join-gr");
            return;
        }
        window.scrollTo(0, 0);
    }, [
        identityHydrated,
        identityAddress,
        navigate,
        smartAccount,
        owner,
        isOidcAuthenticated,
        oidcAuthLoading,
    ]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!isOidcAuthenticated) return;
        const socialCanon = normalizeEvmAddress(socialAaAddress);
        if (!socialCanon) return;
        const from = window.sessionStorage.getItem(SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY);
        const fromNorm = normalizeEvmAddress(from);
        if (!fromNorm) return;
        if (fromNorm.toLowerCase() === socialCanon.toLowerCase()) {
            window.sessionStorage.removeItem(SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY);
            return;
        }
        setSocialSwitchNotice({ from: fromNorm, to: socialCanon });
        window.sessionStorage.removeItem(SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY);
    }, [isOidcAuthenticated, socialAaAddress]);

    useEffect(() => {
        setMetadata(resolvedMetadata ?? null);
        setProfile(resolvedProfile ?? null);
    }, [resolvedMetadata, resolvedProfile, canonicalIdentityKey]);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;
        const onProgress = () => {
            Promise.resolve(refetchResolvedIdentity?.()).catch(() => null);
        };
        window.addEventListener("web3edu-progress-updated", onProgress);
        return () => window.removeEventListener("web3edu-progress-updated", onProgress);
    }, [refetchResolvedIdentity]);

    useEffect(() => {
        // Once backend starts returning the linked wallet reliably, drop the optimistic override.
        if (socialLinkedWalletNorm) setOptimisticSocialLinkedWalletNorm(null);
    }, [socialLinkedWalletNorm]);

    useEffect(() => {
        if (!metadata || typeof metadata.xp_total !== "number") return;

        let timeoutId;
        if (prevXpRef.current == null) {
            prevXpRef.current = metadata.xp_total;
        } else {
            if (metadata.xp_total > prevXpRef.current) {
                setXpLeveledUp(true);
                timeoutId = setTimeout(() => setXpLeveledUp(false), 1200);
            }
            prevXpRef.current = metadata.xp_total;
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [metadata]);

    useEffect(() => {
        if (!metadata?.tier) return;

        if (
            (metadata.tier === "Builder" || metadata.tier === "Architect") &&
            !builderUnlockShown
        ) {
            setShowBuilderUnlock(true);
            setBuilderUnlockShown(true);
            localStorage.setItem(builderUnlockStorageKey, "true");
        }

        prevTierRef.current = metadata.tier;
    }, [metadata, builderUnlockShown, builderUnlockStorageKey]);

    const fallbackMetadata = {
        tier: "Explorer",
        xp_total: 0,
        xp: 0,
        xpPercent: 0,
        remainingXp: 0,
        nextTierPercent: 0,
        lessonsCompleted: 0
    };
    const safeMetadata =
        metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {};
    const displayedMetadata = { ...fallbackMetadata, ...safeMetadata };

    const progressSourceAddress = useMemo(() => {
        const candidates = [
            metadata?.progressSourceAddress,
            metadata?.progressSource,
            profile?.progressSourceAddress,
            profile?.progressSource,
            resolvedMetadata?.progressSourceAddress,
            resolvedMetadata?.progressSource,
            resolvedProfile?.progressSourceAddress,
            resolvedProfile?.progressSource,
        ];
        for (const candidate of candidates) {
            const normalized = normalizeEvmAddress(candidate);
            if (normalized) return normalized;
            if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
        }
        return identityAddress;
    }, [metadata, profile, resolvedMetadata, resolvedProfile, identityAddress]);

    const linkedAccountForDisplay = useMemo(() => {
        if (!walletAaCanonical) return null;
        return persistedOwnerNorm ?? normalizeEvmAddress(owner) ?? null;
    }, [walletAaCanonical, persistedOwnerNorm, owner]);

    const isIdentityMetadataLoading = Boolean(identityAddress) && !metadata && !profile;
    const isTimelineLoading = Boolean(identityAddress) && !metadata && !profile;

    const resolveTokenId = payload => {
        const candidates = [
            payload?.tokenId,
            payload?.token_id,
            payload?.tokenID,
            payload?.metadata?.tokenId,
            payload?.metadata?.token_id,
            payload?.profile?.tokenId,
            payload?.profile?.token_id,
            payload?.metadata?.metadata?.tokenId,
            payload?.metadata?.metadata?.token_id,
            payload?.profile?.metadata?.tokenId,
            payload?.profile?.metadata?.token_id
        ];

        for (const candidate of candidates) {
            if (candidate !== null && candidate !== undefined && candidate !== "") {
                return candidate;
            }
        }

        return null;
    };

    const displayTokenId =
        resolveTokenId(metadata) ?? identityTokenId ?? resolveTokenId(profile) ?? null;

    const handleIdentityViewExplorer = useCallback(() => {
        if (!identityAddress) return;
        window.open(
            `${EDU_NET_EXPLORER}/address/${encodeURIComponent(identityAddress)}`,
            "_blank",
            "noopener,noreferrer"
        );
    }, [identityAddress]);

    const handleIdentityCopyAddress = useCallback(async () => {
        if (!identityAddress) return;
        try {
            await navigator.clipboard.writeText(identityAddress);
            setAddressCopyFeedback("Αντιγράφηκε!");
            window.setTimeout(() => setAddressCopyFeedback(""), 2000);
        } catch {
            alert("Δεν ήταν δυνατή η αντιγραφή της διεύθυνσης.");
        }
    }, [identityAddress]);

    const projectsCompleted =
        metadata?.projectsCompleted && typeof metadata.projectsCompleted === "object"
            ? metadata.projectsCompleted
            : metadata?.projects_completed && typeof metadata.projects_completed === "object"
                ? metadata.projects_completed
                : {};
    const isBuilderTier =
        displayedMetadata?.tier === "Builder" || displayedMetadata?.tier === "Architect";
    const decryptMessageProject = findProjectById("decrypt-message");
    const txInvestigationProject = findProjectById("tx-investigation");
    const hasCompletedProject1 = hasCompletedProject(
        projectsCompleted,
        decryptMessageProject
    );
    const hasCompletedProject2 = hasCompletedProject(
        projectsCompleted,
        txInvestigationProject
    );

    const builderProjectRecommendation = !isBuilderTier
        ? null
        : !hasCompletedProject1
            ? {
                type: "project",
                slug: "decrypt-message",
                title: `Project #1 — ${decryptMessageProject?.titleGR || "Βρες και Αποκρυπτογράφησε Ένα On-Chain Μήνυμα"}`,
                why: "Έφτασες στο επίπεδο Builder. Ξεκίνα με το πρώτο project challenge για να εξασκηθείς στην αποκωδικοποίηση event data και στην ανάκτηση κρυφού μηνύματος.",
                estimatedTime: 15,
                xp: decryptMessageProject?.xp ?? 200,
            }
            : !hasCompletedProject2
                ? {
                    type: "project",
                    slug: "tx-investigation",
                    title: `Project #2 — ${txInvestigationProject?.titleGR || "Ανάλυση Συναλλαγών"}`,
                    why: "Ολοκλήρωσες το Project #1. Συνέχισε στο επόμενο project challenge και εντόπισε ποια συναλλαγή περιέχει το πραγματικό κρυπτογραφημένο payload.",
                    estimatedTime: 20,
                    xp: txInvestigationProject?.xp ?? 350,
                }
                : null;

    // Always provide a recommendation (project-builder path, backend-driven, or fallback)
    const fallbackRecommendation = builderProjectRecommendation || {
        type: "guide",
        title: "Ξεκίνα εδώ — Οδηγός Web3Edu",
        slug: "start-here-gr",
        why: "Αυτός ο σύντομος οδηγός εξηγεί πώς λειτουργεί το Web3Edu και σε βοηθά να επιλέξεις το επόμενο βήμα.",
        estimatedTime: 5,
    };
    const recommendedFromBackend =
        metadata && typeof metadata.recommendedNext === "object"
            ? metadata.recommendedNext
            : null;
    const usableBackendRecommendation = isCompletedProjectRecommendation(
        recommendedFromBackend,
        projectsCompleted
    )
        ? null
        : recommendedFromBackend;
    const hasBackendRecommendation =
        usableBackendRecommendation &&
        (usableBackendRecommendation.title || usableBackendRecommendation.slug);
    const recommended = hasBackendRecommendation
        ? usableBackendRecommendation
        : fallbackRecommendation;
    const isFallbackRecommendation = !hasBackendRecommendation;
    const isBuilderRequired = !!recommended?.builderRequired;
    const recommendedLabPath = resolveRecommendedLabPath(recommended?.slug);

    const greekLabTitlesById = {
        lab01: "Lab 01 — Πορτοφόλια & Web3 Ταυτότητες",
        "wallets-keys": "Lab 01 — Πορτοφόλια & Web3 Ταυτότητες",
        lab02: "Lab 02 — Κρυπτογραφημένα Μηνύματα",
        lab03: "Lab 03 — Υπογραφή Μηνυμάτων & Ιδιοκτησία",
        lab04: "Lab 04 — Συναλλαγές & Gas",
        lab05: "Lab 05 — Έξυπνα Συμβόλαια & Κατάσταση",
        lab06: "Lab 06 — Συναίνεση & Οριστικότητα",
        dao01: "DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία",
        "dao-01": "DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία",
        dao02: "DAO Lab 02 — Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος",
        "dao-02": "DAO Lab 02 — Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος",
        "proof-of-escape": "Lab 01 — Proof of Escape",
        poe: "Lab 01 — Proof of Escape"
    };

    const timelineForGr = (() => {
        const baseTimeline = Array.isArray(metadata?.timeline) ? metadata.timeline : [];
        const merged = new Map();

        baseTimeline.forEach((item, index) => {
            if (!item) return;
            const key = `${item.type || "unknown"}:${item.id || item.slug || index}`;
            merged.set(key, item);
        });

        const completedLabs =
            metadata?.labs_completed && typeof metadata.labs_completed === "object"
                ? metadata.labs_completed
                : metadata?.labs && typeof metadata.labs === "object"
                    ? metadata.labs
                    : {};
        Object.entries(completedLabs).forEach(([labId, entry]) => {
            merged.set(`lab:${labId}`, {
                type: "lab",
                id: labId,
                title: entry?.title || labId,
                xp: entry?.xp || 0,
                badge: entry?.badge,
                completedAt: entry?.completedAt,
            });
        });

        const projectGrants =
            metadata?.projectLabs && typeof metadata.projectLabs === "object"
                ? metadata.projectLabs
                : {};

        Object.entries(projectsCompleted).forEach(([projectId, entry]) => {
            const matchedProject = findProjectByCompletionKey(projectId, entry);
            const projectXp =
                entry?.xp ??
                entry?.xpAwarded ??
                entry?.xp_awarded ??
                projectGrants?.[projectId]?.xp ??
                matchedProject?.xp ??
                0;
            const projectTitle =
                entry?.title ??
                matchedProject?.title ??
                entry?.badge ??
                projectId;

            merged.set(`project:${projectId}`, {
                type: "project",
                id: projectId,
                title: projectTitle,
                badge: entry?.badge,
                xp: projectXp,
                completedAt: entry?.completedAt,
            });
        });

        return [...merged.values()]
            .sort(
                (a, b) => parseCompletedAt(b?.completedAt) - parseCompletedAt(a?.completedAt)
            )
            .map(item => {
                if (!item || item.type !== "lab") return item;

                const itemId = String(item.id || item.slug || "").toLowerCase();
                const mappedTitle = greekLabTitlesById[itemId];
                if (!mappedTitle) return item;

                if (typeof item.title === "object" && item.title !== null) {
                    return {
                        ...item,
                        title: {
                            ...item.title,
                            gr: item.title.gr || mappedTitle
                        }
                    };
                }

                return {
                    ...item,
                    title: mappedTitle
                };
            });
    })();

    const builderChecklist = metadata?.builderChecklist || null;
    const eventBadges = Array.isArray(metadata?.eventBadges) ? metadata.eventBadges : [];
    const hasGenesisBadge = eventBadges.some(b => {
        if (typeof b === "string") {
            return b.toLowerCase().includes("genesis");
        }

        const name = String(b?.name || b?.label || b?.en || b?.gr || "").toLowerCase();
        const id = String(b?.id || b?.slug || "").toLowerCase();
        return name.includes("genesis") || id.includes("genesis");
    });
    const hasGenesisBadgeEffective = hasGenesisBadge || genesisBadgeOptimistic || genesisBadgeOnchain;

    const socialProvisioningStatus = getSocialIdentityProvisioningStatus(socialIdentity);
    const socialOk = socialIdentity?.ok;
    const socialIsActive = Boolean(
        (socialOk === true || socialOk == null) &&
        socialProvisioningStatus === "active" &&
        identityAddress
    );

    const oidcSub =
        typeof auth?.user?.profile?.sub === "string" && auth.user.profile.sub.trim()
            ? auth.user.profile.sub.trim()
            : null;
    const socialAaNormForPrompt = normalizeEvmAddress(socialAaAddress);
    const identityAddrNormForPrompt = normalizeEvmAddress(identityAddress);
    const socialDashboardCanonicalForPrompt = Boolean(
        isOidcAuthenticated &&
            socialIsActive &&
            socialAaNormForPrompt &&
            identityAddrNormForPrompt &&
            identityAddrNormForPrompt === socialAaNormForPrompt
    );
    const walletOnboardingChoice = oidcSub ? getSocialWalletOnboardingLocalChoice(oidcSub) : null;
    const walletOnboardingSnoozed = oidcSub ? isSocialWalletOnboardingSnoozed(oidcSub) : false;

    /** Heuristic: dashboard already reflects meaningful continuity → suppress redundant prompt. */
    const socialContinuityAlreadyReflected = useMemo(() => {
        if (!isSocialCanonical) return false;
        const xp = getXpTotalFromBackend(resolvedMetadata ?? resolvedProfile ?? metadata ?? profile);
        const tier = String(
            (resolvedMetadata?.tier ?? resolvedProfile?.tier ?? metadata?.tier ?? profile?.tier ?? "")
        ).trim();
        const badgeCandidates = [
            resolvedMetadata?.badges,
            resolvedProfile?.badges,
            metadata?.badges,
            profile?.badges,
            resolvedMetadata?.metadata?.badges,
            resolvedProfile?.metadata?.badges,
        ];
        const hasBadges = badgeCandidates.some((b) => Array.isArray(b) && b.length > 0);
        const hasMeaningfulTier = Boolean(tier && tier.toLowerCase() !== "explorer");
        return Boolean((typeof xp === "number" && xp > 0) || hasBadges || hasMeaningfulTier);
    }, [isSocialCanonical, resolvedMetadata, resolvedProfile, metadata, profile]);

    const isConnectedWalletLinkedRecognized = Boolean(
        isSocialCanonical &&
            socialIsActive &&
            connectedWalletNorm &&
            effectiveSocialLinkedWalletNorm &&
            connectedWalletNorm === effectiveSocialLinkedWalletNorm
    );

    const suppressTopWalletHistoryPrompt = Boolean(
        socialDashboardCanonicalForPrompt &&
            isConnectedWalletLinkedRecognized &&
            socialContinuityAlreadyReflected
    );
    const showWalletHistoryPrompt =
        socialDashboardCanonicalForPrompt &&
        Boolean(oidcSub) &&
        walletOnboardingChoice === null &&
        !walletOnboardingSnoozed &&
        !connectedWalletNorm &&
        !suppressTopWalletHistoryPrompt;

    const handleWalletHistoryYes = useCallback(async () => {
        const ok = await connectWalletSessionAware(true);
        if (ok && oidcSub) {
            setSocialWalletOnboardingYesWallet(oidcSub);
        }
        bumpWalletOnboarding();
    }, [connectWalletSessionAware, oidcSub, bumpWalletOnboarding]);

    const handleWalletHistoryNo = useCallback(() => {
        if (oidcSub) {
            setSocialWalletOnboardingNoContinue(oidcSub);
        }
        bumpWalletOnboarding();
    }, [oidcSub, bumpWalletOnboarding]);

    const handleWalletHistoryLater = useCallback(() => {
        if (oidcSub) {
            setSocialWalletOnboardingSnoozeSession(oidcSub);
        }
        bumpWalletOnboarding();
    }, [oidcSub, bumpWalletOnboarding]);

    const progressImportSnoozed =
        Boolean(connectedWalletNorm) &&
        isProgressImportSnoozed(oidcSub, connectedWalletNorm.toLowerCase());
    // "Linked/authorized" = backend-linked wallet matches the connected EOA.
    // When this becomes true (after backend linking is implemented), we unlock Stage B (import).
    const isSocialWalletLinkedAuthorized = Boolean(
        isSocialCanonical &&
            socialIsActive &&
            connectedWalletNorm &&
            effectiveSocialLinkedWalletNorm &&
            connectedWalletNorm === effectiveSocialLinkedWalletNorm
    );
    const showSocialProgressImport =
        isSocialWalletLinkedAuthorized &&
        Boolean(oidcIdToken) &&
        Boolean(connectedWalletNorm) &&
        !progressImportSnoozed &&
        !socialContinuityAlreadyReflected;

    const handleProgressImportSnooze = useCallback(() => {
        if (connectedWalletNorm) {
            snoozeProgressImport(oidcSub, connectedWalletNorm.toLowerCase());
        }
        bumpProgressImportSnooze();
    }, [oidcSub, connectedWalletNorm, bumpProgressImportSnooze]);

    const handleLinkWallet = useCallback(async () => {
        setLinkWalletError(null);

        if (!oidcIdToken) {
            setLinkWalletError("Πρέπει να είσαι συνδεδεμένος/η με social login για να συνδέσεις πορτοφόλι.");
            setLinkWalletPhase("error");
            return;
        }
        if (!connectedWalletNorm) {
            setLinkWalletError("Σύνδεσε πρώτα ένα πορτοφόλι.");
            setLinkWalletPhase("error");
            return;
        }

        setLinkWalletPhase("loading");
        try {
            const challenge = await createLinkWalletChallenge(oidcIdToken, {
                walletAddress: connectedWalletNorm,
            });
            const messageToSign =
                typeof challenge?.messageToSign === "string" && challenge.messageToSign.trim()
                    ? challenge.messageToSign
                    : null;
            if (!messageToSign) {
                throw new Error("Το backend δεν επέστρεψε μήνυμα προς υπογραφή.");
            }

            const signature = await signMessageAsync({ message: messageToSign });
            await confirmLinkWallet(oidcIdToken, {
                walletAddress: connectedWalletNorm,
                signature,
            });

            // Refresh social identity + resolved identity so Stage A disappears and Stage B is eligible.
            try {
                await resolveNow?.();
            } catch {
                /* optional */
            }
            try {
                await refetchResolvedIdentity?.();
            } catch {
                /* optional */
            }

            setOptimisticSocialLinkedWalletNorm(connectedWalletNorm);

            setLinkWalletPhase("success");
        } catch (err) {
            const msg =
                err?.payload?.error ||
                err?.payload?.message ||
                err?.message ||
                "Αποτυχία σύνδεσης πορτοφολιού.";
            setLinkWalletError(String(msg));
            setLinkWalletPhase("error");
        }
    }, [oidcIdToken, connectedWalletNorm, signMessageAsync, resolveNow, refetchResolvedIdentity]);

    const shouldShowBackupBanner = (() => {
        if (typeof window === "undefined") return false;
        if (!isIdentityReady) return false;
        if (!hasIdentity && !smartAccount) return false;
        if (localStorage.getItem("web3edu-identity-backup-banner-dismissed") === "true") {
            return false;
        }
        // Mirror IdentityBackupBanner's `requireNoInjectedWalletSession` behavior for dashboard top-action gating.
        if (readConnectedEoaAddress()) return false;
        return true;
    })();

    const showLinkOrImportBanner = Boolean(showGuestWalletLinkUi || showSocialProgressImport);
    const socialDebugTriggered = (() => {
        if (typeof window === "undefined") return false;
        return (
            window.sessionStorage.getItem(DASHBOARD_SOCIAL_DEBUG_SESSION_KEY) === "true" ||
            Boolean(window.sessionStorage.getItem(SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY))
        );
    })();
    const [socialDebugSnapshot, setSocialDebugSnapshot] = useState(() => {
        if (!socialDebugTriggered) return null;
        return {
            at: new Date().toISOString(),
            isOidcAuthenticated,
            identityAddress,
            isSocialCanonical,
            socialAaAddress,
            wagmiAddrNorm,
            socialLinkedWalletNorm: effectiveSocialLinkedWalletNorm,
            socialIdentityLoading,
            socialWalletLinkagePhase,
            shouldProbeSocialWalletLinkage,
            suppressStagedLinkageUi,
            showGuestWalletLinkUi,
            showLinkOrImportBanner,
        };
    });
    useEffect(() => {
        if (!socialDebugTriggered) return;
        try {
            window.sessionStorage.setItem(DASHBOARD_SOCIAL_DEBUG_SESSION_KEY, "true");
        } catch {
            /* ignore */
        }
    }, [socialDebugTriggered]);

    const debugIdentityFromQuery = (() => {
        try {
            const search = location?.search || window.location.search || "";
            const params = new URLSearchParams(search);
            return params.get("debugIdentity") === "1";
        } catch {
            return false;
        }
    })();

    const isAdminDebugEnabled = (() => {
        if (!address) return false;
        if (!isAdminWallet(address)) return false;
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem(DASHBOARD_IDENTITY_DEBUG_FLAG) === "1";
    })();

    const shouldShowDebugPanel = Boolean(
        socialDebugSnapshot &&
        (import.meta.env.DEV || debugIdentityFromQuery || isAdminDebugEnabled)
    );

    const showOidcSocialGate =
        identityHydrated && !identityAddress && (isOidcAuthenticated || oidcAuthLoading);
    if (showOidcSocialGate) {
        return (
            <PageShell>
                <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Ρύθμιση Web3Edu Identity…
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Αναλύουμε την AA ταυτότητά σου από social login με το backend.
                        </p>

                        {oidcAuthLoading ? (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 animate-pulse">
                                Ολοκλήρωση εισόδου με Web3Edu ή Google…
                            </p>
                        ) : socialIdentityLoading ? (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 animate-pulse">
                                Φόρτωση…
                            </p>
                        ) : socialIdentityError ? (
                            <div className="mt-4 rounded-xl border border-red-200/70 bg-red-50/70 p-4 text-left text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
                                <p className="font-semibold">Δεν ήταν δυνατή η ανάλυση της social ταυτότητας</p>
                                <p className="mt-1 opacity-90">{socialIdentityError}</p>
                                <button
                                    type="button"
                                    onClick={() => void resolveNow()}
                                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
                                >
                                    Δοκίμασε ξανά
                                </button>
                            </div>
                        ) : oidcIdToken ? (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 animate-pulse">
                                Έναρξη αναζήτησης ταυτότητας…
                            </p>
                        ) : (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                                Αναμονή συνεδρίας…
                            </p>
                        )}
                    </div>
                </div>
            </PageShell>
        );
    }
    const showTopWalletHistoryPrompt = Boolean(
        isOidcAuthenticated && showWalletHistoryPrompt && !showLinkOrImportBanner
    );
    const showTopBackupBanner = Boolean(!isOidcAuthenticated && shouldShowBackupBanner);
    const showTopRecoveryPrompt = Boolean(!isOidcAuthenticated && !showTopBackupBanner);
    const showDeviceBasedAccessNote = Boolean(
        identityAddress && isIdentityReady && !isOidcAuthenticated && !connectedWalletNorm
    );
    const topStatusKey = resolveTopStatusCard({
        showGuestWalletLinkUi,
        showSocialProgressImport,
        showTopWalletHistoryPrompt,
        showTopBackupBanner,
        showTopRecoveryPrompt,
        socialSwitchNotice,
    });

    return (
        <PageShell>
            <div
                className="
                    min-h-screen flex flex-col items-center px-6 py-20
                    bg-transparent dark:bg-transparent
                    text-slate-900 dark:text-slate-100
                    relative overflow-hidden transition-colors duration-500
                "
            >
                {shouldShowDebugPanel ? (
                    <div className="relative z-50 w-full max-w-5xl mx-auto mb-4 px-2 md:px-0">
                        <div className="rounded-2xl border border-fuchsia-200/70 bg-fuchsia-50/90 px-4 py-3 text-left text-xs text-fuchsia-950 shadow-sm backdrop-blur-sm dark:border-fuchsia-500/30 dark:bg-fuchsia-950/25 dark:text-fuchsia-50">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-semibold">
                                    DEV snapshot: social wallet linkage first render
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        try {
                                            window.sessionStorage.removeItem(DASHBOARD_SOCIAL_DEBUG_SESSION_KEY);
                                        } catch {
                                            /* ignore */
                                        }
                                        setSocialDebugSnapshot(null);
                                    }}
                                    className="inline-flex items-center justify-center rounded-lg border border-fuchsia-300/60 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-fuchsia-950 hover:bg-white dark:border-fuchsia-500/30 dark:bg-white/10 dark:text-fuchsia-50 dark:hover:bg-white/15"
                                >
                                    Hide
                                </button>
                            </div>
                            <pre className="mt-2 overflow-auto rounded-xl border border-fuchsia-200/70 bg-white/70 p-3 text-[11px] leading-snug text-slate-900 dark:border-fuchsia-500/20 dark:bg-white/5 dark:text-fuchsia-50">
                                {JSON.stringify(socialDebugSnapshot, null, 2)}
                            </pre>
                        </div>
                    </div>
                ) : null}

                <style>
                    {`
                  @keyframes pulseGlow {
                    0% { box-shadow: 0 0 4px rgba(51,214,255,0.2); }
                    50% { box-shadow: 0 0 18px rgba(51,214,255,0.55); }
                    100% { box-shadow: 0 0 4px rgba(51,214,255,0.2); }
                  }

                  @keyframes xpBurst {
                    0%   { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                    40%  { transform: scale(1.08); filter: drop-shadow(0 0 18px rgba(138,87,255,0.6)); }
                    100% { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                  }

                  @keyframes lessonPulse {
                    0%   { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                    40%  { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(138,87,255,0.8)); }
                    100% { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                  }

                  @keyframes genesisPulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 rgba(168,85,247,0); }
                    40% { transform: scale(1.08); box-shadow: 0 0 18px rgba(168,85,247,0.7); }
                    100% { transform: scale(1); box-shadow: 0 0 0 rgba(168,85,247,0); }
                  }
                `}
                </style>

                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"></div>
                    <div className="absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"></div>
                </div>

                {/* 1) User header — labeled identity addresses */}
                {identityAddress ? (
                    <div className="relative z-10 w-full max-w-5xl mx-auto mt-2 mb-6 px-2 md:px-0">
                        <DashboardIdentityAddresses
                            isGR
                            identityAddress={identityAddress}
                            linkedWallet={effectiveSocialLinkedWalletNorm}
                            connectedWallet={isConnected ? connectedWalletNorm : null}
                            linkedAccount={linkedAccountForDisplay}
                            progressSourceAddress={progressSourceAddress}
                            tier={displayedMetadata?.tier}
                            displayTokenId={displayTokenId}
                            isLoading={isIdentityMetadataLoading}
                            onViewExplorer={handleIdentityViewExplorer}
                            onCopyIdentity={handleIdentityCopyAddress}
                            identityCopyFeedback={addressCopyFeedback}
                        />
                        {isOidcAuthenticated && !socialIsActive ? (
                            <div className="mt-3">
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/50 bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:border-amber-600/40 dark:bg-amber-900/40 dark:text-amber-200">
                                    ⚠ Ρύθμιση…
                                </span>
                            </div>
                        ) : null}
                        {showDeviceBasedAccessNote ? (
                            <div className="rounded-xl border border-slate-200/75 bg-white/55 px-4 py-3 text-left shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/35">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                    Τρέχουσα μέθοδος πρόσβασης: ταυτότητα σε αυτό το πρόγραμμα και τη συσκευή σου
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Μπορείς να συνδέσεις λογαριασμό Web3Edu ή πορτοφόλι για ευκολότερη είσοδο αργότερα.
                                </p>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {/* 2) Account status region — explicit priority resolver */}
                {topStatusKey ? (
                    <div className="relative z-10 w-full max-w-5xl mx-auto mt-2 mb-6 px-2 md:px-0">
                        {topStatusKey === "social-switch" ? (
                            <div className="rounded-2xl border border-sky-200/70 bg-sky-50/90 px-4 py-3 text-left text-sm text-sky-950 shadow-sm backdrop-blur-sm dark:border-sky-500/30 dark:bg-sky-950/25 dark:text-sky-50 md:px-4">
                                <p className="font-semibold">Επιτυχής είσοδος</p>
                                <p className="mt-1 text-xs opacity-90 dark:opacity-95">
                                    Ο λογαριασμός Web3Edu έχει τη δική του ταυτότητα. Ο πίνακας τώρα δείχνει την ταυτότητα του λογαριασμού σου.
                                </p>
                                <p className="mt-2 text-[11px] font-mono opacity-80">
                                    {shortAddress(socialSwitchNotice.from)} → {shortAddress(socialSwitchNotice.to)}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSocialSwitchNotice(null)}
                                        className="inline-flex items-center justify-center rounded-lg border border-sky-300/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-sky-950 hover:bg-white dark:border-sky-500/30 dark:bg-white/10 dark:text-sky-50 dark:hover:bg-white/15"
                                    >
                                        ΟΚ
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {topStatusKey === "link-wallet" ? (
                            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-left text-sm text-amber-950 shadow-sm backdrop-blur-sm dark:border-amber-500/35 dark:bg-amber-950/30 dark:text-amber-50 md:px-4">
                                <p className="font-semibold">
                                    Πορτοφόλι συνδεδεμένο — Βήμα 1 απαραίτητο: σύνδεσέ το με την Web3Edu ταυτότητά σου
                                </p>
                                <p className="mt-1 text-xs opacity-90 dark:opacity-95">
                                    Η εισαγωγή προόδου είναι διαθέσιμη μόνο αφού γίνει εξουσιοδότηση/σύνδεση. Συνδεδεμένο EOA:{" "}
                                    <span className="font-mono">{shortAddress(connectedWalletNorm)}</span>
                                </p>
                                <div className="mt-3 rounded-xl border border-amber-300/60 bg-amber-100/70 px-3 py-3 text-xs text-amber-950 dark:border-amber-600/30 dark:bg-amber-950/25 dark:text-amber-50">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold">Βήμα 1 — Σύνδεση πορτοφολιού</p>
                                            <p className="mt-0.5 opacity-90">Εξουσιοδότησε αυτό το συνδεδεμένο πορτοφόλι ώστε να μπορεί να χρησιμοποιηθεί για εισαγωγή προόδου.</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">
                                            Απαραίτητο
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-start justify-between gap-3 border-t border-amber-300/50 pt-3 dark:border-amber-600/30">
                                        <div className="min-w-0">
                                            <p className="font-semibold opacity-70">Βήμα 2 — Εισαγωγή προόδου</p>
                                            <p className="mt-0.5 opacity-70">Θα εμφανιστεί μετά την επιτυχημένη σύνδεση.</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
                                            Αργότερα
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => void handleLinkWallet()}
                                    disabled={linkWalletPhase === "loading"}
                                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-600 dark:hover:bg-amber-500"
                                >
                                    {linkWalletPhase === "loading" ? "Γίνεται σύνδεση…" : "Σύνδεση πορτοφολιού"}
                                </button>
                                {linkWalletPhase === "success" ? (
                                    <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-200" role="status">
                                        Το πορτοφόλι συνδέθηκε. Πλέον μπορείς να εισάγεις πρόοδο.
                                    </p>
                                ) : linkWalletPhase === "error" && linkWalletError ? (
                                    <p className="mt-2 text-xs text-red-800 dark:text-red-200" role="status">
                                        {linkWalletError}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        {topStatusKey === "import-progress" ? (
                            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-left text-sm text-amber-950 shadow-sm backdrop-blur-sm dark:border-amber-500/35 dark:bg-amber-950/30 dark:text-amber-50 md:px-4">
                                <SocialWalletProgressImportSection
                                    isGr
                                    idToken={oidcIdToken}
                                    connectedAddress={connectedWalletNorm ?? address}
                                    onSnooze={handleProgressImportSnooze}
                                    onRefetch={refetchResolvedIdentity}
                                    resolveSocialIdentity={resolveNow}
                                />
                            </div>
                        ) : null}

                        {topStatusKey === "wallet-history" ? (
                            <SocialWalletHistoryPrompt
                                isGr
                                isPending={walletOnboardingConnectPending}
                                onYesConnectWallet={handleWalletHistoryYes}
                                onNoContinue={handleWalletHistoryNo}
                                onLater={handleWalletHistoryLater}
                            />
                        ) : null}

                        {topStatusKey === "backup" ? (
                            <IdentityBackupBanner variant="gr" requireNoInjectedWalletSession />
                        ) : null}

                        {topStatusKey === "recovery" ? <SocialLoginRecoveryPrompt variant="gr" /> : null}
                    </div>
                ) : null}

                {/* 3) HERO: Επόμενη ενέργεια — πλήρες πλάτος */}
                <div className="relative z-10 w-full max-w-5xl mx-auto mt-4 mb-6 px-2 md:px-0">
                    <DashboardCard
                        title="Το επόμενο βήμα σου"
                        className="p-5"
                        icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                    >
                        {showBuilderUnlock ? (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Ξεκλειδώθηκε το Builder milestone
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Έφτασες Builder. Κάνε claim για να αποθηκευτεί σε αυτή τη συσκευή.
                                </p>
                                {builderJustClaimed ? (
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                        ✅ Αποθηκεύτηκε το Builder milestone
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.setItem(builderClaimedStorageKey, "true");
                                            setBuilderRewardClaimed(true);
                                            setBuilderJustClaimed(true);
                                            setTimeout(() => {
                                                setShowBuilderUnlock(false);
                                                setBuilderJustClaimed(false);
                                            }, 1400);
                                        }}
                                        className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
                                    >
                                        Claim Builder milestone
                                    </button>
                                )}
                            </div>
                        ) : recommended ? (
                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(17rem,1fr)] lg:items-start">
                                <div
                                    className="cursor-pointer rounded-2xl border border-slate-200/60 bg-white/45 p-4 shadow-sm backdrop-blur-sm transition hover:bg-white/55 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
                                    onClick={() => {
                                        if (recommended.type === "guide" && recommended.slug) { navigate(`/${recommended.slug}-gr`); return; }
                                        if (recommended.type === "lab" && recommendedLabPath) { navigate(`${recommendedLabPath}-gr`); return; }
                                        if (recommended.type === "lesson" && recommended.slug) { navigate(`/lessons/${recommended.slug}-gr`); return; }
                                        if (recommended.type === "project" && recommended.slug) { navigate(`/projects/${recommended.slug}`); return; }
                                        navigate("/education");
                                    }}
                                >
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold">
                                            {isFallbackRecommendation ? "Συνέχισε τη διαδρομή σου" : "Το επόμενο βήμα σου"}
                                        </p>
                                        {isBuilderRequired && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100/80 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-600/60 text-purple-700 dark:text-purple-300">
                                                Διαδρομή Builder
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white leading-snug">
                                        {typeof recommended.title === "object" ? recommended.title.gr || recommended.title.en : recommended.title}
                                    </p>
                                    {recommended.why && (
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                                            {typeof recommended.why === "object" ? recommended.why.gr || recommended.why.en : recommended.why}
                                        </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                                        {recommended.estimatedTime && <span>⏱ {recommended.estimatedTime} λεπτά</span>}
                                        {recommended.xp && <span>🏅 +{recommended.xp} XP</span>}
                                    </div>
                                    <div className="mt-4">
                                        <span className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-4 py-2.5 text-sm font-semibold text-white shadow-md">
                                            Συνέχεια →
                                        </span>
                                    </div>
                                </div>

                                {builderChecklist ? (
                                    <div className="rounded-2xl border border-purple-300/30 dark:border-purple-700/40 bg-purple-50/70 dark:bg-purple-900/20 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                                                    Διαδρομή Builder
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                                    {builderChecklist.coreLabs?.done && builderChecklist.daoLabs?.done && builderChecklist.proofOfEscape?.done && builderChecklist.xpRequirement?.done
                                                        ? "Builder ξεκλειδωμένο"
                                                        : "Η πρόοδος συνεχίζεται"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowBuilderPath(prev => !prev); }}
                                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                {showBuilderPath ? "Απόκρυψη" : "Δες απαιτήσεις"}
                                            </button>
                                        </div>
                                        {(() => {
                                            const total = 3;
                                            const completed = (builderChecklist.coreLabs?.done ? 1 : 0) + (builderChecklist.daoLabs?.done ? 1 : 0) + (builderChecklist.proofOfEscape?.done ? 1 : 0);
                                            const percent = Math.round((completed / total) * 100);
                                            return (
                                                <div className="mt-4">
                                                    <div className="mb-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                                        <span>Πρόοδος Builder</span>
                                                        <span>{completed}/{total} απαιτήσεις</span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-700 dark:text-slate-200">
                                            <div>{builderChecklist.coreLabs?.done ? "✔" : "⏳"} Core Labs ({builderChecklist.coreLabs?.completed}/{builderChecklist.coreLabs?.required})</div>
                                            <div>{builderChecklist.daoLabs?.done ? "✔" : "⏳"} DAO Labs ({builderChecklist.daoLabs?.completed}/{builderChecklist.daoLabs?.required})</div>
                                            <div>{builderChecklist.proofOfEscape?.done ? "✔" : "⏳"} Proof of Escape</div>
                                            <div>{builderChecklist.xpRequirement?.done ? "✔" : "⏳"} XP ({builderChecklist.xpRequirement?.current}/{builderChecklist.xpRequirement?.required})</div>
                                        </div>
                                        {showBuilderPath ? (
                                            <div className="mt-4 rounded-xl border border-purple-300/30 bg-white/55 px-3 py-3 text-xs text-slate-600 dark:border-purple-700/30 dark:bg-white/[0.04] dark:text-slate-300">
                                                Ολοκλήρωσε τα επόμενα milestones για να προχωρήσεις στη διαδρομή Builder και να ξεκλειδώσεις όλο το μονοπάτι.
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-600 dark:text-slate-300">Φόρτωση πρότασης…</p>
                        )}
                    </DashboardCard>
                </div>

                {/* 4) Κάτω διάταξη dashboard: Πρόοδος + Ενέργειες | Σήματα */}
                <div className="relative z-10 w-full max-w-5xl mx-auto mb-6 px-2 md:px-0 space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                        <div>

                            {/* Πρόοδος + Βαθμίδα */}
                            <DashboardCard
                                title="Πρόοδος"
                                className="p-5"
                                icon={<StarIcon className="w-5 h-5 text-white" />}
                            >
                                <div
                                    className="cursor-pointer rounded-2xl border border-slate-200/60 bg-white/45 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]"
                                    onClick={() => setShowTierPopup(true)}
                                    title="Δες τα οφέλη βαθμίδας"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">Τρέχουσα Βαθμίδα</p>
                                            <p className="mt-1 text-2xl font-bold text-purple-700 dark:text-purple-200">
                                                {metadata?.tier ?? "Explorer"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">Συνολικό XP</p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                                {metadata?.xp_total ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                    {metadata?.tier && metadata.tier !== "Architect" ? (
                                        <div className="mt-4 rounded-xl border border-purple-200/60 bg-purple-50/70 px-3 py-3 text-sm dark:border-purple-700/30 dark:bg-purple-900/20">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                                                Επόμενο Milestone
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                                {metadata.tier === "Builder" ? "Architect" : "Builder"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                                {metadata?.remainingXp ?? 0} XP ακόμα
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/70 px-3 py-3 text-sm dark:border-emerald-700/30 dark:bg-emerald-900/20">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                                                Κατάσταση Βαθμίδας
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                                Η ανώτατη βαθμίδα έχει ξεκλειδωθεί
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <XPProgressCard
                                        xp={metadata?.xp_total ?? 0}
                                        xpPercent={metadata?.xpPercent ?? 0}
                                        remainingXp={metadata?.remainingXp ?? 0}
                                        nextTierPercent={metadata?.nextTierPercent ?? 0}
                                        tier={metadata?.tier ?? "Explorer"}
                                        xpLeveledUp={xpLeveledUp}
                                    />
                                </div>
                                {(metadata?.tier === "Builder" || metadata?.tier === "Architect") ? (
                                    <div className="mt-2 rounded-xl border border-emerald-200/60 bg-emerald-50/70 px-3 py-2.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700/30 dark:bg-emerald-900/20 dark:text-emerald-300">
                                        🟢 Διακυβέρνηση DAO Ενεργή
                                    </div>
                                ) : (
                                    <div className="mt-2 rounded-xl border border-slate-200/70 bg-white/45 px-3 py-2.5 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
                                        🔒 Φτάσε Builder για πρόσβαση DAO
                                    </div>
                                )}
                            </DashboardCard>
                        </div>

                        {/* Σήματα */}
                        <DashboardCard
                            title="Σήματα"
                            className="p-5"
                            icon={<StarIcon className="w-5 h-5 text-white" />}
                        >
                            {(() => {
                                const earnedBadges = Array.isArray(metadata?.badges) ? metadata.badges : [];
                                const earnedEventBadges = Array.isArray(eventBadges) ? eventBadges : [];
                                const totalBadges = earnedBadges.length + earnedEventBadges.length;

                                const renderBadgeLabel = (badge) =>
                                    typeof badge === "string" ? badge : badge?.gr || badge?.en || badge?.label || JSON.stringify(badge);

                                const renderBadgeIcon = (badge) => {
                                    let Icon = StarIcon;
                                    const lower = typeof badge === "string"
                                        ? badge.toLowerCase()
                                        : (badge?.label?.toLowerCase?.() || badge?.en?.toLowerCase?.() || badge?.gr?.toLowerCase?.() || "");
                                    if (lower.includes("wallet")) Icon = KeyIcon;
                                    if (lower.includes("lesson")) Icon = BookOpenIcon;
                                    if (lower.includes("quiz")) Icon = TrophyIcon;
                                    return Icon;
                                };

                                const featuredGenesisBadge = earnedEventBadges.find((badge) => {
                                    const label = typeof badge === "string" ? badge : badge?.name || badge?.label || badge?.en || badge?.gr || "";
                                    return String(label).toLowerCase().includes("genesis");
                                });

                                const regularBadges = earnedBadges.slice(0, 4);
                                const additionalBadgeCount = Math.max(totalBadges - regularBadges.length - (featuredGenesisBadge ? 1 : 0), 0);

                                return (
                                    <div className="space-y-4">
                                        {(featuredGenesisBadge || (hasGenesisBadgeEffective && !featuredGenesisBadge)) ? (
                                            <div className="rounded-2xl border border-purple-300/40 bg-gradient-to-r from-purple-500/85 to-fuchsia-500/85 p-4 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                                                            Κορυφαίο Achievement
                                                        </p>
                                                        <p className="mt-1 text-base font-bold">
                                                            {typeof featuredGenesisBadge === "string" ? featuredGenesisBadge : featuredGenesisBadge?.name || "Genesis Badge"}
                                                        </p>
                                                        <p className="mt-1 text-xs text-white/80">
                                                            Το Genesis event badge είναι ήδη μέρος της συλλογής ταυτότητάς σου.
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-semibold">
                                                        Κερδισμένο
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-purple-200/60 bg-purple-50/70 p-4 dark:border-purple-700/30 dark:bg-purple-900/20">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-700 dark:text-purple-300">
                                                            Διαθέσιμη Ανταμοιβή
                                                        </p>
                                                        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                                            Genesis Event Badge
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                                            Κάνε claim το Genesis badge για να προσθέσεις το πρώτο featured achievement σε αυτή την ταυτότητα.
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-purple-300/40 bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-purple-700 dark:border-purple-600/40 dark:bg-white/10 dark:text-purple-200">
                                                        Έτοιμο
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {totalBadges === 0 ? (
                                            <div className="rounded-2xl border border-slate-200/70 bg-white/50 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                                                <p className="font-semibold text-slate-900 dark:text-white">Δεν υπάρχουν achievements ακόμα</p>
                                                <p className="mt-1">
                                                    Κέρδισε σήματα ολοκληρώνοντας labs, lessons και events. Το πρώτο milestone μπορεί να ξεκινήσει με το Genesis event.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                        Πρόσφατα achievements
                                                    </p>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {totalBadges} συνολικά
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {regularBadges.map((badge, index) => {
                                                        const Icon = renderBadgeIcon(badge);
                                                        return (
                                                            <div
                                                                key={`badge-${index}-${typeof badge === "string" ? badge : badge?.id || "badge"}`}
                                                                className="flex items-center gap-2 rounded-xl border border-indigo-200/60 bg-indigo-50/70 px-3 py-2 text-xs font-semibold text-slate-800 dark:border-indigo-700/30 dark:bg-indigo-900/20 dark:text-slate-100"
                                                            >
                                                                <Icon className="h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-300" />
                                                                <span className="truncate">{renderBadgeLabel(badge)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {earnedEventBadges.filter((badge) => badge !== featuredGenesisBadge).slice(0, 2).map((badge, index) => {
                                                        const label = typeof badge === "string" ? badge : badge?.name || "Event Badge";
                                                        return (
                                                            <div
                                                                key={`event-badge-${index}`}
                                                                className="flex items-center gap-2 rounded-xl border border-purple-200/60 bg-purple-50/70 px-3 py-2 text-xs font-semibold text-slate-900 dark:border-purple-700/30 dark:bg-purple-900/20 dark:text-slate-100"
                                                            >
                                                                <StarIcon className="h-4 w-4 shrink-0 text-purple-500 dark:text-purple-300" />
                                                                <span className="truncate">{label}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {additionalBadgeCount > 0 ? (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        +{additionalBadgeCount} ακόμη achievement{additionalBadgeCount === 1 ? "" : "s"} στη συλλογή σου
                                                    </p>
                                                ) : null}
                                            </div>
                                        )}

                                        {!hasGenesisBadgeEffective ? (
                                            <button
                                                onClick={() => navigate("/events/genesis")}
                                                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white transition shadow-md hover:scale-[1.02]"
                                            >
                                                Κάνε mint το Genesis Event Badge
                                            </button>
                                        ) : null}

                                        <div className="border-t border-slate-200/70 pt-4 dark:border-white/10">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                    Ενέργειες
                                                </p>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    Μπες ξανά γρήγορα
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <button
                                                    onClick={() => navigate("/sbt-view-gr")}
                                                    className="rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                                >
                                                    🏅 Δες το SBT μου
                                                </button>
                                                <button
                                                    onClick={() => navigate("/labs-gr")}
                                                    className="rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                                >
                                                    📚 Συνέχισε τα μαθήματα
                                                </button>
                                                <button
                                                    onClick={() => navigate("/start-here-gr")}
                                                    className="rounded-xl bg-gradient-to-r from-indigo-500/80 to-purple-500/80 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                                >
                                                    🚀 Ξεκίνα εδώ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </DashboardCard>
                    </div>

                    <DashboardProjectsProgress
                        resolveData={resolveData}
                        metadata={metadata}
                        profile={profile}
                        timeline={timelineForGr}
                        isGR
                    />
                </div>

                {/* 5) Χρονολόγιο μάθησης — απόδειξη συμμετοχής */}
                <div className="relative z-10 w-full max-w-5xl mx-auto mb-10 px-2 md:px-0">
                    <LearningTimeline timeline={timelineForGr} lang="gr" isLoading={isTimelineLoading} />
                </div>
                {/* Side Gradient Glow */}
                <div
                    className="pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60"
                ></div>

                {showTierPopup && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl">
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                Οφέλη βαθμίδας
                            </h2>
                            <ul className="text-white/80 text-sm space-y-2">
                                <li>🟣 Explorer — Βασική πρόσβαση, ρόλος στην κοινότητα, παρακολούθηση προόδου</li>
                                <li>🔵 Builder — Ξεκλείδωσε προχωρημένα μαθήματα, πρώιμες προτάσεις DAO</li>
                                <li>🟡 Architect — Πλήρης πρόσβαση DAO, beta δυνατότητες, προτεραιότητα σε σήματα</li>
                            </ul>
                            <p className="text-white/70 text-sm mt-4">
                                Πώς να αναβαθμίσεις τη βαθμίδα σου:
                            </p>
                            <ul className="text-white/80 text-sm space-y-1 mt-1">
                                <li>• Ολοκλήρωσε μαθήματα και κουίζ για να κερδίσεις XP.</li>
                                <li>• Επεστρέφε τακτικά και ολοκλήρωσε τις διαδρομές μάθησης.</li>
                                <li>• Συμμετέχεις σε δράσεις της κοινότητας / DAO (μελλοντικά).</li>
                            </ul>
                            <button
                                onClick={() => setShowTierPopup(false)}
                                className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide"
                            >
                                Κλείσιμο
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageShell>
    );
}
