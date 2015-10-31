import Logo from '../../src/Logo';

describe("Logo Test", function() {
  it("should work", function() {
    expect(Logo).toBeDefined();
    expect(Logo.prototype.render).toBeDefined();
  });
});
