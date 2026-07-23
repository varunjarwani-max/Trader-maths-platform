import { Difficulty, MCQOption, Question } from '../types';

// Helper: random integer in range [min, max] inclusive
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: pick random element from array
function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: shuffle array in place
function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

// Format numbers cleanly
function formatNum(num: number): string {
  if (Number.isInteger(num)) return num.toString();
  // Round to max 3 decimals to avoid floating point precision noise
  const rounded = Math.round(num * 1000) / 1000;
  return rounded.toString();
}

// Build 4 distinct MCQ options with realistic trader distractors
function buildMCQOptions(
  correctVal: number | string,
  candidateDistractors: (number | string)[]
): { options: MCQOption[]; correctIndex: number } {
  const correctStr = typeof correctVal === 'number' ? formatNum(correctVal) : correctVal;

  const set = new Set<string>([correctStr]);
  const finalOptions: string[] = [correctStr];

  for (const cand of candidateDistractors) {
    const candStr = typeof cand === 'number' ? formatNum(cand) : cand;
    if (!set.has(candStr) && candStr !== '' && candStr !== 'NaN') {
      set.add(candStr);
      finalOptions.push(candStr);
    }
    if (finalOptions.length === 4) break;
  }

  // Fallback if not enough distractors
  let offset = 1;
  while (finalOptions.length < 4) {
    if (typeof correctVal === 'number') {
      const alt1 = formatNum(correctVal + offset);
      if (!set.has(alt1)) { set.add(alt1); finalOptions.push(alt1); }
      const alt2 = formatNum(correctVal - offset);
      if (finalOptions.length < 4 && !set.has(alt2)) { set.add(alt2); finalOptions.push(alt2); }
      const alt3 = formatNum(correctVal + offset * 10);
      if (finalOptions.length < 4 && !set.has(alt3)) { set.add(alt3); finalOptions.push(alt3); }
      offset++;
    } else {
      const alt = `${correctStr} (${offset})`;
      if (!set.has(alt)) { set.add(alt); finalOptions.push(alt); }
      offset++;
    }
  }

  const shuffled = shuffle(finalOptions);
  const correctIndex = shuffled.indexOf(correctStr);
  const labels = ['A', 'B', 'C', 'D'];

  const options: MCQOption[] = shuffled.map((val, idx) => ({
    id: `opt-${idx}-${Math.random().toString(36).substring(2, 7)}`,
    label: labels[idx],
    value: val,
    isCorrect: idx === correctIndex
  }));

  return { options, correctIndex };
}

// ==========================================
// 1. SPEED ARITHMETIC GENERATOR (Tradermath Standard)
// ==========================================
export function generateSpeedArithmeticQuestion(difficulty: Difficulty): Question {
  const categories = difficulty === 'easy'
    ? ['add_sub', 'mult', 'div', 'sq']
    : difficulty === 'medium'
    ? ['add_sub', 'mult', 'div', 'percent', 'sq_root', 'signed']
    : ['add_sub', 'mult', 'div', 'percent', 'sq_root', 'signed', 'nested'];

  const cat = choice(categories);
  let expression = '';
  let correctVal = 0;
  let distractors: number[] = [];

  if (cat === 'add_sub') {
    const isAdd = Math.random() > 0.5;
    if (difficulty === 'easy') {
      const a = randomInt(15, 85);
      const b = randomInt(15, 85);
      if (isAdd) {
        expression = `${a} + ${b}`;
        correctVal = a + b;
        distractors = [correctVal + 10, correctVal - 10, correctVal + 1, correctVal - 1];
      } else {
        const top = Math.max(a, b) + randomInt(10, 40);
        const bot = Math.min(a, b);
        expression = `${top} - ${bot}`;
        correctVal = top - bot;
        distractors = [correctVal + 10, correctVal - 10, correctVal + 1, correctVal - 2];
      }
    } else if (difficulty === 'medium') {
      const a = randomInt(125, 680);
      const b = randomInt(85, 450);
      if (isAdd) {
        expression = `${a} + ${b}`;
        correctVal = a + b;
        distractors = [correctVal + 10, correctVal - 10, correctVal + 100, correctVal - 100, correctVal + 1];
      } else {
        const top = a + b;
        expression = `${top} - ${a}`;
        correctVal = b;
        distractors = [correctVal + 10, correctVal - 10, correctVal + 100, correctVal - 1, b + 2];
      }
    } else { // Hard
      const a = randomInt(350, 1850);
      const b = randomInt(280, 1450);
      if (isAdd) {
        expression = `${a} + ${b}`;
        correctVal = a + b;
        distractors = [correctVal + 100, correctVal - 100, correctVal + 10, correctVal - 10, correctVal + 1];
      } else {
        const top = a + b;
        expression = `${top} - ${a}`;
        correctVal = b;
        distractors = [correctVal + 100, correctVal - 100, correctVal + 10, correctVal - 10];
      }
    }
  } else if (cat === 'mult') {
    if (difficulty === 'easy') {
      const a = randomInt(6, 15);
      const b = randomInt(12, 25);
      expression = `${a} × ${b}`;
      correctVal = a * b;
      distractors = [correctVal + a, correctVal - a, correctVal + 10, correctVal - 10];
    } else if (difficulty === 'medium') {
      // 2-digit x 2-digit (Quant core e.g. 17 x 24)
      const a = randomInt(13, 35);
      const b = randomInt(12, 28);
      expression = `${a} × ${b}`;
      correctVal = a * b;
      distractors = [correctVal + a, correctVal - a, correctVal + 10, correctVal - 10, (a + 1) * b];
    } else { // Hard
      const a = randomInt(24, 88);
      const b = randomInt(18, 65);
      expression = `${a} × ${b}`;
      correctVal = a * b;
      distractors = [correctVal + a, correctVal - a, correctVal + 10, correctVal - 10, (a - 1) * b];
    }
  } else if (cat === 'div') {
    if (difficulty === 'easy') {
      const b = randomInt(11, 20);
      const answer = randomInt(11, 20);
      const a = b * answer;
      expression = `${a} ÷ ${b}`;
      correctVal = answer;
      distractors = [correctVal + 1, correctVal - 1, correctVal + 2, answer + 5];
    } else if (difficulty === 'medium') {
      // 3-digit ÷ 2-digit (e.g. 528 ÷ 12, 720 ÷ 16)
      const b = choice([12, 14, 15, 16, 18, 24, 25, 32, 36]);
      const answer = randomInt(14, 48);
      const a = b * answer;
      expression = `${a} ÷ ${b}`;
      correctVal = answer;
      distractors = [correctVal + 1, correctVal - 1, correctVal + 2, correctVal - 2, answer + 10];
    } else { // Hard
      const b = choice([18, 24, 27, 36, 42, 45, 54, 64, 72]);
      const answer = randomInt(25, 95);
      const a = b * answer;
      expression = `${a} ÷ ${b}`;
      correctVal = answer;
      distractors = [correctVal + 1, correctVal - 1, correctVal + 10, correctVal - 10];
    }
  } else if (cat === 'percent') {
    if (difficulty === 'medium') {
      const pct = choice([10, 15, 20, 25, 30, 40, 50, 75]);
      const base = randomInt(4, 30) * 20; // Multiple of 20
      expression = `${pct}% of ${base}`;
      correctVal = (pct / 100) * base;
      distractors = [correctVal + (base * 0.05), correctVal - (base * 0.05), correctVal + 10, correctVal - 10];
    } else { // Hard
      const pct = choice([12.5, 17.5, 35, 45, 65, 85, 150]);
      const base = randomInt(4, 25) * 40;
      expression = `${pct}% of ${base}`;
      correctVal = (pct / 100) * base;
      distractors = [correctVal + 10, correctVal - 10, correctVal + 20, correctVal / 2];
    }
  } else if (cat === 'sq_root' || cat === 'sq') {
    const isRoot = cat === 'sq_root' && Math.random() > 0.4;
    if (isRoot) {
      const base = difficulty === 'medium' ? randomInt(12, 30) : randomInt(25, 50);
      const sq = base * base;
      expression = `√${sq}`;
      correctVal = base;
      distractors = [correctVal + 1, correctVal - 1, correctVal + 2, correctVal - 2];
    } else {
      const base = difficulty === 'easy' ? randomInt(11, 16) : (difficulty === 'medium' ? randomInt(15, 28) : randomInt(26, 45));
      expression = `${base}²`;
      correctVal = base * base;
      distractors = [correctVal + base, correctVal - base, correctVal + 10, correctVal - 10, (base + 1) * (base + 1)];
    }
  } else if (cat === 'signed') {
    const a = randomInt(15, 60);
    const b = randomInt(25, 80);
    const op = choice(['+', '-', '×']);
    if (op === '+') {
      expression = `-${a} + ${b}`;
      correctVal = -a + b;
      distractors = [-a - b, a + b, correctVal + 10, correctVal - 10];
    } else if (op === '-') {
      expression = `${a} - ${b}`;
      correctVal = a - b;
      distractors = [a + b, -(a + b), correctVal + 10, correctVal - 10];
    } else {
      const multA = randomInt(11, 20);
      const multB = randomInt(8, 15);
      expression = `${multA} × (-${multB})`;
      correctVal = -(multA * multB);
      distractors = [multA * multB, correctVal + 10, correctVal - 10, correctVal + multA];
    }
  } else { // Nested
    const a = randomInt(12, 25);
    const b = randomInt(11, 20);
    const c = randomInt(15, 60);
    expression = `(${a} × ${b}) - ${c}`;
    correctVal = (a * b) - c;
    distractors = [correctVal + 10, correctVal - 10, (a * b) + c, correctVal + a];
  }

  const { options, correctIndex } = buildMCQOptions(correctVal, distractors);

  return {
    id: `speed-${Math.random().toString(36).substring(2, 9)}`,
    expression,
    subtext: 'Quant Speed Arithmetic — Select correct answer:',
    options,
    correctIndex,
    type: cat
  };
}

// ==========================================
// 2. NUMBER LOGIC GENERATOR (Sequence Patterns)
// ==========================================
export function generateNumberLogicQuestion(difficulty: Difficulty): Question {
  let availableTypes: ('arithmetic' | 'second_diff' | 'alternating' | 'n_scaled' | 'fibonacci' | 'interleaved' | 'recurrence')[] = ['arithmetic'];

  if (difficulty === 'medium') {
    availableTypes = ['arithmetic', 'second_diff', 'alternating', 'n_scaled', 'fibonacci'];
  } else if (difficulty === 'hard') {
    availableTypes = ['second_diff', 'alternating', 'n_scaled', 'fibonacci', 'interleaved', 'recurrence'];
  }

  const patternType = choice(availableTypes);
  const terms: number[] = [];
  let correctVal = 0;
  let distractors: number[] = [];
  let patternExplanation = '';

  if (patternType === 'arithmetic') {
    const start = randomInt(5, 50);
    const step = randomInt(3, 18) * (Math.random() > 0.3 ? 1 : -1);
    for (let i = 0; i < 5; i++) {
      terms.push(start + i * step);
    }
    correctVal = start + 5 * step;
    distractors = [correctVal + step, correctVal - step, correctVal + 1, correctVal + 2 * step];
    patternExplanation = `Constant difference of ${step > 0 ? '+' : ''}${step}`;
  } else if (patternType === 'second_diff') {
    // Quadratic sequence: d_1, d_2 = d_1 + accel, ...
    const start = randomInt(2, 30);
    const initialStep = randomInt(2, 8);
    const accel = randomInt(2, 6) * (Math.random() > 0.25 ? 1 : -1);

    let current = start;
    let currentStep = initialStep;
    terms.push(current);
    for (let i = 0; i < 4; i++) {
      current += currentStep;
      terms.push(current);
      currentStep += accel;
    }
    correctVal = current + currentStep;
    distractors = [correctVal + accel, correctVal - accel, correctVal + currentStep, correctVal - 2];
    patternExplanation = `Differences increase by ${accel > 0 ? '+' : ''}${accel} each step`;
  } else if (patternType === 'alternating') {
    // e.g. x2, +3 or +5, -2
    const start = randomInt(3, 20);
    const isMult = Math.random() > 0.5;
    const op1Val = randomInt(2, 4);
    const op2Val = randomInt(3, 9);

    let current = start;
    terms.push(current);
    for (let i = 1; i < 5; i++) {
      if (i % 2 === 1) {
        current = isMult ? current * op1Val : current + op1Val;
      } else {
        current = current + op2Val;
      }
      terms.push(current);
    }
    // 6th term (i = 5, odd)
    correctVal = isMult ? current * op1Val : current + op1Val;
    distractors = [current + op2Val, correctVal + op1Val, correctVal - op1Val, correctVal + op2Val];
    patternExplanation = `Alternating pattern: ${isMult ? `×${op1Val}` : `+${op1Val}`}, then +${op2Val}`;
  } else if (patternType === 'n_scaled') {
    // a_n = n^2 + n or n*(n+1)*k + offset
    const k = choice([1, 2, 3]);
    const offset = randomInt(1, 12);
    for (let n = 1; n <= 5; n++) {
      terms.push(n * (n + 1) * k + offset);
    }
    correctVal = 6 * 7 * k + offset;
    distractors = [correctVal + 6 * k, correctVal - 6 * k, correctVal + k, 5 * 6 * k + offset + 10];
    patternExplanation = `Pattern: n × (n + 1)${k > 1 ? ` × ${k}` : ''}${offset > 0 ? ` + ${offset}` : ''}`;
  } else if (patternType === 'fibonacci') {
    // Fibonacci style: t_n = t_{n-1} + t_{n-2}
    const a = randomInt(2, 10);
    const b = randomInt(3, 14);
    terms.push(a, b);
    for (let i = 2; i < 5; i++) {
      terms.push(terms[i - 1] + terms[i - 2]);
    }
    correctVal = terms[4] + terms[3];
    distractors = [correctVal + terms[3], correctVal - terms[2], correctVal + 1, correctVal + 5];
    patternExplanation = `Fibonacci sequence: Each term is sum of preceding two terms`;
  } else if (patternType === 'interleaved') {
    // Term 1,3,5: Seq A; Term 2,4,6: Seq B (term 6 = Seq B's 3rd term)
    const startA = randomInt(5, 30);
    const stepA = randomInt(3, 12);
    const startB = randomInt(20, 80);
    const stepB = randomInt(4, 15) * (Math.random() > 0.5 ? 1 : -1);

    terms.push(startA);                 // t1
    terms.push(startB);                 // t2
    terms.push(startA + stepA);         // t3
    terms.push(startB + stepB);         // t4
    terms.push(startA + 2 * stepA);     // t5
    correctVal = startB + 2 * stepB;    // t6

    distractors = [
      correctVal + stepB,
      correctVal - stepB,
      startA + 3 * stepA, // Trap: continuing sequence A instead of B
      correctVal + stepA
    ];
    patternExplanation = `Interleaved dual series: Even positions step by ${stepB > 0 ? '+' : ''}${stepB}`;
  } else { // Recurrence relation: t_n = mult * t_{n-1} + add
    const mult = choice([2, 3]);
    const add = randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
    let current = randomInt(2, 6);
    terms.push(current);
    for (let i = 1; i < 5; i++) {
      current = current * mult + add;
      terms.push(current);
    }
    correctVal = current * mult + add;
    distractors = [current * mult, correctVal + add, correctVal - add, current + mult * add];
    patternExplanation = `Recurrence relation: t_n = ${mult} × t_{n-1} ${add >= 0 ? `+ ${add}` : `- ${Math.abs(add)}`}`;
  }

  const expression = `${terms.map(n => formatNum(n)).join(',  ')},  ?`;
  const { options, correctIndex } = buildMCQOptions(correctVal, distractors);

  return {
    id: `seq-${Math.random().toString(36).substring(2, 9)}`,
    expression,
    subtext: 'Find the missing 6th term in the sequence:',
    options,
    correctIndex,
    explanation: patternExplanation,
    type: patternType
  };
}

// ==========================================
// 3. 80-IN-8 DRILL GENERATOR (Quant Benchmarks)
// ==========================================
export function generateEightyInEightQuestion(difficulty: Difficulty): Question {
  const poolType = choice(['speed', 'decimal', 'fraction', 'mixed_quant']);

  if (poolType === 'speed') {
    return generateSpeedArithmeticQuestion(difficulty);
  }

  let expression = '';
  let correctVal: number | string = 0;
  let distractors: (number | string)[] = [];

  if (poolType === 'decimal') {
    const decOp = choice(['×', '÷', '+', '-']);

    if (difficulty === 'easy') {
      if (decOp === '×') {
        const dec = choice([0.2, 0.5, 0.4, 0.8, 1.5, 2.5]);
        const intVal = randomInt(4, 30);
        expression = `${dec} × ${intVal}`;
        correctVal = Math.round(dec * intVal * 10) / 10;
        distractors = [correctVal + 1, correctVal - 1, correctVal * 2, correctVal + 0.5];
      } else if (decOp === '÷') {
        const divisor = choice([0.2, 0.5, 0.4, 0.8]);
        const quotient = randomInt(4, 25);
        const dividend = Math.round(divisor * quotient * 10) / 10;
        expression = `${dividend} ÷ ${divisor}`;
        correctVal = quotient;
        distractors = [quotient * 10, quotient + 2, quotient - 2, quotient / 2];
      } else {
        const a = Math.round(randomInt(10, 99) / 10 * 10) / 10;
        const b = Math.round(randomInt(10, 99) / 10 * 10) / 10;
        expression = `${a} + ${b}`;
        correctVal = Math.round((a + b) * 10) / 10;
        distractors = [correctVal + 0.1, correctVal - 0.1, correctVal + 1, correctVal - 0.2];
      }
    } else if (difficulty === 'medium') {
      // Benchmark quant decimals: 0.125 (1/8), 0.375 (3/8), 0.625 (5/8), 0.875 (7/8), 0.15, 0.25, 0.75
      if (decOp === '×') {
        const dec = choice([0.125, 0.375, 0.625, 0.875, 0.25, 0.75, 0.15, 0.35]);
        const intVal = randomInt(8, 80);
        expression = `${dec} × ${intVal}`;
        correctVal = Math.round(dec * intVal * 1000) / 1000;
        distractors = [correctVal + 0.5, correctVal - 0.25, correctVal + 1, correctVal * 2];
      } else if (decOp === '÷') {
        const divisor = choice([0.12, 0.15, 0.25, 0.05, 0.08, 0.16]);
        const quotient = randomInt(12, 50);
        const dividend = Math.round(divisor * quotient * 100) / 100;
        expression = `${dividend} ÷ ${divisor}`;
        correctVal = quotient;
        distractors = [quotient * 10, quotient + 2, quotient - 2, quotient + 10];
      } else {
        const a = Math.round(randomInt(15, 180) / 100 * 100) / 100;
        const b = Math.round(randomInt(15, 180) / 100 * 100) / 100;
        expression = `${a} + ${b}`;
        correctVal = Math.round((a + b) * 100) / 100;
        distractors = [correctVal + 0.01, correctVal - 0.01, correctVal + 0.1, correctVal - 0.1];
      }
    } else { // Hard: Decimal division with precision traps like 0.036 ÷ 0.009
      if (decOp === '÷') {
        const divisor = choice([0.008, 0.012, 0.025, 0.015, 0.004, 0.016]);
        const quotient = randomInt(15, 80);
        const dividend = Math.round(divisor * quotient * 1000) / 1000;
        expression = `${dividend} ÷ ${divisor}`;
        correctVal = quotient;
        distractors = [quotient * 10, quotient / 10, quotient + 5, quotient - 5];
      } else {
        const dec = choice([0.0625, 0.125, 0.375, 0.875, 0.175, 0.225]);
        const intVal = randomInt(16, 160);
        expression = `${dec} × ${intVal}`;
        correctVal = Math.round(dec * intVal * 1000) / 1000;
        distractors = [correctVal + 1, correctVal - 0.5, correctVal * 2, correctVal / 2];
      }
    }
  } else if (poolType === 'fraction') {
    const fracType = choice(['fraction_of_number', 'fraction_add', 'fraction_mult']);

    if (fracType === 'fraction_of_number') {
      const maxDen = difficulty === 'easy' ? 8 : (difficulty === 'medium' ? 12 : 20);
      const den = choice([3, 4, 5, 6, 8, 10, 12, 15, 16, 20].filter(d => d <= maxDen));
      const num = randomInt(1, den - 1);
      const k = randomInt(3, difficulty === 'easy' ? 12 : 25);
      const whole = den * k;

      expression = `${num}/${den} of ${whole}`;
      correctVal = num * k;
      distractors = [correctVal + k, correctVal - k, correctVal + 1, correctVal - 1, whole - correctVal];
    } else if (fracType === 'fraction_add') {
      // e.g., 5/8 + 3/16 or 7/12 + 1/4
      const den2 = choice([2, 4, 8, 12]);
      const den1 = den2 * choice([1, 2]);
      const num1 = randomInt(1, den1 - 1);
      const num2 = randomInt(1, den2 - 1);

      expression = `${num1}/${den1} + ${num2}/${den2}`;
      const sumVal = (num1 / den1) + (num2 / den2);
      correctVal = Math.round(sumVal * 1000) / 1000;
      distractors = [correctVal + 0.25, correctVal - 0.25, correctVal + 0.125, correctVal - 0.125];
    } else {
      // fraction_mult: e.g. 5/6 × 24/25 = 4/5 = 0.8
      const den = choice([3, 4, 5, 6, 8, 12]);
      const num = randomInt(1, den - 1);
      const multK = randomInt(3, 16);
      const whole = den * multK;
      expression = `${num}/${den} × ${whole}`;
      correctVal = num * multK;
      distractors = [correctVal + num, correctVal - 1, correctVal + 2, whole];
    }
  } else {
    // Mixed Quant: e.g. (3/5 of 250) + (0.25 × 80)
    const num = choice([3, 4, 5, 7]);
    const den = choice([5, 8, 10]);
    const whole = den * randomInt(5, 20);
    const dec = choice([0.25, 0.5, 0.75, 0.2]);
    const decWhole = randomInt(4, 25) * 4;

    expression = `(${num}/${den} of ${whole}) + (${dec} × ${decWhole})`;
    const part1 = (num / den) * whole;
    const part2 = dec * decWhole;
    correctVal = part1 + part2;
    distractors = [correctVal + 10, correctVal - 10, correctVal + 5, correctVal - 5];
  }

  const { options, correctIndex } = buildMCQOptions(correctVal, distractors);

  return {
    id: `80in8-${Math.random().toString(36).substring(2, 9)}`,
    expression,
    subtext: '80-in-8 Quant Assessment — Evaluate:',
    options,
    correctIndex,
    type: poolType
  };
}
