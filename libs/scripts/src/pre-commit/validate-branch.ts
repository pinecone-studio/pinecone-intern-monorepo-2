import { execSync } from 'child_process';

export const getGitBranchName = (): string => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch (error) {
    throw new Error('Unable to retrieve Git branch name. Please ensure that you are in a Git repository.');
  }
};

export const checkMainBranch = (branch: string): void => {
  if (branch === 'main') {
    throw new Error("You can't commit directly to the main branch. Create a feature branch and try again.");
  }
};

export const checkValidBranchFormat = (branch: string): void => {
  const validChars = /^([0-9]+)-([a-z0-9-]+)$/;
  if (!validChars.test(branch)) {
    throw new Error('Your branch must be created from an issue. e.g. 12-branch-name');
  }
};

export const validateCurrentBranch = (): void => {
  const branchName = getGitBranchName();
  checkMainBranch(branchName);
  checkValidBranchFormat(branchName);
};
