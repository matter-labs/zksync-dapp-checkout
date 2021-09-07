import { walletData } from "@/plugins/walletData";
import { DecimalBalance, GweiBalance, ZkInBalance, ZkInNFT, ZKTypeDisplayToken } from "@/types/lib";

import { BigNumber, BigNumberish, utils } from "ethers";
import { utils as zkUtils } from "zksync";
import { Address, TokenSymbol } from "zksync/build/types";

/**
 *
 * @param symbol
 * @param amount
 * @return {BigNumber|*}
 */
function parseToken(symbol: TokenSymbol, amount: DecimalBalance) {
  return walletData.get().syncProvider?.tokenSet?.parseToken(symbol, amount.toString()) || BigNumber.from("0");
}

/**
 * Formatting token amount output to human readable string
 *
 * @param {TokenSymbol} symbol
 * @param {GweiBalance} amount
 * @return {string}
 */
function handleFormatToken(symbol: TokenSymbol, amount: GweiBalance): string {
  if (!amount) return "0";
  const result: string | undefined = walletData.get().syncProvider?.tokenSet?.formatToken(symbol, amount);
  if (result === undefined) {
    return "0";
  }
  return result && result.endsWith(".0") ? result.substr(0, result.length - 2) : result;
}

const handleFormatTokenPretty = (symbol: TokenSymbol, amount: GweiBalance) => {
  const firstFormated = handleFormatToken(symbol, amount);
  const symbolsArr = firstFormated.split(".");
  const symbolsArrInt = symbolsArr[0];
  let symbolsArrDecimal = symbolsArr[1];
  if (!symbolsArrDecimal || symbolsArrDecimal === "0" || symbolsArrDecimal.length < 5) {
    return firstFormated;
  }
  let firstNotZero = -1;
  for (let a = 0; a < symbolsArrDecimal.length; a++) {
    if (a > 4 && firstNotZero !== -1) {
      symbolsArrDecimal = symbolsArrDecimal.substr(0, a);
      break;
    }
    if (firstNotZero === -1 && symbolsArrDecimal[a] !== "0") {
      firstNotZero = a;
    }
  }
  if (firstNotZero > 5) {
    return "<0.000001";
  }
  let newVal = `${symbolsArrInt}.${symbolsArrDecimal}`;
  if (newVal.length < firstFormated.length) {
    newVal += "...";
  }
  return newVal;
};

export default {
  parseToken,

  timeCalc: (timeInSec: number) => {
    const hours = Math.floor(timeInSec / 60 / 60);
    const minutes = Math.floor(timeInSec / 60) - hours * 60;
    const seconds = timeInSec - hours * 60 * 60 - minutes * 60;

    // const strArr = [];
    // if (hours) {
    //   strArr.push(`${hours} hours`);
    // }
    // if (minutes) {
    //   strArr.push(`${minutes} minutes`);
    // }
    // if (seconds) {
    //   strArr.push(`${seconds} seconds`);
    // }

    // return strArr.join(" ");

    return {
      hours,
      minutes,
      seconds,
    };
  },

  handleTimeAmount: (time: number, string: string) => `${time} ${string}${time > 1 ? "s" : ""}`,

  handleFormatToken,

  handleFormatTokenPretty,

  handleFormatTokenPrettyCeil: (symbol: TokenSymbol, amount: GweiBalance) => {
    const firstFormatted = handleFormatTokenPretty(symbol, amount);
    const symbolsArr = firstFormatted.split(".");
    const symbolsArrInt = symbolsArr[0];
    const symbolsArrDecimal = symbolsArr[1];
    if (!symbolsArrDecimal || symbolsArrDecimal === "0" || symbolsArrDecimal.length < 4) {
      return firstFormatted;
    }
    /* Converting "14.63316" to "1463316" and adding 1 */
    const bigNumberString = BigNumber.from(`${symbolsArrInt}${symbolsArrDecimal}`).add("1").toString();
    /*
      Knowing previous length of decimal part we get new decimal part.
      And then add padStart with zeros to handle value like 0.00000001 as it has been changed to just 1 when casting to BigNumber type
    */
    const newDecimalPart = bigNumberString
      .substr(Math.max(0, bigNumberString.length - symbolsArrDecimal.length), bigNumberString.length)
      .padStart(symbolsArrDecimal.length - 1, "0");
    /*
      By getting bigNumberString from index 0 to index bigNumberString.length-newDecimalPart.length
      we can get an integer part of the new value
    */
    return `${symbolsArrInt === "0" ? "0" : bigNumberString.substr(0, bigNumberString.length - newDecimalPart.length)}.${newDecimalPart}`;
  },

  getFormattedTotalPrice: (price: number, amount: number) => {
    const total = price * amount;
    if (!amount || total === 0) {
      return "$0.00";
    }
    return total < 0.01 ? "<$0.01" : `$${total.toFixed(2)}`;
  },

  /**
   * @todo Optimize sorting
   *
   * @param a
   * @param b
   * @return {number}
   */
  sortBalancesById: (a: any, b: any) => {
    if (a.hasOwnProperty("id")) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    } else {
      return a.symbol.localeCompare(b.symbol);
    }
  },

  /**
   * @todo Optimize sorting
   *
   * @param a
   * @param b
   * @return {number}
   */
  compareTokensById: (a: ZkInBalance | ZkInNFT, b: ZkInBalance | ZkInNFT) => {
    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    }
    return 0;
  },

  /**
   * Soring by the token name
   * @param {ZkInBalance} a
   * @param {ZkInBalance} b
   * @returns {number}
   */
  sortBalancesAZ: (a: ZkInBalance, b: ZkInBalance) => {
    return a.symbol.localeCompare(b.symbol);
  },

  isAmountPackable: (amount: BigNumberish): boolean => {
    return zkUtils.isTransactionAmountPackable(amount);
  },

  validateAddress: (address: Address): boolean => {
    return utils.isAddress(address);
  },

  searchInArr: (search: string, list: Array<unknown> | ZKTypeDisplayToken[], searchParam: (e: unknown) => string) => {
    if (!search.trim()) {
      return list;
    }
    search = search.trim().toLowerCase();
    return list.filter((e) => String(searchParam(e)).toLowerCase().includes(search));
  },

  /**
   * Pre-processes any error to mute complex IT-debug and turn it into the human-readable text
   *
   * @param {Error} error
   * @return {string | undefined}
   */

  filterError: (error: Error): string | undefined => {
    if (error.message) {
      if (error.message.includes("User denied") || error.message.includes("User rejected")) {
        return undefined;
      } else if (error.message.includes("Fee Amount is not packable")) {
        return "Fee Amount is not packable";
      } else if (error.message.includes("Transaction Amount is not packable")) {
        return "Transaction Amount is not packable";
      } else {
        return error.message;
      }
    }
  },

  /**
   * Copy text
   */
  copy(value: string) {
    const elem = document.createElement("textarea");
    elem.style.position = "absolute";
    elem.style.left = -99999999 + "px";
    elem.style.top = -99999999 + "px";
    elem.value = value;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
  },
};