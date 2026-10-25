import type { NewWizard, Spell, Wizard } from "./types";
import { ValidateSpellPower } from "./decorators";

// everything we store must have an id
export interface Entity {
  id: number;
}

// Generic repository: T can be a Wizard, a Spell, or anything with an id
export class Repository<T extends Entity> {
  // protected: the child classes can use it too
  protected items = new Map<number, T>();

  public add(item: T): void {
    this.items.set(item.id, item);
  }

  public getAll(): T[] {
    return Array.from(this.items.values());
  }

  public getById(id: number): T | undefined {
    return this.items.get(id);
  }

  public remove(id: number): boolean {
    return this.items.delete(id);
  }
}

export class WizardRepository extends Repository<Wizard> {
  private nextId = 1;

  // the caller gives a wizard without id, we create the id here
  public create(data: NewWizard): Wizard {
    const wizard: Wizard = { id: this.nextId++, ...data };
    this.add(wizard);
    return wizard;
  }

  // Wizard["house"] is the House type, so only the 4 houses are accepted
  public findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter((wizard) => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  // the decorator checks the spell before add() runs
  @ValidateSpellPower
  public override add(spell: Spell): void {
    super.add(spell);
  }
}
