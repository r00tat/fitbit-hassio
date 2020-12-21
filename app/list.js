import document from 'document';

export function setupList() {
  let myList = document.getElementById('myList');

  let NUM_ELEMS = 10;

  myList.delegate = {
    getTileInfo: (index) => {
      return {
        type: 'my-pool',
        value: 'Item',
        index: index,
      };
    },
    configureTile: (tile, info) => {
      console.log(`Item: ${info.index}`);
      if (info.type == 'my-pool') {
        tile.getElementById('text').text = `${info.value} ${info.index}`;
        let touch = tile.getElementById('touch');
        touch.addEventListener('click', (evt) => {
          console.log(`touched: ${info.index}`);
        });
      }
    },
  };

  // length must be set AFTER delegate
  myList.length = NUM_ELEMS;
}
