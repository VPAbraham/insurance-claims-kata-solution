import { ClaimsProcessor, Claim } from '../claimsProcessor';
import { testPolicies } from '../testData';

describe('ClaimsProcessor', () => {
  // initialize variables
  let processor: ClaimsProcessor;

  beforeEach(() => {
    // instantiate new ClaimsProcessor and pass in test policies
    processor = new ClaimsProcessor(testPolicies);
  });

  // add test blocks
  test('should create a claims processor with policies', () => {
    expect(processor).toBeInstanceOf(ClaimsProcessor);
  });
});
