import { describe, expect, test } from "vitest";
import { getQueryDate } from "./utils";

describe('test 1', () => {
	test('date', () => {
		const today = new Date();

		const year = today.getFullYear();
		const month = today.getMonth() + 1;
		const date = today.getDate();

		const expected = `${year}-${month}-${date < 10 ? '0' + date : date}`;

		const result = getQueryDate();

		expect(result).toBe(expected);
	});

});