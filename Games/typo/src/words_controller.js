

const WordsController = (() => {
  const _fallingWords = [];   // contains objects with "animation", "node" and "text" properties


  return {
    forEachWord: forEachWord,
    startGame: startGame
  };

  async function startGame(words, {
    animationDuration
  }) {
    const wordsNodes = words
      .map(word => buildElement('span', {
        style: styleNode('background: gray; color: white; display: inline-block; position: absolute;'),
        textContent: word.toLowerCase()
      }))
      .slice(0, 10);

    console.log('wn', wordsNodes, words);

    _fallingWords.length = 0;   // clear list of words
    // Animation of all nodes:
    for (let i = 0; i < wordsNodes.length; i++) {
      // extract node
      const wordNode = wordsNodes[i];
      // add it to the page body
      document.body.parentElement.appendChild(wordNode);
      // start the animation
      const animation = NodeAnimator.fromUpToDown(wordNode, (window.innerWidth / (i + 2)), (i * 50), (window.innerHeight + i * 50), animationDuration);
      // add falling word to the list of all falling words
      _fallingWords.push({
        animation: animation,
        node: wordNode,
        text: wordNode.textContent
      });

      // todo: when animation is done, we can do something...
      animation.finished.then(() => {
        console.log('word animation done', wordNode);
        removeFromArrayPredicate(_fallingWords, item => item.animation.id === animation.id);
      });
      // await animation.finished;
    }
  }

  function forEachWord(fn) {
    // const wordsOnScreen = _fallingWords.filter(({animation, node, text}) => {
    //
    // })

    _fallingWords.forEach(fn);
  }

})();

