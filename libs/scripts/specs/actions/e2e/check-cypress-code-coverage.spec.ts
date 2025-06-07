import * as cypressCodeCoverage from '../../../src/actions/e2e/check-cypress-code-coverage';
import * as cypressCodeCoverageUtils from '../../../src/utils/actions/check-cypress-code-coverage-utils';

jest.mock('../../../src/utils/actions/check-cypress-code-coverage-utils', () => ({
  validateCoveragePath: jest.fn(),
  parseCoverageReport: jest.fn().mockImplementation().mockReturnValueOnce({ statementsCoverage: '100', branchesCoverage: '70', functionsCoverage: '90', linesCoverage: '85' }),
  calculateTotalCoverage: jest.fn(),
  isCoverageAboveThreshold: jest.fn(),
  displayCoverageRow: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('addCoverageToPullRequest', () => {
  beforeEach(() => {
    process.env = { ...process.env, GITHUB_TOKEN: 'test' };
    process.argv = ['test', 'test', 'test/test/test'];
  });

  afterEach(() => {
    process.env = { ...process.env };
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should call addCypressCodeCoverageToPullRequest function when GITHUB_TOKEN is available', async () => {
    const mockValidateCoveragePath = jest.spyOn(cypressCodeCoverageUtils, 'validateCoveragePath');
    mockValidateCoveragePath.mockImplementation();

    const mockParseCoverageReport = jest.spyOn(cypressCodeCoverageUtils, 'parseCoverageReport');
    mockParseCoverageReport.mockReturnValueOnce({ statementsCoverage: '100', branchesCoverage: '70', functionsCoverage: '90', linesCoverage: '85' });

    const mockIsCoverageAboveThreshold = jest.spyOn(cypressCodeCoverageUtils, 'isCoverageAboveThreshold');
    mockIsCoverageAboveThreshold.mockImplementation();

    cypressCodeCoverage.checkCypressCodeCoverage('');

    expect(mockValidateCoveragePath).toHaveBeenCalled();
  });
});
