import { colors, drawEngine, easeInOutSine, HEIGHT, WIDTH } from '@/core/draw-engine';
import { BROKEN_HEART, HEART, preLoadStrings } from '@/core/font';
import { gameData } from '@/core/game-data';
import { State } from '@/core/state';
import { addTimeEvent } from '@/core/timer';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu.state';

const panelWidth = 200;
const panelHeight = 50;

export class GameBase implements State {
  isStarting = false;
  isEnding = false;
  animationDuration = 500;
  animationTimer = 0;
  animationProgress = 0;
  text = '';

  onEnter() {
    this.isStarting = false;
    this.isEnding = false;
    this.start();
  }

  start() {
    this.animationTimer = 0;
    this.isStarting = true;
  }

  loseLife() {
    const heartsBefore = HEART.repeat(gameData.lives) + BROKEN_HEART.repeat(3 - gameData.lives);
    const heartsAfter = HEART.repeat(gameData.lives - 1) + BROKEN_HEART.repeat(3 - (gameData.lives - 1));
    const strBefore = `Oh no! ${heartsBefore}`;
    const strAfter = `Oh no! ${heartsAfter}`;
    const size = Math.floor(panelWidth / (6 * strBefore.length));
    preLoadStrings([strBefore, strAfter], [colors.black], size);
    this.text = strBefore;
    this.animationTimer = 0;
    this.isEnding = true;

    gameData.lives--;
    addTimeEvent(() => {
      this.text = strAfter;
    }, 200, 3, this.animationDuration);
    addTimeEvent(() => {
      this.text = strBefore;
    }, 200, 2, this.animationDuration + 100);

    if (gameData.lives < 1) {
      addTimeEvent(() => {
        this.text = 'you\'re fired!';
      }, this.animationDuration * 4);
      addTimeEvent(() => {
        gameStateMachine.setState(menuState);
      }, this.animationDuration * 6);
    } else {
      addTimeEvent(() => {        
        this.onEnter();
      }, this.animationDuration * 4);
    }
  }

  nextLevel() {
    this.animationTimer = 0;
    this.text = 'Nice!';
    this.isEnding = true;
    const className = this.constructor.name;
    console.log('next level', className);
    addTimeEvent(() => {
      console.log('addTimeEvent', className);
      gameData.nextLevel();
    }, this.animationDuration * 3);
  }

  onUpdate(delta: number) {
    if (this.isEnding || this.isStarting) {
      this.animationTimer += delta;
      if (this.animationTimer <= this.animationDuration) {
        this.animationProgress = easeInOutSine(this.animationTimer / this.animationDuration);
      }
      if (this.animationTimer > 0){
        this.renderPanel();
      }
      if (this.animationTimer > this.animationDuration * 2) {
        if (this.isStarting) {
          this.isStarting = false;
        }
      }
    }
  }

  renderPanel() {
    const x = (WIDTH * this.animationProgress) - (WIDTH / 2);
    const y = (HEIGHT * this.animationProgress) - (HEIGHT / 2);
    // Shadow
    drawEngine.drawRect(
      {x: WIDTH - x - (panelWidth / 2) + 8, y: HEIGHT - y - (panelHeight / 2) + 8},
      {x: panelWidth, y: panelHeight},
      colors.black,
      colors.black,
    );
    // Front
    drawEngine.drawRect(
      {x: x - (panelWidth / 2), y: y - (panelHeight / 2)},
      {x: panelWidth, y: panelHeight},
      colors.black,
      colors.white,
    );
    // Text
    drawEngine.drawText({
      text: this.text,
      x: this.animationProgress * WIDTH / 2,
      y: this.animationProgress * (HEIGHT / 2),
      textAlign: 'center',
      textBaseline: 'middle',
      size: Math.floor(panelWidth / (6 * this.text.length)),
      color: colors.black
    });
  }
}