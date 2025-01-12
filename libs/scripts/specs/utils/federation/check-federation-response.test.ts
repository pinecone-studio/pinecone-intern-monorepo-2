import axios from 'axios';
import * as checkFederationResponse from '../../../src/utils/federation/check-federation-response';

jest.mock('axios');
describe('wait function', () => {
  it('1. Should wait for the specified time', async () => {
    const startTime = Date.now();
    const waitTime = 1000;

    await checkFederationResponse.wait(waitTime);

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    const deviation = 50;
    expect(elapsedTime).toBeGreaterThanOrEqual(waitTime - deviation);
    expect(elapsedTime).toBeLessThanOrEqual(waitTime + deviation);
  });
});

describe('checkResponseCode function', () => {
  it('1. Should print "Preview URL is ready" and returns true for response code 200', () => {
    const responseCode = 200;
    const result = checkFederationResponse.checkResponseCode(responseCode);
    expect(result).toBe(true);
  });
});

describe('checkPreviewUrlResponse function', () => {
  it('1. Should handle a successful response (status code 200)', async () => {
    const previewUrl = 'http://example.com';
    const expectedResponse = { status: 200 };
    const mockLog = jest.spyOn(console, 'log').mockImplementation();

    (axios.post as jest.Mock).mockResolvedValueOnce({ data: expectedResponse, status: 200 });

    await checkFederationResponse.checkPreviewUrlResponse(previewUrl);

    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('Checking preview url response'));
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('Preview URL is ready.'));
  });

  it('2. Should handle an unsuccessful response (status code other than 200)', async () => {
    const previewUrl = 'http://example.com';
    const expectedResponse = { status: 404 };
    (axios.post as jest.Mock).mockRejectedValueOnce({ response: { data: expectedResponse, status: 404 } });

    await expect(checkFederationResponse.checkPreviewUrlResponse(previewUrl)).rejects.toThrowError('Preview url is not responding');
  });
});

describe('checkFederationGeneratedPreviewUrl', () => {
  jest.mock('../../../src/utils/federation/check-federation-response', () => ({
    checkPreviewUrlResponse: jest.fn(),
    wait: jest.fn(),
  }));
  it('1. Should call checkPreviewUrlResponse and wait in a loop for 10 seconds', async () => {
    const mockPreviewUrl = 'https';

    const mockWait = jest.spyOn(checkFederationResponse, 'wait').mockImplementation(() => Promise.resolve());
    const mockCheckPreviewUrlResponse = jest.spyOn(checkFederationResponse, 'checkPreviewUrlResponse').mockImplementation();

    await checkFederationResponse.checkFederationResponse(mockPreviewUrl);

    expect(mockCheckPreviewUrlResponse).toHaveBeenCalledTimes(10);
    expect(mockWait).toHaveBeenCalledTimes(10);
  });
});
