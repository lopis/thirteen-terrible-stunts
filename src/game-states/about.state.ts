import { drawText } from '@/core/font';
import { State } from '@/core/state';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from './menu.state';
import { colors } from '@/core/draw-engine';

export class AboutState implements State {

  onUpdate() {
    [
      'About',
      'Game developed for js13kgames 2024.',
      'Copyright )lopis.',
      '',
      'Music adapted from \'Batty McFaddin\'',
      'by Kevin MacLeod.',
      'CC BY 3.0',
      '',
      '# Special thanks to the js13k community,',
      '# to the organizers who make it all possible',
      '# and to all the friends who helped testing.'
    ].forEach((text, i) => {
      drawText({
        text,
        x: 20,
        y: i === 0 ? 20 : 40 + i * 10,
        size: i === 0 ? 3 : 1,
        color: i === 0 ? colors.gray : colors.black,
      });
    });
  }

  onConfirm() {
    gameStateMachine.setState(menuState);
  }
}

export default new AboutState();
