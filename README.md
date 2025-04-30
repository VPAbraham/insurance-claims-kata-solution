# Insurance Claims Processing Kata
A TypeScript implementation of the Insurance Claims Processing Kata using Test-Driven Development (TDD). The system evaluates insurance claims against policy rules and calculates payout amounts.

## Setup & Running
- Install dependencies
```npm install```
- Run tests
```npm test```

- Run tests in watch mode (for TDD)
```npm run test:watch```

## Implementation Approach
This solution was built using strict TDD principles:

- Red: Write a failing test for each business rule
- Green: Write minimal code to make the test pass
- Refactor: Clean up code while keeping tests green

The git commits document this TDD cycle throughout the development process.
Practical Usage
To see the claims processor in action, you can create a simple script in the following pattern:
typescriptimport { ClaimsProcessor, Claim, Policy } from './src/claimsProcessor';

### Define some example policies
```
const policies: Policy[] = [
{
policyId: 'POL123',
startDate: new Date('2023-01-01'),
endDate: new Date('2024-01-01'),
deductible: 500,
coverageLimit: 10000,
coveredIncidents: ['accident', 'fire'],
}
];
```

### Create a sample claim
```
const claim: Claim = {
policyId: 'POL123',
incidentType: 'fire',
incidentDate: new Date('2023-06-15'),
amountClaimed: 3000,
};
```

### Process the claim
```
const processor = new ClaimsProcessor(policies);
const result = processor.processClaim(claim);
console.log(result);
// Output: { approved: true, payout: 2500, reasonCode: 'APPROVED' }
```
### Trade-offs & Future Improvements
#### Given the 90-minute time constraint:

- Focused on core business rules rather than exhaustive edge cases
- Used simple error codes for clarity
- Kept configuration minimal to maximize implementation time

#### With more time, I would add:

- More robust error handling
- Additional edge case tests (boundary dates, equal-to-deductible claims)
- Better organization for a larger-scale application
- Documentation and type improvements
