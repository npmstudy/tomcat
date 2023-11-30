import { describe, expect, it, vi } from 'vitest';

import { isArrowFunction, log } from '../index';

describe('app', async () => {
  it('should render lib', () => {
    expect('lib').toBe('lib');
  });

  it('isArrowFunction = true', () => {
    const a = (b) => {
      return b;
    };
    const result = isArrowFunction(a);

    expect(result).toBe(true);
  });

  it('isArrowFunction = false', () => {
    const a = function (b) {
      return b;
    };
    const result = isArrowFunction(a);

    expect(result).toBe(false);
  });

  it('isArrowFunction = false', () => {
    const result = isArrowFunction('a');

    expect(result).toBe(false);
  });

  it('mock log', () => {
    const spy = vi.spyOn(console, 'log');
    log('2323', true);
    expect(spy).toHaveBeenCalled();
  });
});
