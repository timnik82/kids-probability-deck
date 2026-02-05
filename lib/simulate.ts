import { MAIN_COUNT, MAIN_PICK, STAR_COUNT, STAR_PICK, PRIZE_TIERS } from './probability';

function pickRandom(max: number, count: number): number[] {
  const pool: number[] = [];
  for (let i = 1; i <= max; i++) pool.push(i);
  const picked: number[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool[idx]);
    pool[idx] = pool[pool.length - 1];
    pool.pop();
  }
  return picked;
}

export function drawOnce(): { mains: number[]; stars: number[] } {
  return {
    mains: pickRandom(MAIN_COUNT, MAIN_PICK),
    stars: pickRandom(STAR_COUNT, STAR_PICK),
  };
}

function countMatches(
  userMains: number[],
  userStars: number[],
  drawnMains: number[],
  drawnStars: number[]
): [number, number] {
  const mainSet = new Set(drawnMains);
  const starSet = new Set(drawnStars);
  let k = 0;
  let s = 0;
  for (const n of userMains) if (mainSet.has(n)) k++;
  for (const n of userStars) if (starSet.has(n)) s++;
  return [k, s];
}

export type SimResult = Record<string, number>;

export function simulate(
  userMains: number[],
  userStars: number[],
  draws: number
): SimResult {
  const counts: SimResult = {};
  for (const [k, s] of PRIZE_TIERS) {
    counts[`${k}+${s}`] = 0;
  }
  counts['0+0'] = 0;

  for (let i = 0; i < draws; i++) {
    const draw = drawOnce();
    const [k, s] = countMatches(userMains, userStars, draw.mains, draw.stars);
    const key = `${k}+${s}`;
    if (key in counts) {
      counts[key]++;
    } else {
      counts['0+0']++;
    }
  }
  return counts;
}

export function generateBirthdayTicket(): { mains: number[]; stars: number[] } {
  return {
    mains: pickRandom(31, MAIN_PICK),
    stars: pickRandom(STAR_COUNT, STAR_PICK),
  };
}

export function generateRandomTicket(): { mains: number[]; stars: number[] } {
  return {
    mains: pickRandom(MAIN_COUNT, MAIN_PICK),
    stars: pickRandom(STAR_COUNT, STAR_PICK),
  };
}
