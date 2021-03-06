

const ScreenController = (() => {
  const duration = 9000;
  let _container;

  return {
    initialize: initialize,
    // showWelcome: showWelcome,
    // showEnd: showEnd,
  };

  async function initialize() {
    const {user_name: userName = ''} = await browser.storage.local.get('user_name');

    _container = buildHtml(['welcome-screen', {
      style: styleBlock(`
      position: fixed; 
      top: 90px; 
      left: 25%;
      width: 50%;
      margin: 10px; 
      padding: 10px;
      background: lightgreen;
      font-size: 20px; 
      border: 1px solid gray;
      box-shadow: 0px 0px 4px 0px black;
      display: flex;
      flex-direction: column;
      align-items: center;
    `)
    }, [
      ['h1', {style: styleBlock('font-size: 42px; margin: 10px 0;'), textContent: 'Welcome to Typo!'}],
      ['button', {style: getButtonStyle(), textContent: 'Start game', handlers: {onclick: startGame}}],
      ['user_info', {style: styleBlock('width: 100%')}, [
        ['h2', {style: styleBlock('font-size: 20px; margin: 10px 0;'), textContent: 'User:'}],
        ['input', {id: 'user_name', style: styleBlock('font-size: 20px; margin: 10px 0; background: white;'), value: userName, placeholder: 'enter your name', handlers: {oninput: onUserNameChange}}],
      ]],
      ['options', {style: styleBlock('width: 100%')}, [
        ['h2', {style: styleBlock('font-size: 20px; margin: 10px 0;'), textContent: 'Options:'}],
        createTextCheckbox('lower_case', 'Lower case only', false),
        createTextCheckbox('no_diacritics', 'Without diacritics', false),
        createTextCheckbox('shuffle', 'Shuffle words', true),
      ]]
    ]
    ]);
    document.body.appendChild(_container);
  }


  function startGame() {
    InputController.stealFocus();
    console.log('starting game');
    // PageTextExtractor.getWords();
    const filterDiacritics = array => array.filter(word => word.match(new RegExp('^[A-z]+$')));
    const makeLowerCase = array => array.map(w => w.toLowerCase());
    const makeRandom = array => shuffleArray(array);

    // const checkboxNode = byId('shuffle');
    // const isChecked = checkboxNode.checked;
    // const words = PageTextExtractor.getWords(isChecked);

    const originalWords = PageTextExtractor.getWords();

    const noChangedFn = array => array;
    const modificationsFunctions = [
      true ? filterDiacritics : noChangedFn,
      true ? makeLowerCase : noChangedFn,
      true ? makeRandom : noChangedFn,
    ];

    const words = modificationsFunctions.reduce((acc, fn) => fn(acc), originalWords);

    ListController.drawWords(words);
    WordsController.startGame(words, {animationDuration: duration});   // todo: move all this logic to screen controller

    _container.remove();
  }

  function onUserNameChange(e) {
    const name = e.target.value;
    browser.storage.local.set({user_name: name});
    browser.runtime.sendMessage({type: 'user_name', name});
  }

  function getButtonStyle(customStyle = '', size = 2) {
    return `
      padding: ${size}px ${size * 2 + 1}px;
      background-color: white;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      touch-action: manipulation;
      cursor: pointer;
      -moz-user-select: none;
      user-select: none;
      border: 1px solid #ccc;
      ${customStyle}
      `;
  }

  function createTextCheckbox(id, text, value) {
    return ['div', {style: styleBlock(`display: flex; align-items: center;`)}, [
      createCheckbox(value, {id: id}),
      ['label', {style: styleNode(`cursor: default;`), for: id, textContent: text}],
    ]]
  }

  function createCheckbox(value, attributes = {}, customStyle = '') {
    return ['input', {
      type: 'checkbox',
      ...attributes,
      ...(value ? {checked: true} : {}),
      style: styleNode(`width: 14px; height: 14px; margin: 0 10px 0 0; appearance: checkbox; -moz-appearance: checkbox; -webkit-appearance: checkbox;${customStyle}`)
    }]
  }

})();

