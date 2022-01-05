import { utils } from "ethers";

export function checkAddress(address: string): boolean {
  return utils.isAddress(address) && address.startsWith("0x");
}
