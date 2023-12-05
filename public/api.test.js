import { expect, test } from "vitest";
import {getExchangeRate} from './api.js';

test('api 값 가져오기', async () => {
  let array = await getExchangeRate();
  expect(array.length).not.toBe(0);
  array.forEach((element) => {
    expect(element.cur_nm).not.toBe('KRW');
  });
});