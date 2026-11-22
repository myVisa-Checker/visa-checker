export type ComplianceDecision =
  | "CLEARED"
  | "BLOCKED"
  | "HUMAN_REVIEW";

export type CountryRule = {
  officialSource?: string;
  lastVerifiedAt?: string;
  status: "RESEARCH" | "VERIFIED" | "RESTRICTED" | "EXPIRED";
  conflictingEvidence: boolean;
  activityNotCovered: boolean;
};

export function evaluateRule(rule: CountryRule): ComplianceDecision {
  if (!rule.officialSource || !rule.lastVerifiedAt) {
    return "BLOCKED";
  }

  if (rule.status !== "VERIFIED") {
    return "BLOCKED";
  }

  if (rule.conflictingEvidence) {
    return "HUMAN_REVIEW";
  }

  if (rule.activityNotCovered) {
    return "HUMAN_REVIEW";
  }

  return "CLEARED";
}
