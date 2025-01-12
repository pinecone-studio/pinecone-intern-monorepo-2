import { execSync } from 'child_process';

export const generateTaggedOption = (tag, env, type) => {
  return tag ? `--${type}=${env}` : env;
};

export const getNxHeadAndBase = ({ tag }: { tag: boolean }) => {
  const nxBase = generateTaggedOption(tag, process.env.base, 'base');
  const nxHead = generateTaggedOption(tag, process.env.head, 'head');
  return { nxBase, nxHead };
};

export const getChangedFiles = (): string => {
  const { nxBase, nxHead } = getNxHeadAndBase({ tag: false });
  const baseCommand = 'git diff --cached --name-status';
  const nxBaseCommand = 'git diff --name-status';

  const command = process.env.base ? `${nxBaseCommand} ${`${nxBase}...${nxHead}`}` : baseCommand;

  return execAndTrim(command);
};

export const getAffectedProjectsList = ({ additionalParams = '' }: { additionalParams?: string } = {}): string[] => {
  const { nxBase, nxHead } = getNxHeadAndBase({ tag: true });
  const baseCommand = `npx nx show projects --affected ${additionalParams}`;
  const command = process.env.base ? `${baseCommand} ${nxBase} ${nxHead}` : baseCommand;
  return execAndTrim(command)
    .split('\n')
    .filter((app) => app.trim() !== '');
};

export const execAndTrim = (command: string): string => {
  return execSync(command).toString().trim();
};

const affectedProjectPaths = {};

export const getProjectPath = (affectedProject: string): string => {
  if (affectedProjectPaths[affectedProject]) return affectedProjectPaths[affectedProject];

  const command = `npx nx show project ${affectedProject}`;
  const projectInfo = execAndTrim(command);
  const jsonProjectInfo = JSON.parse(projectInfo);
  const rootPath = jsonProjectInfo.root;

  affectedProjectPaths[affectedProject] = rootPath;
  return rootPath;
};

export const checkMatchingRoot = (directories: string[], filePath: string): string | undefined => {
  const matchingDirectory = directories.find((directory) => filePath.includes(getProjectPath(directory)));
  return matchingDirectory;
};

export const findMatchingDirectory = (logLine: string, directories: string[]): string | undefined => {
  const lineParts = logLine.trim().split(/\s+/);
  if (lineParts.length === 2) {
    const filePath = lineParts[1];
    return checkMatchingRoot(directories, filePath);
  }
};

export const processChangedFiles = (files: string, directories: string[]): string[] => {
  const directoryMap = new Map<string, string>();
  files.split('\n').forEach((line) => {
    const matchingDirectory = findMatchingDirectory(line, directories);
    if (matchingDirectory) {
      directoryMap.set(matchingDirectory, matchingDirectory);
    }
  });
  return Array.from(directoryMap.values());
};
export const getAffectedApps = (additionalParams = '') => {
  const affectedApps = getAffectedProjectsList({ additionalParams });
  const changedFiles = getChangedFiles();
  const projects = processChangedFiles(changedFiles, affectedApps);
  return projects;
};
