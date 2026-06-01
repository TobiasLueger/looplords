/** Ein Bewegungssegment für die Spieler-Animation. */
export type PlayerMoveSegment =
  | { kind: 'hop'; steps: number }
  | { kind: 'teleport'; steps: number }
  | { kind: 'grapple'; steps: number };

export function hopSegment(steps: number): PlayerMoveSegment {
  return { kind: 'hop', steps };
}

export function teleportSegment(steps: number): PlayerMoveSegment {
  return { kind: 'teleport', steps };
}

export function grappleSegment(steps: number): PlayerMoveSegment {
  return { kind: 'grapple', steps };
}

export function segmentStepValues(segments: PlayerMoveSegment[]): number[] {
  return segments.map((s) => s.steps);
}
