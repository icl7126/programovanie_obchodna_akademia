

async function RUN_TYPO() {
  console.log('hello from typo.js script');

  const words = PageTextExtractor.getWords();
  const wordsNodes = words.map(word => buildElement('div', {style: 'background: gray; color: white;'}))
  
}



RUN_TYPO();
