import document from 'document';
import { Script } from '../common/settings';

interface ListElement extends Element {
  delegate: {
    getTileInfo: (index: number) => any;
    configureTile: (tile: Element, info: any) => void;
  };
  length: number;
}

export function setupList(
  scripts: Script[],
  onClick: (script: Script) => void
): void {
  console.info(`scripts: ${JSON.stringify(scripts)}`);
  const myList = document.getElementById('myList') as ListElement;

  myList.delegate = {
    getTileInfo: (index) => {
      return {
        type: 'my-pool',
        script: scripts[index],
        index: index,
      };
    },
    configureTile: (tile, { type, script, index }) => {
      // console.log(`Item: ${index}`);
      if (type == 'my-pool') {
        tile.getElementById('text').text = script.name;
        const touch = tile.getElementById('touch');
        touch.addEventListener('click', () => {
          console.log(`touched: ${index}`);
          console.log(`script: ${JSON.stringify(script)}`);
          onClick(script);
        });
      }
    },
  };

  // length must be set AFTER delegate
  myList.length = scripts.length;
}
