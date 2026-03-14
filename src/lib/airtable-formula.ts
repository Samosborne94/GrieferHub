function escapeValue(value: string): string {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
}

export function formulaString(value: string): string {
    return `'${escapeValue(value)}'`
}

export function equalsFormula(field: string, value: string): string {
    return `{${field}} = ${formulaString(value)}`
}

export function caseInsensitiveEqualsFormula(field: string, value: string): string {
    return `LOWER({${field}}) = LOWER(${formulaString(value)})`
}

export function containsInsensitiveFormula(field: string, value: string): string {
    return `FIND(LOWER(${formulaString(value)}), LOWER({${field}}))`
}

export function andFormula(...clauses: Array<string | undefined>): string | undefined {
    const filtered = clauses.filter(Boolean)

    if (filtered.length === 0) {
        return undefined
    }

    if (filtered.length === 1) {
        return filtered[0]
    }

    return `AND(${filtered.join(', ')})`
}

export function orFormula(...clauses: Array<string | undefined>): string | undefined {
    const filtered = clauses.filter(Boolean)

    if (filtered.length === 0) {
        return undefined
    }

    if (filtered.length === 1) {
        return filtered[0]
    }

    return `OR(${filtered.join(', ')})`
}
