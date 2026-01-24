


export interface TokenInfo {
  token: string;
  device?: string;    // optional device name or id
  createdAt: string;
}

export interface AdminTokenType {
  email: string;
  tokens: TokenInfo[];
  updatedAt?: string;
  createdAt?:string;
}
