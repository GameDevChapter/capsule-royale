import { Context, MapSchema, Schema, type } from '@colyseus/schema';

const ctx = new Context();

export class Position extends Schema {
  @type('number', ctx)
  x!: number;

  @type('number', ctx)
  y!: number;

  static create(x: number, y: number) {
    return Object.assign(new Position(), { x, y });
  }
}

export class Player extends Schema {
  @type('string', ctx)
  id!: string;

  @type('boolean', ctx)
  connected: boolean = true;

  @type('string', ctx)
  name!: string;

  @type(Position, ctx)
  pos!: Position;

  static create({ id, name, pos }: Partial<Player>) {
    return Object.assign(new Player(), { id, name, pos });
  }
}

export class BattleRoyaleMatchmakingState extends Schema {
  @type({ map: Player }, ctx)
  players = new MapSchema<Player>();
}