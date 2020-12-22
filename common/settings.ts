export interface Script {
  name: string;
  params?: string;
}

export interface Settings {
  url?: {
    name: string;
  };
  token?: {
    name: string;
  };
  scripts?: Script[];
}
