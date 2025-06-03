

import { GET_MY_MATCHES } from "@/app/message/_utils/get-my-matches";
import '@testing-library/jest-dom';


describe('GraphQL Query', () => {
  it('should define GET_MY_MATCHES query', () => {
    expect(GET_MY_MATCHES).toBeDefined();
    expect(typeof GET_MY_MATCHES).toBe('object');
  });
});
