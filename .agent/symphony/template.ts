function resolvePath(
  source: Record<string, unknown>,
  expression: string
): unknown {
  return expression.split('.').reduce<unknown>((value, segment) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value !== 'object') {
      return undefined;
    }

    return (value as Record<string, unknown>)[segment];
  }, source);
}

export function renderTemplate(
  template: string,
  context: Record<string, unknown>
): string {
  const missing = new Set<string>();

  const rendered = template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, rawExpr) => {
    const expression = String(rawExpr).trim();
    const value = resolvePath(context, expression);

    if (value === undefined) {
      missing.add(expression);
      return '';
    }

    return String(value);
  });

  if (missing.size > 0) {
    throw new Error(
      `Template references unknown value(s): ${Array.from(missing).join(', ')}`
    );
  }

  return rendered;
}
