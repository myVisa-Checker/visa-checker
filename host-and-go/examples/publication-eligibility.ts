export type PublicationState = {
  moderation: "PENDING" | "APPROVED" | "REJECTED";
  compliance: "UNKNOWN" | "CLEARED" | "BLOCKED";
  country: "RESEARCH" | "VERIFIED" | "RESTRICTED" | "EXPIRED";
  publication: "INACTIVE" | "ACTIVE" | "SUSPENDED";
};

export function canDisplayOffer(state: PublicationState): boolean {
  return (
    state.moderation === "APPROVED" &&
    state.compliance === "CLEARED" &&
    state.country === "VERIFIED" &&
    state.publication === "ACTIVE"
  );
}
