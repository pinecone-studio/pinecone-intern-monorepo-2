
import { hashSync, compareSync } from "bcryptjs";

export const encryptHash = (password: string) => {
  return hashSync(password, 10);
};

export const decryptHash = (password: string, hash: string) => {
  return compareSync(password, hash);
};