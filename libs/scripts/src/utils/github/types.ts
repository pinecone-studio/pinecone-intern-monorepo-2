import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';

export type GithubBaseType = {
  octokit: ReturnType<typeof github.getOctokit>;
  context: Context;
  pullRequestNumber?: number;
};

export type GithubCommentType = GithubBaseType & {
  commentBody: string;
};
