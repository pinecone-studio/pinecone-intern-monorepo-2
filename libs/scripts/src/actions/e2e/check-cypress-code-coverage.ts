import { blue, green, red, yellow } from 'chalk';
import path from 'path';
import { calculateTotalCoverage, displayCoverageRow, isCoverageAboveThreshold, parseCoverageReport, validateCoveragePath } from '../../utils/actions/check-cypress-code-coverage-utils';

export const checkCypressCodeCoverage = (projectPath: string) => {
  validateCoveragePath(projectPath);

  const coverageFilePath = path.join(projectPath, 'coverage', 'lcov-report', 'index.html');

  const { statementsCoverage, branchesCoverage, functionsCoverage, linesCoverage } = parseCoverageReport(coverageFilePath);
  const totalCoverage = calculateTotalCoverage({ statementsCoverage, branchesCoverage, functionsCoverage, linesCoverage });

  const pullRequestComment = [
    displayCoverageRow(blue('E2E Coverage Report'), blue(coverageFilePath)),
    displayCoverageRow(blue('Statements'), blue(statementsCoverage)),
    displayCoverageRow(green('Branches'), green(branchesCoverage)),
    displayCoverageRow(yellow('Functions'), yellow(functionsCoverage)),
    displayCoverageRow(red('Lines'), red(linesCoverage)),
    displayCoverageRow(red('Total Coverage'), red(totalCoverage)),
  ].join('\n');

  isCoverageAboveThreshold(totalCoverage);

  console.log(pullRequestComment);
};
