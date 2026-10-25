import { WizardRepository, SpellRepository } from "./repository";
import { Cache } from "./decorators";
import { isHouse, isWizard } from "./guards";
import type {
  SpellCastEvent,
  SpellStats,
  AcademyConfig,
  IsHouse,
  ElementOf,
} from "./types";

const wizards = new WizardRepository();
const spells = new SpellRepository();

// TAF 1: add a new wizard without giving an id
console.log("\nTAF 1: Add a new wizard");
const harry = wizards.create({
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
});
wizards.create({ name: "Basma Granger", house: "Gryffindor", level: 7, active: true });
wizards.create({ name: "yara Malfoy", house: "Slytherin", level: 5, active: true });
wizards.create({ name: "Luna Lovegood", house: "Ravenclaw", level: 4, active: true });
console.log("Created:", harry);

// TAF 2: find the wizards of one house
console.log("\nTAF 2: Filter by house");
const gryffindors = wizards.findByHouse("Gryffindor");
console.log("Gryffindor members:", gryffindors.map((w) => w.name));
// wizards.findByHouse("Durmstrang"); // error: not a House

// TAF 3: a handler that only accepts spell-cast events
console.log("\nTAF 3: Extract");
function handleSpellCast(event: SpellCastEvent): void {
  console.log(`Wizard ${event.wizardId} cast ${event.spellName}`);
}

handleSpellCast({
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus",
});
// handleSpellCast({ type: "level-up", wizardId: 1, newLevel: 6 }); // error: wrong event

// TAF 4: refuse a spell with a negative power
console.log("\nTAF 4: ValidateSpellPower decorator");
spells.add({ id: 102, name: "Protego", category: "defense", power: 50 });
console.log("Valid spell added. Total spells:", spells.getAll().length);

try {
  spells.add({ id: 103, name: "Invalid Spell", category: "attack", power: -10 });
} catch (error) {
  if (error instanceof Error) {
    console.log("Rejected:", error.message);
  }
}
console.log("Total spells now:", spells.getAll().length);

// TAF 5: cache the result of a method
console.log("\nTAF 5: Cache decorator");
class SpellCalculator {
  @Cache
  public calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3)); // calculates
console.log(calculator.calculatePower(10, 3)); // comes from the cache
console.log(calculator.calculatePower(5, 2)); // new arguments, so it calculates

// TAF 6: stricter type guard
console.log("\nTAF 6: Type guards");
const validData: unknown = {
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
};

const invalidData: unknown = {
  id: 2,
  name: "Viktor",
  house: "Durmstrang", // not one of the 4 houses
  level: 5,
  active: true,
};

console.log(isWizard(validData)); // true
console.log(isWizard(invalidData)); // false
console.log(isHouse("Slytherin"), isHouse("Durmstrang")); // true false

// inside this if, TypeScript knows validData is a Wizard
if (isWizard(validData)) {
  console.log("House:", validData.house);
}

// Bonus: index signatures and conditional types
console.log("\nBonus");
const stats: SpellStats = { Lumos: 3, Expelliarmus: 5 };
stats.Alohomora = 1; // we can add any spell name
console.log("Spell stats:", stats);

const config: AcademyConfig = { name: "Hogwarts", year: 2026, headmaster: "Dumbledore" };
console.log("Config:", config);

// these types are only checked when we compile
type A = IsHouse<"Gryffindor">; // true
type B = IsHouse<"Durmstrang">; // false
type C = ElementOf<string[]>; // string
const a: A = true;
const b: B = false;
const c: C = "ok";
console.log(a, b, c);
