export type ItemOptionsType = {
  onKeywordClicked: (keyword: string) => void;
}

export type Item = {
  type: string;
  options?: object & ItemOptionsType;
}
