export type Model = {
  name: String;
  isPremium: Boolean;
};

export type Integration = {
  name: String;
  displayName: String;
  secret: String;
  proxy: String;
  enabled: Boolean;
  models: Array<Model>;
};
