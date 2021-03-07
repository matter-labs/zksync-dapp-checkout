import { walletData } from "@/plugins/walletData";
import { Address, DecimalBalance, GweiBalance, TokenSymbol } from "@/plugins/types";
import { utils as zkUtils } from "zksync";
import { BigNumber, BigNumberish, utils } from "ethers";

/**
 *
 * @param symbol
 * @param amount
 * @return {BigNumber|*}
 */
const parseToken = (symbol: TokenSymbol, amount: DecimalBalance | number) => {
  /**
   * skip already bignumber
   */
  if (typeof amount === "object") {
    return amount;
  }
  if (typeof amount === "number") {
    const tokenDecimals = walletData.get().syncProvider!.tokenSet.resolveTokenDecimals(symbol);
    amount = amount.toFixed(tokenDecimals);
  }
  return walletData.get().syncProvider!.tokenSet.parseToken(symbol, amount.toString());
};

const handleFormatToken = (symbol: TokenSymbol, amount: GweiBalance) => {
  if (!amount || amount === "undefined") return "0";
  return walletData.get().syncProvider!.tokenSet.formatToken(symbol, amount);
};

const handleFormatTokenPretty = (symbol: TokenSymbol, amount: GweiBalance) => {
  const firstFormated = handleFormatToken(symbol, amount);
  const symbolsArr = firstFormated.split('.');
  const symbolsArrInt = symbolsArr[0];
  let symbolsArrDecimal = symbolsArr[1];
  if(!symbolsArrDecimal || symbolsArrDecimal==='0' || symbolsArrDecimal.length<5) {
    return firstFormated;
  }
  let firstNotZero = -1;
  for(let a=0; a<symbolsArrDecimal.length; a++) {
    if(a>4 && firstNotZero!==-1) {
      symbolsArrDecimal = symbolsArrDecimal.substr(0, a);
      break;
    }
    if(firstNotZero===-1 && symbolsArrDecimal[a]!=='0') {
      firstNotZero = a;
    }
  }
  return `${symbolsArrInt}.${symbolsArrDecimal}`;
}

export default {
  parseToken,

  timeCalc: (timeInSec: number) => {
    const hours = Math.floor(timeInSec / 60 / 60);
    const minutes = Math.floor(timeInSec / 60) - hours * 60;
    const seconds = timeInSec - hours * 60 * 60 - minutes * 60;

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
    const firstFormated = handleFormatTokenPretty(symbol, amount);
    const symbolsArr = firstFormated.split('.');
    const symbolsArrInt = symbolsArr[0];
    const symbolsArrDecimal = symbolsArr[1];
    if(!symbolsArrDecimal || symbolsArrDecimal==='0' || symbolsArrDecimal.length<4) {
      return firstFormated;
    }
    /* Converting "14.63316" to "1463316" and adding 1 */
    var bigNumberString = BigNumber.from(`${symbolsArrInt}${symbolsArrDecimal}`).add("1").toString();
    /*
      Knowing previous length of decimal part we get new decimal part.
      And then add padStart with zeros to handle value like 0.00000001 as it has been changed to just 1 when casting to BigNumber type
    */
    var newDecimalPart = bigNumberString.substr(Math.max(0, bigNumberString.length-symbolsArrDecimal.length), bigNumberString.length).padStart(symbolsArrDecimal.length-1, '0');
    /*
      By getting bigNumberString from index 0 to index bigNumberString.length-newDecimalPart.length
      we can get an integer part of the new value
    */
    return `${symbolsArrInt==='0'?'0':bigNumberString.substr(0, bigNumberString.length-newDecimalPart.length)}.${newDecimalPart}`;
  },

  getFormattedTotalPrice: (price: number, amount: number) => {
    const total = price * amount;
    if (!amount || total === 0) {
      return "$0.00";
    }
    return total < 0.01 ? `<$0.01` : `~$${total.toFixed(2)}`;
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

  isAmountPackable: (amount: String): boolean => {
    return zkUtils.isTransactionAmountPackable(amount as BigNumberish);
  },

  validateAddress: (address: Address): boolean => {
    return utils.isAddress(address);
  },
};
