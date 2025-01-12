import axios from 'axios';
import { green } from 'chalk';

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkResponseCode = (responseCode: number) => {
  if (responseCode === 200) {
    console.log(green('Preview URL is ready.'));
    return true;
  }
};

export const checkPreviewUrlResponse = async (previewUrl: string) => {
  try {
    console.log('Checking preview url response');
    const response = await axios.post(
      previewUrl,
      {
        query: 'query Query { helloQueryFromAssessmentService }',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-apollo-operation-name': 'placeholder',
        },
      }
    );

    checkResponseCode(response.status);
  } catch (error) {
    throw new Error(`Preview url is not responding. Preview url: ${previewUrl}`);
  }
  return false;
};

export const checkFederationResponse = async (previewUrl: string): Promise<boolean> => {
  let duration = 0;

  while (duration < 10) {
    checkPreviewUrlResponse(previewUrl);
    await wait(1000);
    duration++;
  }

  return false;
};
