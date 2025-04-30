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

  // First Rule Check: NON_EXISTENT policy
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

  // Second Rule Check: INACTIVE policy
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

  // Third Rule Check: Incident type NOT_COVERED
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

  // Fourth Rule Check: Payout Calculation
  test('should calculate payout as amount claimed minus deductible', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    const result = processor.processClaim(claim);
    // 3000(claim) - 500(policy) deductible
    expect(result.payout).toBe(2500);
    expect(result.approved).toBe(true);
  });

  // Fifth Rule Check: Zero Payout
  test('should return zero payout if amount claimed is less than deductible', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      // Less than 500 deductible
      amountClaimed: 400,
    };

    const result = processor.processClaim(claim);
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.reasonCode).toBe(REASON_CODES.ZERO_PAYOUT);
  });

  // Sixth Rule Check: Coverage Limit
  test('should limit payout to coverage limit', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 15000,
      // Exceeds 10000 coverage limit after deductible
    };

    const result = processor.processClaim(claim);
    expect(result.payout).toBe(10000);
    // Policy has reached coverage limit
    expect(result.approved).toBe(true);
  });

  // Happy Path: Valid Claim
  test('should correctly process a valid claim', () => {
    const claim: Claim = {
      policyId: 'POL456',
      incidentType: 'water damage',
      // Covered in POL456
      incidentDate: new Date('2023-06-15'),
      // During policy period
      amountClaimed: 5000,
      // Results in payout of 4750
    };

    const result = processor.processClaim(claim);
    expect(result.approved).toBe(true);
    expect(result.payout).toBe(4750);
    expect(result.reasonCode).toBe(REASON_CODES.APPROVED);
  });
});
