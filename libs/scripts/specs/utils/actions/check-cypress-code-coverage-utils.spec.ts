/* eslint-disable max-lines */
import * as fs from 'fs';
import * as cypressCodeCoverageUtils from '../../../src/utils/actions/check-cypress-code-coverage-utils';

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(
    `
  <div class='fl pad1y space-right2'>
    <span class="strong">100% </span>
  </div>
  <div class='fl pad1y space-right2'>
    <span class="strong">70% </span>
  </div>
  <div class='fl pad1y space-right2'>
    <span class="strong">90% </span>
  </div>
  <div class='fl pad1y space-right2'>
    <span class="strong">85% </span>
  </div>
  <table class="coverage-summary">
    <thead>
    <tr>
      <th data-col="file" data-fmt="html" data-html="true" class="file">File</th>
      <th data-col="pic" data-type="number" data-fmt="html" data-html="true" class="pic"></th>
      <th data-col="statements" data-type="number" data-fmt="pct" class="pct">Statements</th>
      <th data-col="statements_raw" data-type="number" data-fmt="html" class="abs"></th>
      <th data-col="branches" data-type="number" data-fmt="pct" class="pct">Branches</th>
      <th data-col="branches_raw" data-type="number" data-fmt="html" class="abs"></th>
      <th data-col="functions" data-type="number" data-fmt="pct" class="pct">Functions</th>
      <th data-col="functions_raw" data-type="number" data-fmt="html" class="abs"></th>
      <th data-col="lines" data-type="number" data-fmt="pct" class="pct">Lines</th>
      <th data-col="lines_raw" data-type="number" data-fmt="html" class="abs"></th>
    </tr>
    </thead>
    <tbody><tr>
            <td class="file empty" data-value="app"><a href="app/index.html">app</a></td>
            <td data-value="0" class="pic empty">
            <div class="chart"><div class="cover-fill" style="width: 0%"></div><div class="cover-empty" style="width: 100%"></div></div>
            </td>
            <td data-value="0" class="pct empty">0%</td>
            <td data-value="0" class="abs empty">0/0</td>
            <td data-value="0" class="pct empty">0%</td>
            <td data-value="0" class="abs empty">0/0</td>
            <td data-value="0" class="pct empty">0%</td>
            <td data-value="0" class="abs empty">0/0</td>
            <td data-value="0" class="pct empty">0%</td>
            <td data-value="0" class="abs empty">0/0</td>
            </tr>
    </tbody>
  </table>
`.toString()
  ),
}));

jest.mock('path', () => ({
  join: () => '',
}));

const mockCodeCoverage = {
  statementsCoverage: '100',
  branchesCoverage: '70',
  functionsCoverage: '90',
  linesCoverage: '85',
};

describe('parseCoverageReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should parse the coverage report correctly', () => {
    const result = cypressCodeCoverageUtils.parseCoverageReport('/mock/path/to/report');

    expect(result).toEqual(mockCodeCoverage);

    expect(fs.readFileSync).toHaveBeenCalledWith('/mock/path/to/report', 'utf8');
  });
});

describe('calculateTotalCoverage', () => {
  const mockCodeCoverage = {
    statementsCoverage: '80%',
    branchesCoverage: '70%',
    functionsCoverage: '90%',
    linesCoverage: '85%',
  };

  it('calculates the total coverage correctly', () => {
    const totalCoverage = cypressCodeCoverageUtils.calculateTotalCoverage(mockCodeCoverage);
    expect(totalCoverage).toEqual(82);
  });

  it('returns NaN for invalid coverage percentages', () => {
    const invalidCoverage = {
      statementsCoverage: 'invalid%',
      branchesCoverage: '70%',
      functionsCoverage: '90%',
      linesCoverage: '85%',
    };
    const totalCoverage = cypressCodeCoverageUtils.calculateTotalCoverage(invalidCoverage);
    expect(totalCoverage).toBeNaN();
  });
});

describe('displayCoverageRow', () => {
  let consoleSpy;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('displays coverage row correctly', () => {
    const statistic = 'Statements Coverage:';
    const value = '80%';
    const expectedOutput = `| ${statistic.padEnd(30)} | ${value.toString().padStart(80)} |`;

    cypressCodeCoverageUtils.displayCoverageRow(statistic, value);

    expect(consoleSpy).toHaveBeenCalledWith(expectedOutput);
  });
  it('handles long values and statistics', () => {
    const statistic = 'Very Long Statistic Name That Goes Beyond 30 Characters:';
    const value = 'Very Long Coverage Value That Goes Beyond 80 Characters';
    const expectedOutput = `| ${statistic.padEnd(30)} | ${value.toString().padStart(80)} |`;

    cypressCodeCoverageUtils.displayCoverageRow(statistic, value);

    expect(consoleSpy).toHaveBeenCalledWith(expectedOutput);
  });
});

describe('isCoverageAboveThreshold', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should log an error message and exit with code 1 if coverage is below 100%', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation();

    cypressCodeCoverageUtils.isCoverageAboveThreshold(70);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Code coverage is below 100% (70%). Failing the Cypress test.'));
    expect(exitSpy).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should log a success message if coverage is 100% or above', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    cypressCodeCoverageUtils.isCoverageAboveThreshold(100);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Code coverage passed 🟢'));

    consoleSpy.mockRestore();
  });
});

describe('validateCoveragePath', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should log an error message and exit with code 1 if projectPath is empty', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation();

    cypressCodeCoverageUtils.validateCoveragePath('');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Please provide the path to the report file as the first argument.');
    expect(exitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should not log an error message or exit if projectPath is not empty', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation();

    cypressCodeCoverageUtils.validateCoveragePath('/path/to/report');

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
