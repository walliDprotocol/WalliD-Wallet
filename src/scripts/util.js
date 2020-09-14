import { toChecksumAddress } from "ethereumjs-util";

export function checksumAddress(address) {
  const checksummed = address ? toChecksumAddress(address) : "";
  return checksummed;
}
