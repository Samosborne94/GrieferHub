import {
    andFormula,
    caseInsensitiveEqualsFormula,
    containsInsensitiveFormula,
    equalsFormula,
    formulaString,
    orFormula,
} from '@/lib/airtable-formula'

describe('airtable-formula helpers', () => {
    it('escapes quotes, slashes, and newlines in string literals', () => {
        expect(formulaString("o'hara\\test\nline")).toBe("'o\\'hara\\\\test\\nline'")
    })

    it('builds safe equality and search formulas', () => {
        expect(equalsFormula('email', "sam.o'hara@example.com")).toBe(
            "{email} = 'sam.o\\'hara@example.com'"
        )

        expect(caseInsensitiveEqualsFormula('griefer_name', "O'Hara")).toBe(
            "LOWER({griefer_name}) = LOWER('O\\'Hara')"
        )

        expect(containsInsensitiveFormula('description', "alt+f4'")).toBe(
            "FIND(LOWER('alt+f4\\''), LOWER({description}))"
        )
    })

    it('omits empty clauses when composing formulas', () => {
        expect(andFormula(undefined, "{status} = 'Verified'")).toBe("{status} = 'Verified'")
        expect(orFormula(undefined, "{game} = 'Arc Raiders'")).toBe("{game} = 'Arc Raiders'")
        expect(andFormula("{game} = 'Arc Raiders'", "{status} = 'Verified'")).toBe(
            "AND({game} = 'Arc Raiders', {status} = 'Verified')"
        )
    })
})
