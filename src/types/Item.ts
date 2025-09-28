export type ItemOptionsType = {
  debug?: boolean;
}

export type Item = {
  type: string;
  options?: object & ItemOptionsType;
}
