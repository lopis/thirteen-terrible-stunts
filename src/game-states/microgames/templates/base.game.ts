import { ooof } from '@/core/audio';
import { renderBossDialog, setBossDialog } from '@/core/boss-dialog';
import { colors, drawEngine, easeInOutSine, HEIGHT, WIDTH } from '@/core/draw-engine';
import { character } from '@/core/entities/character';
import { BROKEN_HEART, HEART, preLoadStrings } from '@/core/font';
import { gameData, MAX_LIVES } from '@/core/game-data';
import music from '@/core/music';
// import { musicPlayer } from '@/core/music';
import { State } from '@/core/state';
import { saveHiScore } from '@/core/storage';
import { addTimeEvent, clearTimers } from '@/core/timer';
import { gameStateMachine } from '@/game-state-machine';
import { levelsState } from '@/game-states/levels.state';
import { menuState } from '@/game-states/menu.state';

const panelWidth = 200;
const panelHeight = 50;

export class GameBase implements State {
  isStarting = false;
  isEnding = false;
  inTransition = false;

  animationDuration = 500;
  animationTimer = 0;
  animationProgress = 0;
  maxTime = 10;
  timeLeft = 0;
  text = '';
  gameOver = false;

  confirmCallback = () => {};

  onEnter() {
    this.maxTime = gameData.easyMode ? 20 : 10;
    
    this.timeLeft = this.maxTime;
    this.isStarting = false;
    this.isEnding = false;
    this.inTransition = false;
    this.gameOver = false;
    character.velocity = {x:0, y:0};

    music.start();
    this.start();
  }

  onLeave() {
    clearTimers();
  }

  queryControls(_delta: number) {}

  stop() {
    character.velocity = {x: 0, y: 0};
  }

  start() {
    this.animationTimer = 0;
    this.isStarting = true;
  }

  getHearts(offset = 0) {
    return HEART.repeat(gameData.lives - offset) + BROKEN_HEART.repeat(MAX_LIVES - (gameData.lives - offset));
  }

  timeOver() {
    if (!this.isEnding) {
      this.loseLife();
    }
  }

  loseLife() {
    this.stop();
    const strBefore = `Oh no! ${this.getHearts()}`;
    const strAfter = `Oh no! ${this.getHearts(1)}`;
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
        this.gameOver = true;
        this.text = 'you\'re fired!';
        this.inTransition = true;
        if (!gameData.endless) {
          const { name, gameover } = gameData.getBoss();
          setBossDialog(name, gameover);
        } else if(gameData.level > gameData.highScore) {
          saveHiScore(gameData.level);
        }
        this.confirmCallback = () => {
          gameStateMachine.setState(menuState);
        };
      }, this.animationDuration * 4);
    } else {
      addTimeEvent(() => {
        this.nextLevel();
      }, this.animationDuration);
    }
  }

  nice() {
    this.stop();
    this.animationTimer = 0;
    this.isEnding = true;
    this.text = 'Nice!';
    this.nextLevel();
  }

  endBoss() {
    const { name, outro } = gameData.getBoss();
    gameData.speedUp = false;
    this.inTransition = true;
    setBossDialog(name, outro);

    this.confirmCallback = () => {
      if(gameData.boss === 3) {
        this.text = '# You\'re a star! #';
        this.confirmCallback = () => {
          gameStateMachine.setState(levelsState);
        };
      } else {
        gameData.nextBoss();
      }
    };
  }

  phaseTwo() {
    const { name, final } = gameData.getBoss();
    setBossDialog(name, final);
    this.inTransition = true;
    let startTime = this.animationDuration;
    for (let i = 13; i >= 1; i--) {
      startTime += 100 + 250 * (13 - i) / 13;
      
      addTimeEvent(() => {      
        ooof(i);  
        this.text = `Level ${(' ' + i).slice(-2)}`;
      }, startTime, 0, this.animationDuration * 2);
    }
    addTimeEvent(() => {        
      this.text = `SPEED UP!`;
      music.speedUp();
      addTimeEvent(() => {        
        gameData.speedUp = true;
        gameData.level = -1;
        gameData.nextLevel();
      }, 1000, 0, this.animationDuration);
    }, startTime + 2000, 0, this.animationDuration * 2);
  }

  nextLevel() {
    if (!gameData.endless && gameData.level == 12) {
      if (gameData.speedUp) {
        this.endBoss();
      } else {
        this.phaseTwo();
      }
    } else {
      addTimeEvent(() => {
        gameData.nextLevel();
      }, this.animationDuration * 3);
    }
  }

  onUpdate(delta: number) {
    if (!this.isEnding && !this.isStarting) {
      this.queryControls(delta);
      this.timeLeft = Math.max(0, this.timeLeft - delta / 1000);
      if (Math.round(this.timeLeft) <= 0) {
        this.timeOver();
      }
    }
  }

  postRender(delta: number) {
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

    if (this.inTransition && !gameData.endless) {
      renderBossDialog(delta);
    }

    this.renderStats();
  }

  renderStats() {
    const stats: [string|number, CanvasTextAlign, number][] = [
      [this.getHearts(), 'left', 7],
      [Math.round(this.timeLeft), 'center', WIDTH / 2],
      [`Lvl ${gameData.level + 1}`, 'right', WIDTH - 7],
    ];
    stats.forEach(([text, textAlign, x]) => {
      [colors.light, colors.black].forEach((color, i) => {
        drawEngine.drawText({
          text: text.toString(),
          x: x - i,
          y: 7 - i,
          textAlign,
          color,
          size: 2,
        });
      });
    });
    const width = Math.round(100 * this.timeLeft / this.maxTime / 2) * 2;
    drawEngine.drawRect(
      {x: WIDTH/2 - width/2, y: 20},
      {x: width, y: 8},
      colors.gray,
      colors.white,
    );
  }

  renderPanel() {
    const x = (WIDTH * this.animationProgress) - (WIDTH / 2);
    const y = (HEIGHT * this.animationProgress) - (HEIGHT / 2);
    const background = this.gameOver ? colors.black : colors.white;
    const foreground = this.gameOver ? colors.white : colors.black;
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
      background,
    );
    // Text
    drawEngine.drawText({
      text: this.text,
      x,
      y,
      textAlign: 'center',
      textBaseline: 'middle',
      size: Math.floor(panelWidth / (6 * this.text.length)),
      color: foreground
    });
  }

  onConfirm() {
    this.confirmCallback();
  }
}