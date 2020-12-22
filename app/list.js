import document from 'document';

export function setupList(scripts, onClick) {
  console.info(`scripts: ${JSON.stringify(scripts)}`);
  const myList = document.getElementById('myList');

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
        let touch = tile.getElementById('touch');
        touch.addEventListener('click', (evt) => {
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
