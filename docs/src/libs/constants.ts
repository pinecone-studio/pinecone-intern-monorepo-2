export const DRAWER_WIDTH = 300;

export type Section = {
  title: string;
  items: SubSection[];
};

export type SubSection = {
  title: string;
  path: string;
};

export const SECTIONS: Section[] = [
  {
    title: 'GraphQL',
    items: [
      { title: 'Introduction', path: '/graphql/introduction' },
      { title: 'Apollo Server', path: '/graphql/apollo-server' },
      { title: 'Apollo Client', path: '/graphql/apollo-client' },
      { title: 'Codegen', path: '/graphql/codegen' },
    ],
  },
  {
    title: 'NX Monorepo',
    items: [
      { title: 'Introduction', path: '/nx/introduction' },
      { title: 'Folder Structure', path: '/nx/folder-structure' },
      { title: 'Environments', path: '/nx/environments' },
    ],
  },
  {
    title: 'Pull Requests',
    items: [
      { title: 'Item 1', path: '/section-3/item-1' },
      { title: 'Item 2', path: '/section-3/item-2' },
      { title: 'Item 3', path: '/section-3/item-3' },
    ],
  },
  {
    title: 'Testing',
    items: [
      { title: 'Unit testing', path: '/testing/unit' },
      { title: 'E2E testing', path: '/testing/e2e' },
    ],
  },
];
