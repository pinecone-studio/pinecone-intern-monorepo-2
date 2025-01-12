import { Tree } from '@nx/devkit';
import { dashGenerator } from './generator';
import { DashGeneratorSchema } from './schema';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  addProjectConfiguration: jest.fn(),
  generateFiles: jest.fn(),
  formatFiles: jest.fn(),
}));

describe('dash generator', () => {
  it('should run successfully', async () => {
    await dashGenerator({} as Tree, {} as DashGeneratorSchema);
  });
});
