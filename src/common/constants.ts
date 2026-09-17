export const Sex = {
  MALE: 'M',
  FEMALE: 'F',
} as const;

export type Sex = (typeof Sex)[keyof typeof Sex];
