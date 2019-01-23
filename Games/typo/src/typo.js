

browser.runtime.onMessage.addListener((data, sender) => {
  switch (data.type) {
    case 'ping': return Promise.resolve('pong');
  }
});


async function RUN_TYPO() {
  const duration = 9000;

  console.log('hello from typo.js script');
  document.body.style.background = 'lightgray';

  const words = PageTextExtractor.getWords();
  WordsController.startGame(words, {animationDuration: duration});


  InputController.addListener((userText, constroller) => {
    // this code is executed when user types anything
    console.log(userText);
    // todo: study Animation API: https://developer.mozilla.org/en-US/docs/Web/API/Animation

    WordsController.forEachWord(({animation, node, text, highlightNode}, i) => {
      // iterate though all words:
      if (text.startsWith(userText) && userText.length > 0) {
        highlightNode.textContent =  userText;
        setStyle(highlightNode, 'visibility', 'visible');
      }
      else {
        setStyle(highlightNode, 'visibility', 'hidden');

      }
      // todo: replace this block with something that will do the right thing
      if (text === userText) {
        animation.cancel();
        node.remove();
        highlightNode.remove();
        node.style.background = 'yellow';
        node.style.color = 'black';
        InputController.clear();   // this clears what user wrote
      }
      if (!text.startsWith(userText)) console.error('CHYBA');

    })

  });


  StatisticsController.draw();
  console.log('Game Over');

}



RUN_TYPO();
