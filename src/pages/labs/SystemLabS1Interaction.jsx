import { useState, useEffect, useRef } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";
import BlockchainView from "../../components/mining/BlockchainView";
import { createGenesisBlock, hashBlock } from "../../utils/mining";

function createSampleTx(id, from, to, valueEth, gas, maxFeeGwei, nonce) {
  return {
    id,
    hash: `0x${String(id).padStart(64, "0")}`,
    from,
    to,
    valueEth,
    gas,
    maxFeeGwei,
    nonce,
  };
}

function createBlock(index, previousHash, transactions, nonce, blockDifficulty = 2) {
  let validNonce = nonce;
  let hash = hashBlock({ previousHash, transactions, nonce: validNonce });

  if (blockDifficulty > 0) {
    const target = "0".repeat(blockDifficulty);
    let cleanHash = hash.startsWith("0x") ? hash.slice(2) : hash;

    while (!cleanHash.startsWith(target)) {
      validNonce += 1;
      hash = hashBlock({ previousHash, transactions, nonce: validNonce });
      cleanHash = hash.startsWith("0x") ? hash.slice(2) : hash;
    }
  }

  return { index, previousHash, transactions, nonce: validNonce, hash, blockDifficulty };
}

function createInitialChain() {
  const genesis = createGenesisBlock();
  const block1 = createBlock(
    1,
    genesis.hash,
    [
      createSampleTx(1, "0xalice", "0xbob", "0.50", 21000, 15, 1),
      createSampleTx(2, "0xcarla", "0xdana", "1.20", 34000, 18, 2),
    ],
    318
  );
  const block2 = createBlock(
    2,
    block1.hash,
    [createSampleTx(3, "0xbob", "0xemma", "0.10", 21000, 14, 3)],
    902
  );
  return [genesis, block1, block2];
}

export default function SystemLabS1Interaction({ lang = "en" }) {
  const [step, setStep] = useState(0);
  const [chain, setChain] = useState(() => createInitialChain());
  const previousBrokenIndexRef = useRef(-1);
  const [labState, setLabState] = useState({
    chain,
    firstBrokenIndex: -1,
    activeBlock: null,
  });
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const firstBrokenIndex = labState.firstBrokenIndex;

  const firstBrokenBlockNumber =
    firstBrokenIndex >= 0
      ? (labState.chain?.[firstBrokenIndex]?.index ?? firstBrokenIndex)
      : -1;

  const hasRepairedFirstBroken =
    previousBrokenIndexRef.current !== -1 &&
    firstBrokenIndex !== previousBrokenIndexRef.current &&
    firstBrokenIndex !== -1;

  const chainFullyRepaired = firstBrokenIndex === -1;

  const copy = {
    en: {
      title: "System Lab S1 Interaction",
      intro:
        "This lab helps you understand how blockchain integrity works. You will modify data, observe how the chain breaks, identify the root cause, and repair it step by step. Focus on why the order of repair matters.",
      chainState: "Chain State",
      statusLabel: "Status",
      validChain: "Valid chain",
      brokenChain: "Broken chain",
      reset: "🔁 Reset Lab",
      transaction: "Transaction",
      prevLink: "Prev link check",
      hashCheck: "Hash check",
      ok: "OK",
      repairBlock: "Repair Block",
      repairChain: "Repair Chain From Here",
      whatThisShows: "What this shows",
      bullets: [
        "Changing data inside a block changes the block hash, because the hash is a fingerprint of the block contents.",
        "When one block hash changes, the next block may no longer point to the correct previous hash, so integrity fails from that point onward.",
        "The first broken block is the root cause. Later broken blocks are consequences of that first inconsistency.",
        "Repairing the chain is sequential: each affected block must be revalidated in order, which is part of what makes blockchain tampering costly.",
      ],
      completeTitle: "System Lab S1 Complete",
      completeDescription:
        "You explored how block hashes and chain links preserve blockchain integrity.",
      completedLabel: "🎉 Lab Completed",
      completedDescription:
        "You have completed System Lab S1 — How Blocks Form a Secure Chain. Claim your completion below.",
      blockchain: { heading: "Blockchain" },
      backLabel: "⬅ Return to Lab Overview",
      backHref: "/#/labs/system/s1",
      finalReflectionTitle: "Final Reflection",
      finalReflectionQuestion:
        "Why must we repair the first broken block before fixing later ones?",
      finalReflectionHint: "Think about the dependency between blocks.",
      finalReflectionAnswer:
        "If you change one block, all following blocks depend on it. That's why repair must start from there.",
      toolCta:
        "You can also use this tool independently in the tools section:",
      toolLinkLabel: "Mining Visualizer",
    },
    gr: {
      title: "System Lab S1 Interaction",
      intro:
        "Αυτό το lab σε βοηθά να κατανοήσεις πώς λειτουργεί η ακεραιότητα του blockchain. Θα τροποποιήσεις δεδομένα, θα παρατηρήσεις πώς σπάει το chain, θα εντοπίσεις τη ρίζα του προβλήματος και θα το επιδιορθώσεις βήμα προς βήμα. Εστίασε στο γιατί έχει σημασία η σειρά της επιδιόρθωσης.",
      chainState: "Κατάσταση Chain",
      statusLabel: "Κατάσταση",
      validChain: "Έγκυρο chain",
      brokenChain: "Σπασμένο chain",
      reset: "🔁 Επαναφορά Lab",
      transaction: "Συναλλαγή",
      prevLink: "Έλεγχος προηγούμενου hash",
      hashCheck: "Έλεγχος hash",
      ok: "ΟΚ",
      repairBlock: "Επιδιόρθωση Block",
      repairChain: "Επιδιόρθωση Chain Από Εδώ",
      whatThisShows: "Τι δείχνει αυτό",
      bullets: [
        "Η αλλαγή των δεδομένων μέσα σε ένα block αλλάζει το hash του, επειδή το hash είναι το αποτύπωμα του περιεχομένου του block.",
        "Όταν αλλάζει το hash ενός block, το επόμενο block μπορεί να μην δείχνει πλέον στο σωστό προηγούμενο hash, οπότε η ακεραιότητα χάνεται από εκείνο το σημείο και μετά.",
        "Το πρώτο σπασμένο block είναι η ρίζα του προβλήματος. Τα επόμενα σπασμένα blocks είναι συνέπειες αυτής της πρώτης ασυνέπειας.",
        "Η επιδιόρθωση του chain γίνεται σειριακά: κάθε επηρεαζόμενο block πρέπει να επανεπιβεβαιωθεί με τη σωστή σειρά, και αυτό συμβάλλει στο να είναι κοστοβόρα η αλλοίωση του blockchain.",
      ],
      completeTitle: "Ολοκλήρωση System Lab S1",
      completeDescription:
        "Εξερεύνησες πώς τα block hashes και τα chain links διατηρούν την ακεραιότητα του blockchain.",
      completedLabel: "🎉 Ολοκλήρωση Lab",
      completedDescription:
        "Ολοκλήρωσες το System Lab S1 — Πώς τα Blocks σχηματίζουν ένα ασφαλές chain. Διεκδίκησε την ολοκλήρωσή σου παρακάτω.",
      blockchain: { heading: "Blockchain" },
      backLabel: "⬅ Επιστροφή στην Επισκόπηση Lab",
      backHref: "/#/labs-gr/system/s1",
      finalReflectionTitle: "Τελικός Αναστοχασμός",
      finalReflectionQuestion:
        "Γιατί πρέπει να επιδιορθώσουμε πρώτα το πρώτο σπασμένο block και όχι κάποιο επόμενο;",
      finalReflectionHint: "Σκέψου τη σχέση εξάρτησης μεταξύ των blocks.",
      finalReflectionAnswer:
        "Αν αλλάξεις ένα block, όλα τα επόμενα εξαρτώνται από αυτό. Γι' αυτό η επιδιόρθωση πρέπει να ξεκινά από εκεί.",
      toolCta:
        "Μπορείς επίσης να χρησιμοποιήσεις αυτό το εργαλείο αυτόνομα στην ενότητα εργαλείων:",
      toolLinkLabel: "Mining Visualizer",
    },
  }[lang];

  const steps =
    lang === "gr"
      ? [
        "Εξερεύνηση του chain",
        "Σπάσιμο του chain",
        "Επιδιόρθωση του πρώτου σπασμένου block",
        "Πλήρης αποκατάσταση του chain",
      ]
      : [
        "Explore the chain",
        "Break the chain",
        "Repair first block",
        "Restore full chain",
      ];

  const instructions =
    lang === "gr"
      ? [
        "Κάνε κλικ σε ένα block για να το επιθεωρήσεις. Παρατήρησε ότι κάθε block αποθηκεύει το δικό του hash και επίσης το hash του προηγούμενου block. Έτσι δημιουργείται το chain.",
        "Άλλαξε μια συναλλαγή μέσα στο Block #1. Η αλλαγή των δεδομένων του block αλλάζει το hash του, κάτι που ακυρώνει τη σύνδεση με το επόμενο block και δημιουργεί ένα προβλέψιμο πρώτο σημείο αποτυχίας.",
        "Εντόπισε το ΠΡΩΤΟ σπασμένο block. Αυτό είναι το σημείο όπου η ακεραιότητα αποτυγχάνει πρώτη. Τα επόμενα blocks μπορεί επίσης να είναι άκυρα, αλλά είναι συνέπειες και όχι η ρίζα του προβλήματος.",
        "Επιδιόρθωσε πρώτα το πρώτο σπασμένο block και στη συνέχεια προχώρα προς τα εμπρός μέχρι όλο το chain να είναι ξανά έγκυρο. Η επιδιόρθωση ενός blockchain είναι σειριακή: δεν μπορείς να παραλείψεις με ασφάλεια ενδιάμεσα βήματα.",
      ]
      : [
        "Click on a block to inspect it. Notice that each block stores its own hash and also the hash of the previous block. This is what creates the chain.",
        "Edit a transaction inside Block #1. Changing the block data changes its hash, which invalidates the connection with the next block and creates a predictable first point of failure.",
        "Identify the FIRST broken block. This is the point where integrity fails first. Downstream blocks may also be invalid, but they are consequences, not the root cause.",
        "Repair the first broken block and then continue forward until the whole chain is valid again. Blockchain repair is sequential: you cannot safely skip ahead.",
      ];

  const checkAnswer = () => {
    setIsCorrect(Number(answer) === firstBrokenBlockNumber);
  };

  const handleReset = () => {
    setChain(createInitialChain());
    setStep(0);
    setAnswer("");
    setIsCorrect(false);
    previousBrokenIndexRef.current = -1;
  };

  useEffect(() => {
    if (step === 0 && labState.activeBlock !== null) setStep(1);

    if (step === 1 && firstBrokenIndex !== -1) {
      previousBrokenIndexRef.current = firstBrokenIndex;
      setStep(2);
    }

    if (step === 2 && isCorrect && (hasRepairedFirstBroken || chainFullyRepaired)) {
      setStep(3);
    }

    if (firstBrokenIndex !== -1) {
      previousBrokenIndexRef.current = firstBrokenIndex;
    }
  }, [step, labState.activeBlock, firstBrokenIndex, steps.length, isCorrect]);

  useEffect(() => {
    if (firstBrokenIndex !== -1) {
      setAnswer("");
      setIsCorrect(false);
    }
  }, [firstBrokenIndex]);

  useEffect(() => {
    if (step === 3 && firstBrokenIndex === -1) {
      setStep(steps.length - 1);
    }
  }, [step, firstBrokenIndex, steps.length]);

  const isComplete = step === steps.length - 1;

  // Checklist step completion flags
  const stepCompletion = steps.map((_, i) => i < step);

  // Shared card class — matches Core Lab interaction style
  const card = "rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40";

  const walletAddress = localStorage.getItem("wallet") || "demo-wallet";
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">

        {/* Header */}
        <section className={card}>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            {copy.intro}
          </p>
        </section>

        {/* Step indicator (Core-style checklist) */}
        <section className={card.replace("p-6", "p-5")}>
          <div className="text-xs text-slate-400 mb-3">
            Step {step + 1} / {steps.length}
          </div>

          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-2 transition-all duration-200">
                <div className={`mt-0.5 text-xs ${stepCompletion[i] ? "text-green-400" : i === step ? "text-blue-400" : "text-slate-500"}`}>
                  {stepCompletion[i] ? "✔" : i === step ? "●" : "○"}
                </div>
                <div>
                  <div className={`text-sm ${i === step ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-slate-400"}`}>
                    {s}
                  </div>
                  {i === step && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {instructions[i]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="text-green-400 text-xs mt-3">
              ✔ {lang === "gr" ? "Όλα τα βήματα ολοκληρώθηκαν" : "All steps completed"}
            </div>
          )}
        </section>

        {/* Checkpoint — only in step 2 when chain is broken */}
        {step === 2 && firstBrokenIndex !== -1 && (
          <section className="space-y-3">
            <div className="text-sm text-red-400">
              {lang === "gr"
                ? "✔ Το chain έχει σπάσει — επειδή άλλαξες το Block #1, πρώτα εντόπισέ το ως το block που αποτελεί τη ρίζα του προβλήματος και έπειτα επιδιόρθωσέ το"
                : "✔ The chain is broken — because you changed Block #1, first identify it as the root-cause block and then repair it"}
            </div>

            <div className={card.replace("p-6", "p-5")}>
              <div className="mb-2 font-medium text-slate-800 dark:text-slate-100">Checkpoint</div>
              <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                {lang === "gr"
                  ? "Ποιο block είναι το πρώτο σπασμένο; Χρησιμοποίησε τον πραγματικό αριθμό του block όπως εμφανίζεται στο visualizer."
                  : "Which block is the first broken one? Use the actual block number shown in the visualizer."}
              </div>
              <div className="mb-3 text-xs text-slate-400">
                {lang === "gr"
                  ? "Τα blocks ξεκινούν από το 0 (Genesis = 0)."
                  : "Blocks start from 0 (Genesis = 0)."}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && answer !== "") checkAnswer();
                  }}
                  className="w-24 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-slate-900 dark:text-slate-100"
                  placeholder="#"
                  min="0"
                />
                <button
                  onClick={checkAnswer}
                  disabled={answer === ""}
                  className={`rounded px-3 py-1 text-white text-sm ${answer === ""
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                >
                  {lang === "gr" ? "Έλεγχος" : "Check"}
                </button>
              </div>

              {answer !== "" && (
                <div className="mt-3 space-y-1 text-xs">
                  <div className={isCorrect ? "text-green-400" : "text-red-400"}>
                    {isCorrect
                      ? (lang === "gr" ? "✔ Σωστή απάντηση" : "✔ Correct answer")
                      : (lang === "gr" ? "✖ Λάθος απάντηση — δοκίμασε ξανά" : "✖ Incorrect — try again")}
                  </div>
                  {isCorrect && (
                    <div className="text-amber-400">
                      {hasRepairedFirstBroken
                        ? (lang === "gr"
                          ? "✔ Το πρώτο σπασμένο block έχει επιδιορθωθεί — συνέχισε διορθώνοντας τα υπόλοιπα"
                          : "✔ The first broken block is repaired — continue fixing the rest")
                        : (lang === "gr"
                          ? "➡ Τώρα επίλεξε αυτό το block και επιδιόρθωσέ το"
                          : "➡ Now select that block and repair it")}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={card.replace("p-6", "p-4") + " text-xs text-slate-600 dark:text-slate-300"}>
              {lang === "gr"
                ? "Ένα blockchain μπορεί να έχει πολλά σπασμένα blocks μετά από μία αλλαγή, αλλά μόνο ένα από αυτά είναι το πρώτο σημείο αποτυχίας. Η εύρεση αυτού του block είναι σημαντική επειδή δείχνει από πού πρέπει να ξεκινήσει η επιδιόρθωση του chain."
                : "A blockchain can have many broken blocks after one edit, but only one of them is the first point of failure. Finding that block is important because it tells you where the chain must be repaired first."}
            </div>

            <div className="text-xs text-amber-400">
              {lang === "gr"
                ? "Υπόδειξη: Αν προσπαθήσεις να επιδιορθώσεις πρώτα ένα μεταγενέστερο block, το chain δεν θα αποκατασταθεί σωστά. Ξεκίνα πάντα από το πρώτο σπασμένο block."
                : "Hint: If you try to repair a later block first, the chain will not be properly fixed. Always start from the first broken block."}
            </div>
          </section>
        )}

        <section>
          <div className="rounded-2xl bg-[#0F172A] p-5 text-white">
            <BlockchainView
              chain={chain}
              setChain={setChain}
              copy={copy.blockchain}
              onStateChange={setLabState}
            />
          </div>
        </section>

        {/* What this shows */}
        <section className={card}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {copy.whatThisShows}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {copy.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Final reflection + completion */}
        {isComplete && (
          <>
            <div className="text-sm text-green-400">
              {lang === "gr"
                ? "✔ Το chain έχει αποκατασταθεί πλήρως"
                : "✔ The chain has been fully restored"}
            </div>

            <section className={card}>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {copy.finalReflectionTitle}
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {copy.finalReflectionQuestion}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                {copy.finalReflectionHint}
              </p>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {copy.finalReflectionAnswer}
              </p>
            </section>

            <section className="rounded-2xl border border-indigo-300/40 bg-gradient-to-r from-indigo-500/15 via-sky-500/10 to-violet-500/15 p-6 shadow-sm dark:border-indigo-700/40 dark:from-indigo-900/30 dark:via-sky-900/20 dark:to-violet-900/30">
              <p className="text-base font-semibold text-indigo-700 dark:text-indigo-200">
                {copy.toolCta}
              </p>
              <a
                href="/#/tools/mining"
                className="mt-3 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-base font-semibold text-white transition hover:bg-indigo-500"
              >
                {copy.toolLinkLabel}
              </a>
            </section>

            <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
              <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                {copy.completedLabel}
              </h2>
              <p className="text-slate-700 dark:text-slate-200 mb-4">
                {copy.completedDescription}
              </p>
              <LabCompletionClaim
                labId="system-s1"
                language={lang}
                backHref={copy.backHref}
                backLabel={copy.backLabel}
                labTitle={copy.title}
              />
            </section>
          </>
        )}

        {/* Utilities */}
        <section className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
          <button
            onClick={handleReset}
            className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
          >
            {copy.reset}
          </button>
          <a
            href={copy.backHref}
            className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
          >
            {copy.backLabel}
          </a>
        </section>

      </div>
    </PageShell>
  );
}
