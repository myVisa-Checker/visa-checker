export type Eligibility = {
  countryVerified: boolean;
  activityAllowed: boolean;
  durationAllowed: boolean;
  requiredAuthorizationConfirmed: boolean;
};

export function isEligible(input: Eligibility): boolean {
  return (
    input.countryVerified &&
    input.activityAllowed &&
    input.durationAllowed &&
    input.requiredAuthorizationConfirmed
  );
}
