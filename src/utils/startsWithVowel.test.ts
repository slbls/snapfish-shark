import { expect, it } from "vitest";
import { startsWithVowel } from "./startsWithVowel";

it("returns true when a given value starts with a lowercase vowel", () => {
	const vowelWord = "alphabet";
	expect(startsWithVowel(vowelWord)).toBe(true);
});

it("returns true when a given value starts with an uppercase vowel", () => {
	const vowelWord = "Alphabet";
	expect(startsWithVowel(vowelWord)).toBe(true);
});

it("returns false when a given value starts with a lowercase consonant", () => {
	const consonantWord = "letter";
	expect(startsWithVowel(consonantWord)).toBe(false);
});

it("returns false when a given value starts with an uppercase consonant", () => {
	const consonantWord = "Letter";
	expect(startsWithVowel(consonantWord)).toBe(false);
});
