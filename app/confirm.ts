import document from 'document';
import { vibration } from 'haptics';
import { Script } from '../common/settings';

export function confirm(
  script: Script,
  confirmScript: (script: Script, confirmed: boolean) => void
) {
  try {
    console.info(`clicked on script ${JSON.stringify(script)}`);
    // scriptToCall = script;

    document.replaceSync(`./resources/confirm.gui`);
    // const buttonYes = document.getElementById('button-yes');
    // console.info(`button yes: ${buttonYes.getAttribute('id')}`);
    document.getElementById('confirm-text').text = `run ${
      script.title || script.name
    }?`.substr(0, 100);
    document
      .getElementById('button-yes')
      .getElementById('touch')
      .addEventListener('click', () => {
        confirmScript(script, true);
        vibration.start('confirmation');
      });
    document
      .getElementById('button-no')
      .getElementById('touch')
      .addEventListener('click', () => {
        confirmScript(script, false);
      });
  } catch (err) {
    console.error(`failed to click on script ${err}\n${err.stack}`);
  }
}
