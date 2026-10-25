// The 4 houses. A house can only be one of these values.
export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface Wizard {
  id: number;
  name: string;
  house: House;
  level: number;
  active: boolean;
}

// A wizard without the id, because the repository creates the id
export type NewWizard = Omit<Wizard, "id">;

export type SpellCategory = "attack" | "defense" | "charm";

export interface Spell {
  id: number;
  name: string;
  category: SpellCategory;
  power: number;
}

// The field "type" tells us which event we have
export type AcademyEvent =
  | { type: "spell-cast"; wizardId: number; spellName: string }
  | { type: "level-up"; wizardId: number; newLevel: number }
  | { type: "wizard-expelled"; wizardId: number };

// Keep only the spell-cast event from the union
export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;

// Index signature: we don't know the spell names in advance
export type SpellStats = {
  [spellName: string]: number;
};

// name and year are required, any other property must be a string or a number
export interface AcademyConfig {
  name: string;
  year: number;
  [key: string]: string | number;
}

// Mapped type: same as Wizard but every property is readonly
export type ReadonlyWizard = {
  readonly [K in keyof Wizard]: Wizard[K];
};

// Conditional type: true if T is a house, false if not
export type IsHouse<T> = T extends House ? true : false;

// Get the type of the elements of an array
export type ElementOf<T> = T extends (infer U)[] ? U : never;
