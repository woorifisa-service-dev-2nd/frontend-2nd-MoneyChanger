import { expect, test } from "vitest";
import { getQueryDate } from "./utils.js";

const BASE_URL = 'http://localhost:3000';

test('날짜 가져오기', () => {
    const expected = '2023-12-05';

    const result = getQueryDate();

    expect(result).toBe(expected);
});

