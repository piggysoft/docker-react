/// <reference path="jasmine/jasmine.d.ts" />

interface CustomMatchers extends jasmine.Matchers {
  toHaveBeenCalledOnceWith(...params:any[]): boolean;
  toHaveBeenCalledOnce(): boolean;
  toHaveBeenCalledWithCount(count:number): boolean;
}
declare function expect(actual:any):CustomMatchers;
