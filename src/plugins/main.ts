import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import utils from '@/plugins/utils';
import Note from '@/components/Note.vue';
import Defbtn from '@/components/Defbtn.vue';
import LineBlock from '@/components/LineBlock.vue';
import Loader from '@/components/Loader.vue';
import AmountInput from '@/components/AmountInput.vue';
import ValuesBlock from '@/components/ValuesBlock.vue';

import { TokenSymbol } from '@/plugins/types';
import { BigNumber } from 'ethers';

Vue.use(VueScrollTo);

Vue.component('Note', Note);
Vue.component('Defbtn', Defbtn);
Vue.component('LineBlock', LineBlock);
Vue.component('Loader', Loader);
Vue.component('AmountInput', AmountInput);
Vue.component('ValuesBlock', ValuesBlock);

/**
 * Implementation of the tokenFormatter as a global filter
 */
Vue.filter('formatToken', (value: string, symbol: TokenSymbol) => {
  return utils.handleFormatToken(symbol, value);
});

/**
 * Implementation of the tokenFormatter as a global filter
 */
Vue.filter('formatUsdAmount', (value: string | BigNumber, price: string, symbol: TokenSymbol) => {
  return utils.getFormattedTotalPrice(Number(price), +utils.handleFormatToken(symbol, <string>value));
});

/**
 * Filtering human-readable time
 */
Vue.filter('getTimeString', (value: number) => {
  const { hours, minutes, seconds } = utils.timeCalc(value);
  return `${hours ? utils.handleTimeAmount(hours, 'hour') : ''}
              ${minutes ? utils.handleTimeAmount(minutes, 'minute') : ''}
              ${seconds ? utils.handleTimeAmount(seconds, 'second') : ''}`;
});
