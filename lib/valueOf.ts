export default function valueOf(value: any): number | undefined {
  if (value === undefined || value === null) return undefined;

  const num = Number(value);
  return isNaN(num) ? undefined : num;
}
