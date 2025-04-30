import { ClaimsProcessor, Claim, REASON_CODES } from '../claimsProcessor';
import { testPolicies } from '../testData';

describe('ClaimsProcessor', () => {
  // initialize variables
  let processor: ClaimsProcessor;

  beforeEach(() => {
    // instantiate new ClaimsProcessor and pass in test policies
    processor = new ClaimsProcessor(testPolicies);
  });

  test('should create a claims processor with policies', () => {
    expect(processor).toBeInstanceOf(ClaimsProcessor);
  });

  // First feature test: NON_EXISTENT policy
  test('should handle non-existent policy', () => {
    const claim: Claim = {
      policyId: 'non_existent_id',
      incidentType: 'fire',
      incidentDate: new Date('2023-08-17'),
      amountClaimed: 3000,
    };

    const result = processor.processClaim(claim);
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe('POLICY_NOT_FOUND');
  });

  // Second feature test: INACTIVE policy
  test('should reject claim if incident date is outside policy period', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2022-12-15'), // Before start date
      amountClaimed: 3000,
    };

    const result = processor.processClaim(claim);
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe(REASON_CODES.POLICY_INACTIVE);
  });

  // Third feature: Incident type NOT_COVERED
  test('should reject claim if incident type is not covered', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'theft', // Not covered in POL123
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    const result = processor.processClaim(claim);
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe(REASON_CODES.NOT_COVERED);
  });
});
