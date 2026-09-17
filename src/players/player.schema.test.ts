import { createPlayerBodySchema } from './player.schema';

const validPayload = {
  firstName: 'Serena',
  lastName: 'Williams',
  shortName: 'S.WIL',
  sex: 'F',
  countryCode: 'USA',
  points: 100,
  weightGrams: 72000,
  heightCm: 175,
};

describe('createPlayerBodySchema', () => {
  it('accepts a valid payload and defaults optional fields', () => {
    const result = createPlayerBodySchema.safeParse(validPayload);

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ picture: null, birthdate: null, lastResults: [] });
  });

  it.each(['firstName', 'lastName', 'shortName', 'sex', 'countryCode', 'points', 'weightGrams', 'heightCm'])(
    'rejects a payload missing %s',
    (field) => {
      const { [field]: _omitted, ...payload } = validPayload as Record<string, unknown>;

      const result = createPlayerBodySchema.safeParse(payload);

      expect(result.success).toBe(false);
    },
  );

  it('rejects a sex value other than M or F', () => {
    const result = createPlayerBodySchema.safeParse({ ...validPayload, sex: 'X' });

    expect(result.success).toBe(false);
  });

  it('rejects a countryCode that is not 3 characters', () => {
    const result = createPlayerBodySchema.safeParse({ ...validPayload, countryCode: 'US' });

    expect(result.success).toBe(false);
  });

  it('rejects a picture that is not a valid URL', () => {
    const result = createPlayerBodySchema.safeParse({ ...validPayload, picture: 'not-a-url' });

    expect(result.success).toBe(false);
  });

  it('rejects lastResults containing values other than 0 or 1', () => {
    const result = createPlayerBodySchema.safeParse({ ...validPayload, lastResults: [0, 1, 2] });

    expect(result.success).toBe(false);
  });

  it('rejects a birthdate not in YYYY-MM-DD format', () => {
    const result = createPlayerBodySchema.safeParse({ ...validPayload, birthdate: '01/01/1990' });

    expect(result.success).toBe(false);
  });
});
