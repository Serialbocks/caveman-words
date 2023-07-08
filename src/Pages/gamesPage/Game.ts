export class Game {
  id: number | undefined;
  name: string = '';
  playerCount: number | undefined;
  capacity: number | undefined;
  hasPassword: boolean | undefined;
  
  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.name) this.name = initializer.name;
    if (initializer.playerCount) this.playerCount = initializer.playerCount;
    if (initializer.capacity) this.capacity = initializer.capacity;
    if (initializer.boolean) this.hasPassword = initializer.hasPassword;
  }
}
