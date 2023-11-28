import { describe, expect, it, vi } from 'vitest';

describe('app', async () => {
  it('should render lib', () => {
    expect('lib').toBe('lib');
  });

  it('mock console.dir', () => {
    const spy = vi.spyOn(console, 'dir');
    console.dir('2323');
    expect(spy).toHaveBeenCalled();
  });
});
