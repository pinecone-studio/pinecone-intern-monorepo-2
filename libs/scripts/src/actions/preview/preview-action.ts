import { green, red } from 'chalk';
import { handleAffectedFederationProjects, handleAffectedFederationServices, handleOtherProjects } from '../../utils/actions/preview';
import { cleanGeneratedPreviewEnvFiles } from '../../utils/actions/clean-generated-preview-env-files';
import { ProjectPreview } from '../../utils/federation/federation-projects-action-utils';
import { getAffectedApps } from '../../utils/affected/get-affected-apps';
import { addCommentToPullRequest } from '../../utils/github/add-comment-to-pull-request';
import { getAffectedFederationServices } from '../../utils';
import { runE2EActionAgainstPreviewLink } from '../../utils/actions/run-e2e-against-preview-link';

export const handleError = (error) => {
  console.log(red(`\n > Error while running preview action: ${error} \n`));
  process.exit(1);
};

export const areProjectsPreviewLinksAvailable = (federationProjectsPreviewUrl: ProjectPreview[], otherProjectsPreviewLinks: ProjectPreview[]): boolean => {
  return federationProjectsPreviewUrl.length > 0 || otherProjectsPreviewLinks.length > 0;
};

export const isActionPreviewUrlAvailable = (federationPreviewUrl: string | boolean, federationProjectsPreviewUrl: ProjectPreview[], otherProjectsPreviewLinks: ProjectPreview[]): string | boolean => {
  return federationPreviewUrl || areProjectsPreviewLinksAvailable(federationProjectsPreviewUrl, otherProjectsPreviewLinks);
};

export const buildFederationPreviewUrl = (federationPreviewUrl: string | boolean, affectedFederationServices: string[]): ProjectPreview | null => {
  if (federationPreviewUrl) {
    return {
      name: `federation with ( ${JSON.stringify(affectedFederationServices)} )`,
      url: federationPreviewUrl as string,
    };
  }
};

export const addCommentIfPreviewUrlAvailable = async (
  federationPreviewUrl: string | boolean,
  federationProjectsPreviewUrl: ProjectPreview[],
  otherProjectsPreviewLinks: ProjectPreview[],
  affectedApps: string[]
): Promise<void> => {
  const affectedFederationServices = getAffectedFederationServices(affectedApps);
  if (isActionPreviewUrlAvailable(federationPreviewUrl, federationProjectsPreviewUrl, otherProjectsPreviewLinks)) {
    const previewData: (ProjectPreview | string)[] = [buildFederationPreviewUrl(federationPreviewUrl, affectedFederationServices), ...federationProjectsPreviewUrl, ...otherProjectsPreviewLinks];
    await addCommentToPullRequest(previewData as ProjectPreview[]);
    await runE2EActionAgainstPreviewLink([...federationProjectsPreviewUrl, ...otherProjectsPreviewLinks]);
  }
};

export const runGeneratePreviewAction = async () => {
  try {
    cleanGeneratedPreviewEnvFiles();
    const affectedApps = getAffectedApps('--with-target preview');
    console.log(green(`Affected projects and services ${JSON.stringify(affectedApps)}`));
    const federationPreviewUrl = await handleAffectedFederationServices(affectedApps);
    const federationProjectsPreviewUrl = await handleAffectedFederationProjects(affectedApps, federationPreviewUrl);
    const otherProjectsPreviewLinks = await handleOtherProjects(affectedApps);
    await addCommentIfPreviewUrlAvailable(federationPreviewUrl, federationProjectsPreviewUrl, otherProjectsPreviewLinks, affectedApps);
  } catch (error) {
    handleError(error);
  }
};

runGeneratePreviewAction();
