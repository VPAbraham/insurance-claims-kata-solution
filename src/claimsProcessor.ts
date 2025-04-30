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

// todo: Claims processor class that will take in a Policy and Claim and evaluate them against each other.
