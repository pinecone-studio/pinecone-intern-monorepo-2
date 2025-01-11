
import { NextRequest } from 'next/server';

import { checkTokenInProd } from './for-prod-token';
export const getUserId = (req: NextRequest) => {

  const tokenForProd=checkTokenInProd({ req }); 
  console.log('tokenForDev');
  console.log(tokenForProd, 'tokenForProd');
  return  tokenForProd;
};
