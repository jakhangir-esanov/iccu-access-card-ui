import { describe, expect, it } from 'vitest';
import { findComments } from './check-no-comments.mjs';

const textsOf = (path, text) =>
  findComments(path, text).map((comment) => text.slice(comment.start, comment.end));

describe('findComments', () => {
  it('should find line and block comments when the file is TypeScript', () => {
    const text = 'const a = 1; // note\n/* block */\nconst b = 2;\n';

    expect(textsOf('a.ts', text)).toEqual(['// note', '/* block */']);
  });

  it('should find a comment when it is a JSX expression', () => {
    const text = 'export const A = () => <div>{/* hidden */}</div>;\n';

    expect(textsOf('a.tsx', text)).toEqual(['/* hidden */']);
  });

  it('should ignore comment markers when they are inside strings', () => {
    const text = "const url = 'http://localhost';\nconst glob = '/* not a comment */';\n";

    expect(textsOf('a.ts', text)).toEqual([]);
  });

  it('should find a comment when the file is CSS', () => {
    expect(textsOf('a.css', 'a { color: red; } /* x */')).toEqual(['/* x */']);
  });

  it('should find a hash comment when the file is a Dockerfile', () => {
    expect(textsOf('Dockerfile', 'FROM node\n# build\nRUN npm ci\n')).toEqual(['# build']);
  });
});
