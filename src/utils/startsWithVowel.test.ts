import { expect, it } from "vitest";
import { startsWithVowel } from "./startsWithVowel";

it("returns true when a given value starts with a vowel", () => {
	const vowelWord = "alphabet";
	expect(startsWithVowel(vowelWord)).toBe(true);
});

it("returns false when a given value does not start with a vowel", () => {
	const consonantWord = "letter";
	expect(startsWithVowel(consonantWord)).toBe(false);
});
