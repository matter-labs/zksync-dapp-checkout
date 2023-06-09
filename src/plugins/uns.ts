const reg = /^[.a-z0-9-]+$/;

const resolutionService = "https://resolve.unstoppabledomains.com/domains/";
const tldAPI = "https://resolve.unstoppabledomains.com/supported_tlds";
export class UNSResolver {
  supportedTlds: string[] = [];
  domainData = new Map();

  async lookupDomain(address: string, ticker: string = "ETH"): Promise<string | null> {
    try {
      const domain = this.preparedDomain(address);
      if (domain !== "" && (await this.isValidTLD(domain))) {
        const response = await fetch(resolutionService + domain, {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + process.env.UNS_KEY,
          }),
        });
        const data = await response.json();
        if (data.records) {
          this.domainData.set(domain, data.records);
          return data.records[this.getUNSKey(ticker)] ? data.records[this.getUNSKey(ticker)] : data.records[this.getUNSKey("ETH")];
        }
        return null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  getDomain(address: string, ticker: string = "ETH"): string | null {
    const domainWithTicker = this.domainData.get(address)?.[this.getUNSKey(ticker)];
    return domainWithTicker || this.domainData.get(address)?.[this.getUNSKey("ETH")];
  }

  isValidAddress(address: string, ticker: string = "ETH"): boolean {
    return !!this.getDomain(address, ticker);
  }

  async isValidTLD(domain: string): Promise<boolean> {
    if (this.supportedTlds.length === 0) {
      const response = await fetch(tldAPI);
      const data = await response.json();
      if (data.tlds) {
        this.supportedTlds = data.tlds;
      }
    }
    return this.supportedTlds?.some((tld) => domain.endsWith(tld)) ?? false;
  }

  preparedDomain(domain: string): string {
    const retVal = domain ? domain.trim().toLowerCase() : "";
    if (reg.test(retVal)) {
      return retVal;
    }
    return "";
  }

  getUNSKey(ticker: string): string {
    return "crypto." + ticker + ".address";
  }
}
