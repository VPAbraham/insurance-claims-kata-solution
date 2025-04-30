// Define the interfaces and basic stuctures I have been given for the task

// Types:

export type IncidentType = 'accident' | 'theft' | 'fire' | 'water damage';

export interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

// Create a Claim interface base on the data that I expect to be required
// Includes: policy the claim belongs to, IncidentType,
// the date of the incident (to know if covered), and the amountClaimed on the payout.

export interface Claim {
  policyId: string;
  incidentType: IncidentType;
  incidentDate: Date;
  amountClaimed: number;
}

// Object to track result of claim
export interface ClaimResult {
  approved: boolean;
  payout: number;
  reasonCode: string;
}

// Reason codes, in screaming snake case, to differentiate from variable names
export const REASON_CODES = {
  APPROVED: 'APPROVED',
  POLICY_INACTIVE: 'POLICY_INACTIVE',
  NOT_COVERED: 'NOT_COVERED',
  ZERO_PAYOUT: 'ZERO_PAYOUT',
};

export class ClaimsProcessor {
  policies: Policy[];

  constructor(policies: Policy[]) {
    this.policies = policies;
  }

  processClaim(claim: Claim): ClaimResult {
    // Find matching policy if it exists
    const policy = this.findPolicy(claim.policyId);

    // If policy not found, return a rejection object
    if (!policy) {
      return {
        approved: false,
        payout: 0,
        reasonCode: 'POLICY_NOT_FOUND',
      };
    }
    // Check if policy active on incident date
    if (!this.isPolicyActive(policy, claim.incidentDate)) {
      return {
        approved: false,
        payout: 0,
        reasonCode: REASON_CODES.POLICY_INACTIVE,
      };
    }
    // Check if incident type is covered
    if (!this.isIncidentCovered(policy, claim.incidentType)) {
      return {
        approved: false,
        payout: 0,
        reasonCode: REASON_CODES.NOT_COVERED,
      };
    }

    return {
      approved: true,
      payout: 0,
      reasonCode: REASON_CODES.APPROVED,
    };
  }

  // Method for finding policy
  findPolicy(policyId: string): Policy | undefined {
    return this.policies.find((policy) => policy.policyId === policyId);
  }

  // Method for checking whether or not policy is currently active
  isPolicyActive(policy: Policy, incidentDate: Date): boolean {
    return incidentDate >= policy.startDate && incidentDate <= policy.endDate;
  }

  // Method for checking if incident is covered
  isIncidentCovered(policy: Policy, incidentType: IncidentType): boolean {
    return policy.coveredIncidents.includes(incidentType);
  }
}
