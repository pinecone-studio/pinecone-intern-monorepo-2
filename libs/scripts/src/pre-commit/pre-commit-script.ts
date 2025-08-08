import '../polyfills';
import { red } from 'chalk';
import { performPreCommitChecks } from './pre-commit-checks';
import { validateCurrentBranch } from './validate-branch';

export const handleError = (err) => {
  console.log(red(`\n > Error during pre-commit checks: ${err.message || err} \n`));
  throw err;
};

export const runPreCommitScript = () => {
  try {
    validateCurrentBranch();
    performPreCommitChecks();
  } catch (err) {
    handleError(err);
  }
};

runPreCommitScript();
