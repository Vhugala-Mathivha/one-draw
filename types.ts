export enum GameState {
  IDLE = 'IDLE',
  DRAWING = 'DRAWING',
  RESULT = 'RESULT',
}

export type ViewState = 'LANDING' | 'LOGIN' | 'DASHBOARD';

export interface User {
  username: string;
  email: string;
  isBankLinked: boolean;
  punchesRemaining: number;
}

export interface Ticket {
  id: string;
  type: 'LOTTO' | 'PUNCH';
  numbers: number[]; // For Lotto: [n1, n2, n3, n4, n5, luckyNum]
  timestamp: number;
  isWinner?: boolean;
  matchCount?: number; // Main matches
  luckyMatch?: boolean; // Bonus match
  prize?: number;
}

export interface OracleResponse {
  numbers: number[];
  reason: string;
}

// Lotto Config
export const MAIN_NUMBERS_COUNT = 5;
export const MAIN_POOL = 50; // 1-50
export const LUCKY_POOL = 10; // 1-10
export const LOTTO_PRICE = 5; // R5

// Component Compatibility Constants
export const SELECTION_COUNT = MAIN_NUMBERS_COUNT;
export const TOTAL_NUMBERS = MAIN_POOL;
export const TICKET_PRICE = LOTTO_PRICE;

// Lucky Punch Config
export const MIN_PUNCH_BET = 2; // R2