export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface UserRes {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginReq {
  loginName: string;
  password?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}
