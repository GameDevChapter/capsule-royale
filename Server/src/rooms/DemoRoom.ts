// tslint:disable: max-classes-per-file
// tslint:disable: no-console

import { Room, Client, generateId } from 'colyseus';
import { Schema, type, MapSchema } from '@colyseus/schema';

class Entity extends Schema {
  @type('number')
  x: number = 0;

  @type('number')
  y: number = 0;
}

class Player extends Entity {
  @type('boolean')
  connected: boolean = true;
}

class Enemy extends Entity {
  @type('number')
  power: number = Math.random() * 10;
}

class State extends Schema {
  @type({ map: Entity })
  entities = new MapSchema<Entity>();
}

/**
 * Demonstrate sending schema data types as messages
 */
class Message extends Schema {
  @type('number') num!: number;
  @type('string') str!: string;
}

export class DemoRoom extends Room<State> {
  static ENEMY_SPEED = 1;

  onCreate(options: any) {
    console.log('DemoRoom created!', options);

    this.setState(new State());
    this.populateEnemies();

    this.setMetadata({
      str: 'hello',
      number: 10
    });

    this.setPatchRate(1000 / 20);
    this.setSimulationInterval((dt) => this.update(dt));
  }

  populateEnemies() {
    for (let i = 0; i <= 3; i++) {
      const enemy = new Enemy();
      enemy.x = Math.random() * 2;
      enemy.y = Math.random() * 2;
      this.state.entities[generateId()] = enemy;
    }
  }

  onJoin(client: Client, options: any) {
    console.log('client joined!', client.sessionId);
    this.state.entities[client.sessionId] = new Player();
  }

  async onLeave(client: Client, consented: boolean) {
    this.state.entities[client.sessionId].connected = false;

    try {
      if (consented) {
        throw new Error('consented leave!');
      }

      console.log('let\'s wait for reconnection!')
      const newClient = await this.allowReconnection(client, 10);
      console.log('reconnected!', newClient.sessionId);

    } catch (e) {
      console.log('disconnected!', client.sessionId);
      delete this.state.entities[client.sessionId];
    }
  }

  onMessage(client: Client, data: any) {
    console.log(data, 'received from', client.sessionId);

    if (data === 'move_right') {
      this.state.entities[client.sessionId].x += 0.01;

      const message = new Message();
      message.num = Math.floor(Math.random() * 100);
      message.str = 'sending to a single client';
      this.send(client, message);
    }
    console.log(this.state.entities[client.sessionId].x);

    this.broadcast({ hello: 'hello world' });
  }

  update(dt: number) {
    Object.values(this.state.entities)
      .filter(e => e instanceof Enemy)
      .forEach((e: Enemy) => {
        e.x += dt / 1000 * DemoRoom.ENEMY_SPEED;
      })
  }

  onDispose() {
    console.log('disposing DemoRoom...');
  }

}
