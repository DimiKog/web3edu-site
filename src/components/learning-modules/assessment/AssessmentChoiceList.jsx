import {
  assessmentChoiceInputClassName,
  assessmentChoiceRowClassName,
} from "./assessmentChoicePresentation.js";

/**
 * Shuffled choice rows with neutral selected affordance.
 * Submits/uses canonical option IDs only — presentation does not grade.
 *
 * @param {{
 *   questionId: string,
 *   isMultiple: boolean,
 *   rows: Array<{ canonicalId: string, visualLetter: string, text: string }>,
 *   selected: string | string[] | null | undefined,
 *   onSelect: (canonicalId: string) => void,
 * }} props
 */
export default function AssessmentChoiceList({
  questionId,
  isMultiple,
  rows = [],
  selected,
  onSelect,
}) {
  return (
    <div className="clear-both space-y-1 px-2 pb-2 pt-1" data-assessment-choice-list="">
      {rows.map((row) => {
        const inputId = `${questionId}-${row.canonicalId}`;
        const checked = isMultiple
          ? Array.isArray(selected) && selected.includes(row.canonicalId)
          : selected === row.canonicalId;

        return (
          <label
            key={row.canonicalId}
            htmlFor={inputId}
            className={assessmentChoiceRowClassName(checked)}
            data-selected={checked ? "true" : "false"}
          >
            <input
              id={inputId}
              className={assessmentChoiceInputClassName(isMultiple ? "checkbox" : "radio")}
              type={isMultiple ? "checkbox" : "radio"}
              name={questionId}
              value={row.canonicalId}
              checked={checked}
              onChange={() => onSelect(row.canonicalId)}
            />
            <span className="min-w-0 flex-1">
              <span className="font-semibold">{row.visualLetter}.</span> {row.text}
            </span>
          </label>
        );
      })}
    </div>
  );
}
