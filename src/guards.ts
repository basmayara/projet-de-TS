import type { House, Wizard } from "./types";

const validHouses: readonly House[] = [
  "Gryffindor",
  "Slytherin",
  "Ravenclaw",
  "Hufflepuff",
];

// Return true only if the value is one of the 4 houses.
// "value is House" tells TypeScript the type when the result is true.
export function isHouse(value: unknown): value is House {
  return typeof value === "string" && validHouses.some((h) => h === value);
}

// Check that unknown data has the shape of a Wizard
export function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // treat it like a dictionary so we can read its properties
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}
