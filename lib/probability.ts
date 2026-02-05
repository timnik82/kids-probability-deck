export function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n - k) k = n - k;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export const MAIN_COUNT = 50;
export const MAIN_PICK = 5;
export const STAR_COUNT = 12;
export const STAR_PICK = 2;

export const TOTAL_OUTCOMES = comb(MAIN_COUNT, MAIN_PICK) * comb(STAR_COUNT, STAR_PICK);

export function ways(k: number, s: number): number {
  return (
    comb(MAIN_PICK, k) *
    comb(MAIN_COUNT - MAIN_PICK, MAIN_PICK - k) *
    comb(STAR_PICK, s) *
    comb(STAR_COUNT - STAR_PICK, STAR_PICK - s)
  );
}

export function probability(k: number, s: number): number {
  return ways(k, s) / TOTAL_OUTCOMES;
}

export function oddsString(k: number, s: number): string {
  const p = probability(k, s);
  if (p === 0) return '-';
  const odds = Math.round(1 / p);
  return `1 : ${odds.toLocaleString()}`;
}

export const PRIZE_TIERS: [number, number][] = [
  [5, 2],
  [5, 1],
  [5, 0],
  [4, 2],
  [4, 1],
  [4, 0],
  [3, 2],
  [3, 1],
  [2, 2],
  [3, 0],
  [1, 2],
  [2, 1],
  [2, 0],
];

export function isPrizeTier(k: number, s: number): boolean {
  return PRIZE_TIERS.some(([pk, ps]) => pk === k && ps === s);
}

export function allPairsFrom5(): number[][] {
  const pairs: number[][] = [];
  for (let i = 1; i <= 5; i++) {
    for (let j = i + 1; j <= 5; j++) {
      pairs.push([i, j]);
    }
  }
  return pairs;
}
