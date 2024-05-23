export type Model = {
  displayName?: string;
  isPremium: boolean;
  name: string;
};

export type Integration = {
  displayName: string;
  enabled: boolean;
  models: Array<Model>;
  name: string;
  proxy: string;
  secret?: string;
};
