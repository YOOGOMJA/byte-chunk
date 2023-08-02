export const splitHex = (target: string) => {
  const regex = /(|0x)([a-fA-F0-9]{2})/g;
  return target.match(regex);
};