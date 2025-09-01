// This file defines TypeScript types and interfaces used throughout the application.

export interface Core {
  id: string;
  subtitle: string;
  color: string;
  desc: string;
}

export interface Petal {
  id: string;
  color: string;
  desc: string;
}

export interface SubPetal {
  id: string;
  desc: string;
}

export interface Layout {
  core: { x: number; y: number };
  rubi: { x: number; y: number };
  [key: string]: { x: number; y: number; angle?: number };
}

export interface SelectedNode {
  id: string;
  desc?: string;
  group?: string;
}