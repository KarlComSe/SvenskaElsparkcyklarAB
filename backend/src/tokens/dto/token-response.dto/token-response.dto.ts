export class TokenResponseDto {
  token: string;
  remainingUses: number;
  expiresAt?: Date;
}
