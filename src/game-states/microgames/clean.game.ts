import { MoveGame } from "./templates/move.game";
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from "@/core/draw-engine";
import { character } from "@/core/entities/character";
import { Entity } from "@/core/entities/entity";
import { gameData } from "@/core/game-data";
import { interpolate } from "@/util/util";

class CleanGame extends MoveGame {
  trash: Entity[] = [];

  onEnter() {
    super.onEnter();

    const difficulty = gameData.getDifficulty();
    const size = interpolate([0.8, 1.5], difficulty);

    character.setPos(100, 100);
    this.text = "Clean up";
    this.trash = [];
    const pos = {
      x: Math.random() * WIDTH / 2 + WIDTH / 4,
      y: Math.random() * HEIGHT / 2 + HEIGHT / 4,
    };
    for (let t = 0; t < 150; t++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = size * Math.random() * HEIGHT/6;
      const x = pos.x + radius * Math.cos(angle);
      const y = pos.y + radius * Math.sin(angle);
      this.trash.push(new Entity(
        {x, y},
        t%2 == 0 ? IconKey.fire1: IconKey.fire2,
      ));
    }
  }

  onUpdate(delta: number): void {
    for(let plank = 0; plank < this.planks; plank++) {
      drawEngine.drawRect(
        {x: -1, y: plank * this.plankSize},
        {x: WIDTH +1, y: this.plankSize},
        colors.light,
        colors.white,
      );
    }
    this.trash.forEach((t, i) => {
      c.save();
      c.translate(t.pos.x + t.size.x / 2, t.pos.y + t.size.y / 2);
      c.rotate((i % 2 ? 1 : -1) * Math.PI / 2); // Rotate 90 degrees
      c.translate(-(t.pos.x + t.size.x / 2), -(t.pos.y + t.size.y / 2));
      t.update();
      c.restore();
      if (t.collision().collides) {
        t.hide = true;
      }
    });
    super.onUpdate(delta);
    character.draw(IconKey.broom);

    if (!this.isEnding && this.trash.every(e => e.hide)) {
      this.nice();
    }
  }
}

export default new CleanGame();