import { useMemo, useRef, useState } from "react";
import PageShell from "../../components/PageShell.jsx";
import ValidatorCard from "../../components/pos/ValidatorCard.jsx";
import SelectionPanel from "../../components/pos/SelectionPanel.jsx";
import RoundState from "../../components/pos/RoundState.jsx";
import PoSMempool from "../../components/pos/PoSMempool.jsx";

const initialValidators = [
    { id: "A", stake: 10, balance: 10.00 },
    { id: "B", stake: 30, balance: 30.00 },
    { id: "C", stake: 60, balance: 60.00 },
];

const initialMempool = [
    {
        id: "tx1",
        hash: "0xabc123456789abcdef123456789abcdef123456789",
        from: "0xA1B2C3D4E5F6",
        to: "0xF6E5D4C3B2A1",
        valueEth: 1.2,
        feeEth: 0.004,
        gas: 84200,
        nonce: 12,
    },
    {
        id: "tx2",
        hash: "0xdef456789abcdef123456789abcdef123456789abc",
        from: "0x111122223333",
        to: "0x999988887777",
        valueEth: 0.8,
        feeEth: 0.006,
        gas: 126400,
        nonce: 18,
    },
    {
        id: "tx3",
        hash: "0xaaaabbbbccccddddeeeeffff111122223333444455",
        from: "0xABCDEF123456",
        to: "0x654321FEDCBA",
        valueEth: 2.5,
        feeEth: 0.009,
        gas: 65300,
        nonce: 24,
    },
];

const COPY = {
    en: {
        title: "PoS Visualizer",
        eyebrow: "Consensus Lab",
        description: "Adjust validator stake and watch stake-weighted proposer selection progress through proposal, validator attestation, and economic finality.",
        intro: "This visualizer closes the loop from Lab S0, Why Consensus Is So Hard: proof-of-stake turns Byzantine agreement into an economic system where stake deters Sybil identities and a 2/3 supermajority prevents false consensus.",
        sectionInputs: "1. Stake Distribution",
        sectionInputsNote: "More stake increases proposer selection probability, but the network still needs broad validator agreement before a block is accepted.",
        rewardNote: "When a block is finalized, the proposer earns 0.05 ETH and each attestor earns 0.01 ETH. The proposer earns more because it does extra work: assembling the block, ordering transactions, and taking responsibility for its validity. Attestors only need to verify and sign off.",
        sectionProcess: "2. Consensus Process",
        sectionOutputs: "3. Block Output",
        whatThisShows: "What This Shows",
        takeaways: [
            "Stake-weighted randomness ties influence to capital: if a validator stakes 35 ETH out of 100 total ETH, it will, on average, be selected about 35% of the time to propose the next block.",
            "Validation is not a cosmetic checkbox: validators attest that the proposed block is valid, and the chain only accepts it once at least two-thirds of stake agrees, which is about 67% of the vote.",
            "Finality means the block is economically irreversible. Reverting it would require validators to risk slashable stake.",
        ],
    },
    gr: {
        title: "Οπτικοποίηση PoS",
        eyebrow: "Εργαστήριο Συναίνεσης",
        description: "Άλλαξε το stake των validators και δες πώς η stake-weighted επιλογή proposer προχωρά από την πρόταση σε attestation και οικονομική οριστικοποίηση.",
        intro: "Αυτό το εργαλείο κλείνει τον κύκλο από το Lab S0, Why Consensus Is So Hard: το proof-of-stake μετατρέπει τη βυζαντινή συμφωνία σε οικονομικό σύστημα όπου το stake αποτρέπει τα Sybil identities και μια υπερπλειοψηφία 2/3 εμποδίζει το ψευδές consensus.",
        sectionInputs: "1. Κατανομή Stake",
        sectionInputsNote: "Περισσότερο stake σημαίνει μεγαλύτερη πιθανότητα επιλογής proposer, αλλά το δίκτυο χρειάζεται και ευρεία συμφωνία πριν αποδεχτεί το block.",
        rewardNote: "Όταν ένα block οριστικοποιείται, ο proposer κερδίζει 0.05 ETH και κάθε attestor κερδίζει 0.01 ETH. Ο proposer κερδίζει περισσότερο επειδή κάνει επιπλέον δουλειά: συνθέτει το block, ταξινομεί τις συναλλαγές και αναλαμβάνει την ευθύνη για την εγκυρότητά του. Οι attestors απλώς επαληθεύουν και υπογράφουν.",
        sectionProcess: "2. Διαδικασία Συναίνεσης",
        sectionOutputs: "3. Έξοδος Block",
        whatThisShows: "Τι Δείχνει Αυτό",
        takeaways: [
            "Η stake-weighted τυχαιότητα δένει την επιρροή με κεφάλαιο: αν ένας validator έχει 35 ETH από συνολικά 100 ETH, θα επιλέγεται κατά μέσο όρο περίπου στο 35% των περιπτώσεων να προτείνει το επόμενο block.",
            "Η επικύρωση δεν είναι διακοσμητικό checkbox: οι validators βεβαιώνουν ότι το proposed block είναι έγκυρο και η αλυσίδα το αποδέχεται μόνο όταν συμφωνεί τουλάχιστον το 2/3 του stake, δηλαδή περίπου το 67% της ψήφου.",
            "Η οριστικοποίηση σημαίνει ότι το block είναι οικονομικά μη αναστρέψιμο. Η ανατροπή του θα απαιτούσε από validators να ρισκάρουν slashable stake.",
        ],
    },
};

// Splits a takeaway string and wraps numeric tokens (percentages, fractions,
// ETH amounts, plain integers) in an emerald highlight span.
const NUMBER_SPLIT_RE = /(\d+\/\d+|\d+\.?\d*\s*ETH|\d+\.?\d*%|\b\d+\b)/g;
const NUMBER_TEST_RE = /^(\d+\/\d+|\d+\.?\d*\s*ETH|\d+\.?\d*%|\d+)$/;

function highlightNumbers(text) {
    const parts = text.split(NUMBER_SPLIT_RE);
    return parts.map((part, i) =>
        NUMBER_TEST_RE.test(part)
            ? <span key={i} className="font-bold text-emerald-600 dark:text-emerald-400">{part}</span>
            : part
    );
}

function selectValidator(validators) {
    const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);
    const rand = Math.random() * totalStake;

    let cumulative = 0;
    for (const validator of validators) {
        cumulative += validator.stake;
        if (rand <= cumulative) return validator;
    }
}

export default function PoSVisualizer({ lang = "en" }) {
    const copy = COPY[lang] || COPY.en;
    const [validators, setValidators] = useState(initialValidators);
    const [selected, setSelected] = useState(null);
    const [phase, setPhase] = useState("idle");
    const [blockNumber, setBlockNumber] = useState(0);
    const [attestation, setAttestation] = useState(0);
    const [mempool, setMempool] = useState(initialMempool);
    const [selectedTxs, setSelectedTxs] = useState([]);
    const [rewardFlash, setRewardFlash] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const finalizedRef = useRef(false);
    const rewardTimerRef = useRef(null);

    const totalStake = useMemo(() => {
        return Math.max(
            validators.reduce((sum, validator) => sum + validator.stake, 0),
            1
        );
    }, [validators]);

    const finalizeRound = (pickedTxs, proposer) => {
        if (finalizedRef.current) return;
        finalizedRef.current = true;

        if (attestation >= Math.ceil((totalStake * 2) / 3)) {
            setBlockNumber((current) => current + 1);
            setPhase("finalized");
            setMempool((prev) =>
                prev.filter((tx) => !pickedTxs.some((picked) => picked.id === tx.id))
            );

            // Distribute rewards: proposer earns 0.05 ETH, each attestor earns 0.01 ETH
            const rewards = {};
            validators.forEach((v) => {
                rewards[v.id] = proposer && v.id === proposer.id ? 0.05 : 0.01;
            });
            setValidators((prev) =>
                prev.map((v) => ({
                    ...v,
                    balance: parseFloat((v.balance + rewards[v.id]).toFixed(2)),
                }))
            );
            if (rewardTimerRef.current) clearTimeout(rewardTimerRef.current);
            setRewardFlash(rewards);
            rewardTimerRef.current = setTimeout(() => setRewardFlash({}), 3000);
        } else {
            console.log("Consensus failed — insufficient validator agreement");
            setErrorMsg(lang === "gr"
                ? "Αποτυχία συναίνεσης — ανεπαρκής συμφωνία validators"
                : "Consensus failed — insufficient validator agreement"
            );
            setPhase("idle");
            setSelected(null);
            setSelectedTxs([]);
            setTimeout(() => setErrorMsg(""), 2500);
        }
    };

    const handleSelect = () => {
        if (mempool.length === 0) return;
        if (phase !== "idle") return;

        finalizedRef.current = false;

        const validator = selectValidator(validators);
        const picked = [...mempool].sort(() => 0.5 - Math.random()).slice(0, 2);

        setSelected(validator);
        setPhase("selected");
        setSelectedTxs(picked);
        setAttestation(0);
    };

    const handleAdvancePhase = () => {
        if (phase === "selected") {
            setPhase("proposed");
            return;
        }

        if (phase === "proposed") {
            const agreement = Math.floor(totalStake * (0.4 + Math.random() * 0.6));
            setAttestation(agreement);
            setPhase("validated");
            return;
        }

        if (phase === "validated") {
            finalizeRound(selectedTxs, selected);
        }
    };

    const updateStake = (id, value) => {
        setValidators((prev) =>
            prev.map((validator) =>
                validator.id === id ? { ...validator, stake: Number(value) } : validator
            )
        );
    };

    const resetRound = () => {
        if (rewardTimerRef.current) clearTimeout(rewardTimerRef.current);
        finalizedRef.current = false;
        setSelected(null);
        setPhase("idle");
        setBlockNumber(0);
        setAttestation(0);
        setMempool(initialMempool);
        setSelectedTxs([]);
        setRewardFlash({});
    };

    return (
        <PageShell>
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#0F766E]/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#4ACBFF]/14 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(15,118,110,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.6)_1px,transparent_1px)] bg-[size:56px_56px]" />
                </div>

                <main className="relative mx-auto w-full max-w-6xl px-6 py-20 xl:max-w-7xl 2xl:max-w-[1400px]">
                    <div className="max-w-5xl">
                        <span className="inline-flex rounded-full border border-[#0F766E]/30 bg-[#0F766E]/10 px-4 py-1 text-sm font-semibold text-[#0F766E]">
                            {copy.eyebrow}
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                            {copy.title}
                        </h1>
                        <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {copy.description}
                        </p>
                        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {copy.intro}
                        </p>
                        <div className="mt-4 text-xs text-amber-500">
                            {lang === "gr"
                                ? "Με απλά λόγια: το stake δυσκολεύει τα Sybil attacks και ο κανόνας 2/3 μπλοκάρει το ψευδές consensus."
                                : "In short: stake makes Sybil attacks expensive, and the 2/3 rule blocks false consensus."}
                        </div>
                    </div>

                    <section className="mt-10 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60">
                        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-slate-700/60 dark:bg-slate-950/30">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {copy.sectionInputs}
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {copy.sectionInputsNote}
                            </div>

                            <div className="mt-3 rounded-lg border border-amber-200/60 bg-amber-50/60 p-3 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300">
                                💡 {copy.rewardNote}
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {validators.map((validator) => (
                                    <ValidatorCard
                                        key={validator.id}
                                        validator={validator}
                                        totalStake={totalStake}
                                        isSelected={selected?.id === validator.id}
                                        phase={phase}
                                        onStakeChange={updateStake}
                                        reward={rewardFlash[validator.id] ?? null}
                                        lang={lang}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-slate-700/60 dark:bg-slate-950/30">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {copy.sectionProcess}
                                </div>
                                {errorMsg && (
                                    <div className="mb-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                                        {errorMsg}
                                    </div>
                                )}
                                <SelectionPanel
                                    onSelect={handleSelect}
                                    onAdvance={handleAdvancePhase}
                                    phase={phase}
                                    selected={selected}
                                    mempoolLength={mempool.length}
                                    lang={lang}
                                />
                                <RoundState
                                    phase={phase}
                                    totalStake={totalStake}
                                    attestation={attestation}
                                    lang={lang}
                                />
                            </div>

                            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-slate-700/60 dark:bg-slate-950/30">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {copy.sectionOutputs}
                                </div>
                                <PoSMempool
                                    mempool={mempool}
                                    selectedTxs={selectedTxs}
                                    selected={selected}
                                    blockNumber={blockNumber}
                                    phase={phase}
                                    lang={lang}
                                />
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                            <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                                {copy.whatThisShows}
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-3">
                                {copy.takeaways.map((item, index) => (
                                    <div
                                        key={item}
                                        className="rounded-xl border border-emerald-200/80 bg-white/80 p-3 text-sm text-slate-700 dark:border-emerald-900/60 dark:bg-slate-900/40 dark:text-slate-200"
                                    >
                                        <div className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                                            {index + 1}
                                        </div>
                                        <span>{highlightNumbers(item)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={resetRound}
                            className="mt-3 text-xs text-slate-400 hover:underline"
                        >
                            🔁 {lang === "gr" ? "Επαναφορά γύρου" : "Reset round"}
                        </button>
                    </section>
                </main>
            </div>
        </PageShell>
    );
}
