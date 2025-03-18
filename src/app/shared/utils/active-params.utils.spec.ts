import {ActiveParamsUtils} from "./active-params.utils";

describe('activeParamsUtil', () => {

  it('should change type string to type array', () => {
    const result = ActiveParamsUtils.processParams({
      types: 'sukkulenti'
    });
    expect(result.types).toBeInstanceOf(Array);
  });

  it('should return all necessary params', () => {
    const result = ActiveParamsUtils.processParams({
      types: 'sukkulenti',
      heightFrom: '1',
      heightTo: '1',
      diameterFrom: '1',
      diameterTo: '1',
      sort: '1',
      page: '2',
    });
    expect(result).toEqual({
      types: ['sukkulenti'],
      heightFrom: '1',
      heightTo: '1',
      diameterFrom: '1',
      diameterTo: '1',
      sort: '1',
      page: 2,
    });
  });

  it('should not include in params unexpected param', () => {
    const result: any = ActiveParamsUtils.processParams({
      pages: '2'
    });
    expect(result.pages).toBeUndefined();
  });

  it('should change page string to int', () => {
    const result = ActiveParamsUtils.processParams({
      page: '2'
    });
    expect(result.page).toBe(2);
  });

});
