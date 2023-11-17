// Auth
export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordCreated: Date;
}

export interface IAuthRefreshTokenOptions {
  // in milis
  notBeforeExpirationTime?: number | string;
}

export interface IAuthPayloadOptions {
  loginWith: string;
}
