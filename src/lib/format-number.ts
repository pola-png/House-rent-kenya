export function formatCompactNumber(value: number | null | undefined) {
  const safeValue = Number(value ?? 0);

  return new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: safeValue >= 100 ? 0 : 1,
  }).format(safeValue);
}
