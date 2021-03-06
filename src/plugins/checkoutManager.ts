let checkoutManager = false as any;

export default {
  get: () => {
    return checkoutManager;
  },
  set: (obj: any) => {
    checkoutManager = obj;
  },
};
