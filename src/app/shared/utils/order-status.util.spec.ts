import {OrderStatusUtil} from "./order-status.util";
import {OrderStatusType} from "../../../types/order-status.type";

describe('orderStatusUtil', () => {

  it('should return name and color with no status', () => {
    const result = OrderStatusUtil.getStatusAndColor(null);
    expect(result.name).not.toBe('');
    expect(result.color).not.toBe('');
  });


  it('should return new order status with wrong status', () => {
    const result = OrderStatusUtil.getStatusAndColor('test' as OrderStatusType);
    expect(result.name).toBe('Новый');
    expect(result.color).toBe('#456F49');
  });


});
