export type Limit = {
  standard: number | string;
  premium: number | string;
};

export type Model = {
  displayName?: string;
  isPremium: boolean;
  name: string;
  limit: Limit;
};

export type Integration = {
  displayName: string;
  enabled: boolean;
  models: Array<Model>;
  name: string;
  proxy: string;
  secret?: string;
};
