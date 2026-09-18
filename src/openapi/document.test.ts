import { generateOpenApiDocument } from './document';

describe('generateOpenApiDocument', () => {
  it('generates a valid OpenAPI document with the expected paths', () => {
    const document = generateOpenApiDocument();

    expect(document.openapi).toBe('3.1.0');
    expect(Object.keys(document.paths ?? {})).toEqual(expect.arrayContaining(['/players', '/players/{id}', '/statistics']));
  });

  it('documents GET /players/{id} with 200, 400 and 404 responses', () => {
    const document = generateOpenApiDocument();

    const responses = document.paths?.['/players/{id}']?.get?.responses;
    expect(Object.keys(responses ?? {})).toEqual(expect.arrayContaining(['200', '400', '404']));
  });

  it('documents POST /players with a request body and a 201 response', () => {
    const document = generateOpenApiDocument();

    const post = document.paths?.['/players']?.post;
    expect(post?.requestBody).toBeDefined();
    expect(post?.responses?.['201']).toBeDefined();
  });
});
