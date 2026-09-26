export interface AuthUserDto {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly role: number;
}

export interface AuthResponseDto {
  readonly accessToken: string;
  readonly expiresAt: string;
  readonly user: AuthUserDto;
}
