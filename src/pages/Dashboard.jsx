import { useCallback, useEffect, useState, useRef, useReducer, useMemo } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import PageShell from "../components/PageShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import XPProgressCard from "../components/XPProgressCard.jsx";

import { UserIcon, AcademicCapIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { KeyIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import {
    ArrowTopRightOnSquareIcon,
    ClipboardDocumentIcon,
    ShareIcon,
    ChevronDownIcon,
    WalletIcon,
} from "@heroicons/react/24/outline";
import { BookOpenIcon as BookOpenIcon2, AcademicCapIcon as AcademicCapIcon2, TrophyIcon as TrophyIcon2 } from "@heroicons/react/24/solid";
import LearningTimeline from "../components/LearningTimeline.jsx";
import IdentityCard from "../components/IdentityCard.jsx";
import IdentityBackupBanner from "../components/IdentityBackupBanner.jsx";
import SocialLoginRecoveryPrompt from "../components/SocialLoginRecoveryPrompt.jsx";
import SocialWalletHistoryPrompt from "../components/SocialWalletHistoryPrompt.jsx";
import SocialWalletProgressImportSection from "../components/SocialWalletProgressImportSection.jsx";
import { projects } from "../services/projectService.js";
import {
    shortAddress,
    AddressIdenticon,
    generateAvatarStyle,
} from "../components/identity-ui.jsx";
import { useIdentity, warnIfIdentityNotInitialized } from "../context/IdentityContext.jsx";
import { useResolvedIdentityContext } from "../hooks/useResolvedIdentityContext.js";
import { exportIdentity } from "../utils/identityExport.js";
import { getXpTotalFromBackend, isTruthyFounderFlag } from "../utils/progression.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import {
    getSocialIdentityAaAddress,
    getSocialIdentityCustodyType,
    getSocialIdentityOwnerAddress,
    getSocialIdentityProvisioningStatus,
    getSocialIdentityWalletAddress,
} from "../utils/socialIdentityPayload.js";
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

const EDU_NET_EXPLORER = "https://blockexplorer.dimikog.org";
const SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY = "web3edu-social-switch-from-local-aa";
const DASHBOARD_SOCIAL_DEBUG_SESSION_KEY = "web3edu-debug-social-wallet-linkage";

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

const LAB_ROUTE_MAP = {
    lab01: "/labs/wallets-keys",
    "wallets-keys": "/labs/wallets-keys",
    lab02: "/labs/lab02",
    lab03: "/labs/lab03",
    lab04: "/labs/lab04",
    lab05: "/labs/lab05",
    lab06: "/labs/lab06",
    dao01: "/labs/dao-01",
    "dao-01": "/labs/dao-01",
    dao02: "/labs/dao-02",
    "dao-02": "/labs/dao-02",
    "system-s0": "/labs/system/s0",
    "system/s0": "/labs/system/s0",
    "system-byzantine-generals": "/labs/system/s0",
    "system-s1": "/labs/system/s1",
    "system/s1": "/labs/system/s1",
    "system-s2": "/labs/system/s2",
    "system/s2": "/labs/system/s2",
    "system-s3": "/labs/system/s3",
    "system/s3": "/labs/system/s3",
    "system-s4": "/labs/system/s4",
    "system/s4": "/labs/system/s4",
    "proof-of-escape": "/labs/proof-of-escape",
};

const resolveRecommendedLabPath = (slug) => {
    if (typeof slug !== "string" || !slug.trim()) return null;
    if (slug.startsWith("/")) return slug;

    const normalizedSlug = normalizeRecommendedSlug(slug)
        ?.replace(/^labs-gr\//, "")
        ?.replace(/^labs\//, "");

    if (!normalizedSlug) return null;

    return LAB_ROUTE_MAP[normalizedSlug] || `/labs/${normalizedSlug}`;
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
    const { disconnectAsync } = useDisconnect();
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
        disconnectIdentity,
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
    const socialOwnerNorm = normalizeEvmAddress(getSocialIdentityOwnerAddress(socialIdentity));
    const socialLinkedWalletNorm = normalizeEvmAddress(getSocialIdentityWalletAddress(socialIdentity));
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
            !socialLinkedWalletNorm
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
            // If linkage isn't settled yet, *always* suppress (prevents the false Step 1 flash).
            (!isSocialLinkageStateSettled || socialWalletLinkagePhase !== "done")
    );

    const showGuestWalletLinkUi =
        Boolean(identityAddress && isConnected && connectedWalletNorm) &&
        !suppressStagedLinkageUi &&
        ((isSocialCanonical &&
            (!socialLinkedWalletNorm || connectedWalletNorm !== socialLinkedWalletNorm)) ||
            (!isSocialCanonical &&
                walletAaCanonical &&
                persistedOwnerNorm &&
                connectedWalletNorm !== persistedOwnerNorm));

    const [metadata, setMetadata] = useState(null);
    const [socialSwitchNotice, setSocialSwitchNotice] = useState(null);
    const [showTierPopup, setShowTierPopup] = useState(false);
    const [xpLeveledUp, setXpLeveledUp] = useState(false);
    const [profile, setProfile] = useState(null);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [addressCopyFeedback, setAddressCopyFeedback] = useState("");
    const [walletCardIdentityCopyTip, setWalletCardIdentityCopyTip] = useState("");
    const [walletCardEoaCopyTip, setWalletCardEoaCopyTip] = useState("");
    const [showBuilderUnlock, setShowBuilderUnlock] = useState(false);
    const {
        metadata: resolvedMetadata,
        profile: resolvedProfile,
        canonicalIdentityKey,
        refetch: refetchResolvedIdentity,
    } = useResolvedIdentityContext();

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
            // If user is OIDC-authenticated, allow the social flow to resolve/provision first.
            if (isOidcAuthenticated) {
                return;
            }
            warnIfIdentityNotInitialized("Dashboard", { smartAccount, owner });
            navigate("/join");
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
        if (resolvedMetadata || resolvedProfile) {
            setLastSyncTime(new Date());
        }
    }, [resolvedMetadata, resolvedProfile, canonicalIdentityKey]);

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

    const isFounder = (() => {
        const m = displayedMetadata || {};
        const p = profile || {};
        const attrs = [
            ...(Array.isArray(m.attributes) ? m.attributes : []),
            ...(Array.isArray(p.attributes) ? p.attributes : []),
        ];

        const attrFounderTrue = attrs.some(
            a =>
                (a?.trait_type || "").toLowerCase() === "founder" &&
                isTruthyFounderFlag(a?.value)
        );

        return (
            isTruthyFounderFlag(m.founder) ||
            isTruthyFounderFlag(p.founder) ||
            isTruthyFounderFlag(m.isFounder) ||
            isTruthyFounderFlag(p.isFounder) ||
            m.edition === "Founder Edition" ||
            p.edition === "Founder Edition" ||
            m.role === "Founder" ||
            p.role === "Founder" ||
            attrFounderTrue
        );
    })();

    const formattedAddress = shortAddress(identityAddress);
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
            setAddressCopyFeedback("Copied!");
            window.setTimeout(() => setAddressCopyFeedback(""), 2000);
        } catch {
            alert("Could not copy address.");
        }
    }, [identityAddress]);

    const handleWalletCardCopyIdentity = useCallback(async () => {
        if (!identityAddress) return;
        try {
            await navigator.clipboard.writeText(identityAddress);
            setWalletCardIdentityCopyTip("Copied!");
            window.setTimeout(() => setWalletCardIdentityCopyTip(""), 2000);
        } catch {
            alert("Could not copy address.");
        }
    }, [identityAddress]);

    const handleWalletCardCopyEoa = useCallback(async () => {
        if (!address) return;
        try {
            await navigator.clipboard.writeText(address);
            setWalletCardEoaCopyTip("Copied!");
            window.setTimeout(() => setWalletCardEoaCopyTip(""), 2000);
        } catch {
            alert("Could not copy address.");
        }
    }, [address]);

    const handleIdentityShare = useCallback(async () => {
        if (!identityAddress) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}#/verify/${identityAddress}`;
        try {
            if (typeof navigator.share === "function") {
                await navigator.share({
                    title: "Web3Edu Identity",
                    text: "View this Web3Edu identity profile",
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert("Verify page link copied to clipboard.");
            }
        } catch (e) {
            if (e?.name === "AbortError") return;
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Verify page link copied to clipboard.");
            } catch {
                alert("Could not share or copy link.");
            }
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
                title: `Project #1 — ${decryptMessageProject?.title || "Find and Decrypt an On-Chain Message"}`,
                why: "You reached Builder. Start with the first project challenge to practice decoding event data and recovering a hidden message.",
                estimatedTime: 15,
                xp: decryptMessageProject?.xp ?? 200,
            }
            : !hasCompletedProject2
                ? {
                    type: "project",
                    slug: "tx-investigation",
                    title: `Project #2 — ${txInvestigationProject?.title || "Transaction Investigation"}`,
                    why: "You completed Project #1. Continue to the next project challenge and identify which transaction contains the real encrypted payload.",
                    estimatedTime: 20,
                    xp: txInvestigationProject?.xp ?? 350,
                }
                : null;

    // Always provide a recommendation (project-builder path, backend-driven, or fallback)
    const fallbackRecommendation = builderProjectRecommendation || {
        type: "guide",
        title: "Start Here — Your Web3 Learning Path",
        slug: "start-here",
        why: "This short guide explains how Web3Edu works and helps you choose what to learn next.",
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

    const builderChecklist = metadata?.builderChecklist || null;
    const timelineEntries = (() => {
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

        return [...merged.values()].sort(
            (a, b) => parseCompletedAt(b?.completedAt) - parseCompletedAt(a?.completedAt)
        );
    })();
    const eventBadges = Array.isArray(metadata?.eventBadges) ? metadata.eventBadges : [];
    const hasGenesisBadge = eventBadges.some(b => {
        if (typeof b === "string") {
            return b.toLowerCase().includes("genesis");
        }

        const name = String(b?.name || b?.label || b?.en || b?.gr || "").toLowerCase();
        const id = String(b?.id || b?.slug || "").toLowerCase();
        return name.includes("genesis") || id.includes("genesis");
    });

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

    /**
     * Heuristic: dashboard already reflects meaningful continuity, so don't show redundant
     * wallet-history onboarding prompts (Founder social + Founder wallet case).
     */
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
            socialLinkedWalletNorm &&
            connectedWalletNorm === socialLinkedWalletNorm
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
        const ok = await connectWalletSessionAware(false);
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
            socialLinkedWalletNorm &&
            connectedWalletNorm === socialLinkedWalletNorm
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
            setLinkWalletError("You must be signed in with social login to link a wallet.");
            setLinkWalletPhase("error");
            return;
        }
        if (!connectedWalletNorm) {
            setLinkWalletError("Connect a wallet first.");
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
                throw new Error("Backend did not return a message to sign.");
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

            setLinkWalletPhase("success");
        } catch (err) {
            const msg =
                err?.payload?.error ||
                err?.payload?.message ||
                err?.message ||
                "Wallet linking failed.";
            setLinkWalletError(String(msg));
            setLinkWalletPhase("error");
        }
    }, [oidcIdToken, connectedWalletNorm, signMessageAsync, resolveNow, refetchResolvedIdentity]);

    const showOidcSocialGate =
        identityHydrated && !identityAddress && (isOidcAuthenticated || oidcAuthLoading);
    if (showOidcSocialGate) {
        return (
            <PageShell>
                <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Setting up your Web3Edu Identity…
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            We’re resolving your social-login AA identity with the backend.
                        </p>

                        {oidcAuthLoading ? (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 animate-pulse">
                                Completing sign-in with Keycloak…
                            </p>
                        ) : socialIdentityLoading ? (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 animate-pulse">
                                Loading…
                            </p>
                        ) : socialIdentityError ? (
                            <div className="mt-4 rounded-xl border border-red-200/70 bg-red-50/70 p-4 text-left text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
                                <p className="font-semibold">Could not resolve social identity</p>
                                <p className="mt-1 opacity-90">{socialIdentityError}</p>
                                <button
                                    type="button"
                                    onClick={() => void resolveNow()}
                                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : oidcIdToken ? (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 animate-pulse">
                                Starting identity lookup…
                            </p>
                        ) : (
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                                Waiting for session…
                            </p>
                        )}
                    </div>
                </div>
            </PageShell>
        );
    }

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

    // DEV-only, on-screen snapshot of first-render linkage values for the wallet-first → social transition.
    const socialDebugTriggered = (() => {
        if (typeof window === "undefined") return false;
        return (
            window.sessionStorage.getItem(DASHBOARD_SOCIAL_DEBUG_SESSION_KEY) === "true" ||
            Boolean(window.sessionStorage.getItem(SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY))
        );
    })();
    const [socialDebugSnapshot, setSocialDebugSnapshot] = useState(() => {
        if (!import.meta.env.DEV || !socialDebugTriggered) return null;
        return {
            at: new Date().toISOString(),
            isOidcAuthenticated,
            identityAddress,
            isSocialCanonical,
            socialAaAddress,
            wagmiAddrNorm,
            socialLinkedWalletNorm,
            socialIdentityLoading,
            socialWalletLinkagePhase,
            shouldProbeSocialWalletLinkage,
            suppressStagedLinkageUi,
            showGuestWalletLinkUi,
            showLinkOrImportBanner,
        };
    });
    useEffect(() => {
        if (!import.meta.env.DEV) return;
        if (!socialDebugTriggered) return;
        try {
            window.sessionStorage.setItem(DASHBOARD_SOCIAL_DEBUG_SESSION_KEY, "true");
        } catch {
            /* ignore */
        }
    }, [socialDebugTriggered]);
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
                {import.meta.env.DEV && socialDebugSnapshot ? (
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

                {/* 1) User header — 1-line identity row */}
                {identityAddress ? (
                    <div className="relative z-10 w-full max-w-5xl mx-auto mt-2 mb-6 space-y-3 px-2 md:px-0">
                        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-nowrap sm:gap-3 dark:border-slate-700/50 dark:bg-slate-900/35">
                            <span className="group relative flex shrink-0">
                                <button
                                    type="button"
                                    onClick={handleIdentityCopyAddress}
                                    aria-label="Copy your AA address"
                                    aria-describedby="dashboard-identicon-tooltip"
                                    className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-purple-400/60 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/45"
                                    style={generateAvatarStyle(identityAddress, displayedMetadata?.tier)}
                                >
                                    <AddressIdenticon address={identityAddress} />
                                    <span className="absolute inset-x-0 bottom-0 flex h-4 items-center justify-center bg-slate-950/65 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                        <ClipboardDocumentIcon className="h-3 w-3" />
                                    </span>
                                </button>
                                <span
                                    id="dashboard-identicon-tooltip"
                                    role="tooltip"
                                    className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-64 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-left text-xs font-medium leading-snug text-slate-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    Your unique identity pattern — generated from your AA address. Click to copy address.
                                </span>
                            </span>
                            {/* Address block: AA address + wallet EOA (wallet users only) */}
                            <span className="min-w-0 flex-1 flex flex-col gap-0.5">
                                <span className="flex min-w-0 items-center gap-2">
                                    <span className="truncate font-mono text-xs text-slate-600 dark:text-slate-300">
                                        {formattedAddress}
                                    </span>
                                    {addressCopyFeedback ? (
                                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-200" role="status">
                                            {addressCopyFeedback}
                                        </span>
                                    ) : null}
                                </span>
                                {walletAaCanonical && (owner || wagmiAddrNorm) && (
                                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                                        <WalletIcon className="w-3 h-3 shrink-0" />
                                        {shortAddress(owner || wagmiAddrNorm)}
                                    </span>
                                )}
                            </span>
                            <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
                                {isIdentityMetadataLoading ? (
                                    <>
                                        <span className="h-4 w-14 shrink-0 animate-pulse rounded bg-slate-200/80 dark:bg-slate-700/70" />
                                        <span className="h-6 w-24 shrink-0 animate-pulse rounded-full bg-purple-100/80 dark:bg-purple-900/40" />
                                    </>
                                ) : (
                                    <>
                                        {displayTokenId != null && (
                                            <span className="shrink-0 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                                #{displayTokenId}
                                            </span>
                                        )}
                                        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-600/60 px-3 py-1 text-[11px] font-semibold text-purple-700 dark:text-purple-200">
                                            <span className="inline-flex h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400" />
                                            {displayedMetadata?.tier ?? "Explorer"}
                                        </span>
                                    </>
                                )}
                                {/* Explorer link */}
                                <button
                                    type="button"
                                    onClick={handleIdentityViewExplorer}
                                    title="View on block explorer"
                                    disabled={!identityAddress}
                                    className="shrink-0 rounded-lg border border-slate-200/70 bg-slate-50/80 p-1.5 text-slate-500 hover:text-violet-700 hover:bg-violet-50/70 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-violet-300 transition-colors disabled:opacity-40"
                                >
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                </button>
                                {isOidcAuthenticated && !socialIsActive && (
                                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-300/50 dark:border-amber-600/40 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                                        ⚠ Setting up…
                                    </span>
                                )}
                            </div>
                        </div>
                        {showDeviceBasedAccessNote ? (
                            <div className="rounded-xl border border-slate-200/75 bg-white/55 px-4 py-3 text-left shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/35">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                    Current access method: device-based identity
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    You can connect a Web3Edu account or wallet for easier sign-in later.
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
                                <p className="font-semibold">Signed in successfully</p>
                                <p className="mt-1 text-xs opacity-90 dark:opacity-95">
                                    Your Web3Edu account has its own identity. This dashboard is now showing your account identity.
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
                                        Got it
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {topStatusKey === "link-wallet" ? (
                            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-left text-sm text-amber-950 shadow-sm backdrop-blur-sm dark:border-amber-500/35 dark:bg-amber-950/30 dark:text-amber-50 md:px-4">
                                <p className="font-semibold">Wallet connected — Step 1 required: link it to your Web3Edu identity</p>
                                <p className="mt-1 text-xs opacity-90 dark:opacity-95">
                                    Import is only available after your wallet is authorized/linked. Connected EOA:{" "}
                                    <span className="font-mono">{shortAddress(connectedWalletNorm)}</span>
                                </p>
                                <div className="mt-3 rounded-xl border border-amber-300/60 bg-amber-100/70 px-3 py-3 text-xs text-amber-950 dark:border-amber-600/30 dark:bg-amber-950/25 dark:text-amber-50">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold">Step 1 — Link wallet</p>
                                            <p className="mt-0.5 opacity-90">Authorize this connected wallet so it can be used for progress import.</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">
                                            Required
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-start justify-between gap-3 border-t border-amber-300/50 pt-3 dark:border-amber-600/30">
                                        <div className="min-w-0">
                                            <p className="font-semibold opacity-70">Step 2 — Import progress</p>
                                            <p className="mt-0.5 opacity-70">We’ll show this after linking succeeds.</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
                                            Later
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => void handleLinkWallet()}
                                    disabled={linkWalletPhase === "loading"}
                                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-600 dark:hover:bg-amber-500"
                                >
                                    {linkWalletPhase === "loading" ? "Linking…" : "Link Wallet"}
                                </button>
                                {linkWalletPhase === "success" ? (
                                    <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-200" role="status">
                                        Wallet linked. You can now import progress.
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
                                isGr={false}
                                isPending={walletOnboardingConnectPending}
                                onYesConnectWallet={handleWalletHistoryYes}
                                onNoContinue={handleWalletHistoryNo}
                                onLater={handleWalletHistoryLater}
                            />
                        ) : null}

                        {topStatusKey === "backup" ? (
                            <IdentityBackupBanner variant="en" requireNoInjectedWalletSession />
                        ) : null}

                        {topStatusKey === "recovery" ? <SocialLoginRecoveryPrompt variant="en" /> : null}
                    </div>
                ) : null}

                {/* 3) HERO: Next Action — full width, most important element */}
                <div className="relative z-10 w-full max-w-5xl mx-auto mt-4 mb-6 px-2 md:px-0">
                    <DashboardCard
                        title="Your next step"
                        className="p-5"
                        icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                    >
                        {showBuilderUnlock ? (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Builder milestone unlocked
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    You reached Builder. Claim the milestone to acknowledge it on this device.
                                </p>
                                {builderJustClaimed ? (
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                        ✅ Builder milestone saved
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
                                        if (recommended.type === "guide" && recommended.slug) { navigate(`/${recommended.slug}`); return; }
                                        if (recommended.type === "lab" && recommendedLabPath) { navigate(recommendedLabPath); return; }
                                        if (recommended.type === "lesson" && recommended.slug) { navigate(`/lessons/${recommended.slug}`); return; }
                                        if (recommended.type === "project" && recommended.slug) { navigate(`/projects/${recommended.slug}`); return; }
                                        navigate("/education");
                                    }}
                                >
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold">
                                            {isFallbackRecommendation ? "Continue your path" : "Your next step"}
                                        </p>
                                        {isBuilderRequired && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100/80 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-600/60 text-purple-700 dark:text-purple-300">
                                                Builder Path
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white leading-snug">
                                        {typeof recommended.title === "object" ? recommended.title.en || recommended.title.gr : recommended.title}
                                    </p>
                                    {recommended.why && (
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                                            {typeof recommended.why === "object" ? recommended.why.en || recommended.why.gr : recommended.why}
                                        </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                                        {recommended.estimatedTime && <span>⏱ {recommended.estimatedTime} min</span>}
                                        {recommended.xp && <span>🏅 +{recommended.xp} XP</span>}
                                    </div>
                                    <div className="mt-4">
                                        <span className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-4 py-2.5 text-sm font-semibold text-white shadow-md">
                                            Continue →
                                        </span>
                                    </div>
                                </div>

                                {builderChecklist ? (
                                    <div className="rounded-2xl border border-purple-300/30 dark:border-purple-700/40 bg-purple-50/70 dark:bg-purple-900/20 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                                                    Builder Path
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                                    {builderChecklist.coreLabs?.done && builderChecklist.daoLabs?.done && builderChecklist.proofOfEscape?.done && builderChecklist.xpRequirement?.done
                                                        ? "Builder unlocked"
                                                        : "Progress in motion"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowBuilderPath(prev => !prev); }}
                                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                {showBuilderPath ? "Hide details" : "View requirements"}
                                            </button>
                                        </div>
                                        {(() => {
                                            const total = 3;
                                            const completed = (builderChecklist.coreLabs?.done ? 1 : 0) + (builderChecklist.daoLabs?.done ? 1 : 0) + (builderChecklist.proofOfEscape?.done ? 1 : 0);
                                            const percent = Math.round((completed / total) * 100);
                                            return (
                                                <div className="mt-4">
                                                    <div className="mb-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                                        <span>Builder Progress</span>
                                                        <span>{completed}/{total} requirements</span>
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
                                                Complete the remaining milestones to move through the Builder track and unlock the full path.
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-600 dark:text-slate-300">Loading recommendation…</p>
                        )}
                    </DashboardCard>
                </div>

                {/* 4) Lower dashboard layout: Progress + Quick Actions | Badges */}
                <div className="relative z-10 w-full max-w-5xl mx-auto mb-6 px-2 md:px-0">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                        <div>

                            {/* Progress + Rank */}
                            <DashboardCard
                                title="Progress"
                                className="p-5"
                                icon={<StarIcon className="w-5 h-5 text-white" />}
                            >
                                <div
                                    className="cursor-pointer rounded-2xl border border-slate-200/60 bg-white/45 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]"
                                    onClick={() => setShowTierPopup(true)}
                                    title="View tier benefits"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">Current Tier</p>
                                            <p className="mt-1 text-2xl font-bold text-purple-700 dark:text-purple-200">
                                                {metadata?.tier ?? "Explorer"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">Total XP</p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                                {metadata?.xp_total ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                    {metadata?.tier && metadata.tier !== "Architect" ? (
                                        <div className="mt-4 rounded-xl border border-purple-200/60 bg-purple-50/70 px-3 py-3 text-sm dark:border-purple-700/30 dark:bg-purple-900/20">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                                                Next Milestone
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                                {metadata.tier === "Builder" ? "Architect" : "Builder"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                                {metadata?.remainingXp ?? 0} XP to go
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/70 px-3 py-3 text-sm dark:border-emerald-700/30 dark:bg-emerald-900/20">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                                                Tier Status
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                                Top tier unlocked
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
                                        🟢 DAO Governance Active
                                    </div>
                                ) : (
                                    <div className="mt-2 rounded-xl border border-slate-200/70 bg-white/45 px-3 py-2.5 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
                                        🔒 Reach Builder to unlock DAO governance
                                    </div>
                                )}
                            </DashboardCard>
                        </div>

                        {/* Badges */}
                        <DashboardCard
                            title="Badges"
                            className="p-5"
                            icon={<StarIcon className="w-5 h-5 text-white" />}
                        >
                            {(() => {
                                const earnedBadges = Array.isArray(metadata?.badges) ? metadata.badges : [];
                                const earnedEventBadges = Array.isArray(eventBadges) ? eventBadges : [];
                                const totalBadges = earnedBadges.length + earnedEventBadges.length;

                                const renderBadgeLabel = (badge) =>
                                    typeof badge === "string" ? badge : badge?.en || badge?.gr || badge?.label || JSON.stringify(badge);

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
                                        {featuredGenesisBadge ? (
                                            <div className="rounded-2xl border border-purple-300/40 bg-gradient-to-r from-purple-500/85 to-fuchsia-500/85 p-4 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                                                            Featured Achievement
                                                        </p>
                                                        <p className="mt-1 text-base font-bold">
                                                            {typeof featuredGenesisBadge === "string" ? featuredGenesisBadge : featuredGenesisBadge?.name || "Genesis Badge"}
                                                        </p>
                                                        <p className="mt-1 text-xs text-white/80">
                                                            Your Genesis event badge is already part of your identity collection.
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-semibold">
                                                        Earned
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-purple-200/60 bg-purple-50/70 p-4 dark:border-purple-700/30 dark:bg-purple-900/20">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-700 dark:text-purple-300">
                                                            Available Reward
                                                        </p>
                                                        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                                            Genesis Event Badge
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                                            Claim the Genesis badge to add your first featured achievement to this identity.
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-purple-300/40 bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-purple-700 dark:border-purple-600/40 dark:bg-white/10 dark:text-purple-200">
                                                        Ready
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {totalBadges === 0 ? (
                                            <div className="rounded-2xl border border-slate-200/70 bg-white/50 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                                                <p className="font-semibold text-slate-900 dark:text-white">No achievements yet</p>
                                                <p className="mt-1">
                                                    Earn badges by completing labs, lessons, and events. Your first milestone can start with the Genesis event.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                        Recent achievements
                                                    </p>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {totalBadges} total
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
                                                        +{additionalBadgeCount} more achievement{additionalBadgeCount === 1 ? "" : "s"} in your collection
                                                    </p>
                                                ) : null}
                                            </div>
                                        )}

                                        {!hasGenesisBadge ? (
                                            <button
                                                onClick={() => navigate("/events/genesis")}
                                                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white transition shadow-md hover:scale-[1.02]"
                                            >
                                                Mint Genesis Event Badge
                                            </button>
                                        ) : null}

                                        <div className="border-t border-slate-200/70 pt-4 dark:border-white/10">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                    Quick Actions
                                                </p>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    Jump back in
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <button
                                                    onClick={() => navigate("/sbt-view")}
                                                    className="rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                                >
                                                    🏅 View My SBT
                                                </button>
                                                <button
                                                    onClick={() => navigate("/labs")}
                                                    className="rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                                >
                                                    📚 Continue Learning
                                                </button>
                                                <button
                                                    onClick={() => navigate("/start-here")}
                                                    className="rounded-xl bg-gradient-to-r from-indigo-500/80 to-purple-500/80 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                                >
                                                    🚀 Start Here
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </DashboardCard>
                    </div>
                </div>

                {/* 5) Learning Timeline — proof of participation */}
                <div className="relative z-10 w-full max-w-5xl mx-auto mb-10 px-2 md:px-0">
                    <LearningTimeline timeline={timelineEntries} isLoading={isTimelineLoading} />
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
                                Tier Benefits
                            </h2>
                            <ul className="text-white/80 text-sm space-y-2">
                                <li>🟣 Explorer — Basic access, community role, progress tracking</li>
                                <li>🔵 Builder — Unlock advanced lessons, early DAO proposals</li>
                                <li>
                                    🟡 Architect — Full DAO access, beta features, priority badges
                                </li>
                            </ul>
                            <p className="text-white/70 text-sm mt-4">
                                How to upgrade your tier:
                            </p>
                            <ul className="text-white/80 text-sm space-y-1 mt-1">
                                <li>• Complete lessons and quizzes to earn XP.</li>
                                <li>• Return regularly and finish learning paths.</li>
                                <li>• Participate in community / DAO activities (future).</li>
                            </ul>
                            <button
                                onClick={() => setShowTierPopup(false)}
                                className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageShell>
    );
}
