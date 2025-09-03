import fs from 'fs';
import path from 'path';

const getAppRoot = (): string => {
  if (process.cwd().includes('apps/2FH/tinder/frontend')) {
    return path.join(process.cwd(), 'src', 'app');
  }
  return path.join(process.cwd(), 'apps/2FH/tinder/frontend', 'src', 'app');
};

const getOutputPath = (): string => {
  if (process.cwd().includes('apps/2FH/tinder/frontend')) {
    return path.join(process.cwd(), 'cypress', 'utils', 'all-pages.json');
  }
  return path.join(process.cwd(), 'apps/2FH/tinder/frontend', 'cypress', 'utils', 'all-pages.json');
};

const searchDepth = (folderPath: string, appRoot: string): string[] => {
  let pages: string[] = [];

  try {
    const rootFolders = fs.readdirSync(path.join(appRoot, folderPath));
    const folders = rootFolders.filter((folder) => !folder.includes('.'));

    if (rootFolders.includes('page.tsx')) {
      pages.push(folderPath === '/' ? '/' : folderPath);
    }

    folders.forEach((folder) => {
      pages = [...pages, ...searchDepth(path.join(folderPath, folder), appRoot)];
    });
  } catch (error) {
    console.log(`Error reading directory: ${folderPath}`, error);
  }

  return pages;
};

export const getAllPages = (): string[] => {
  const appRoot = getAppRoot();
  let pages: string[] = searchDepth('/', appRoot);

  pages = pages
    .map((page) =>
      page
        .split('/')
        .filter((pagePath) => !pagePath.includes('(') && !pagePath.includes('nps') && pagePath !== '')
        .join('/')
    )
    .filter(page => page !== '');

  const outputPath = getOutputPath();
  fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2));
  
  console.log('Generated pages:', pages);
  return pages;
};

getAllPages();
