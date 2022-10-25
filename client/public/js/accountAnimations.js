import getRuleWithSelector from './getRuleWithSelector';

export function previousAnimation(current, previous) {
  const main = getRuleWithSelector('.accountPage .accountBlock::after');
  const previousBlock = document.getElementById(previous);
  const currentBlock = document.getElementById(current);
  const accountBlock = document.getElementsByClassName('accountBlock')[0];
  accountBlock.style.justifyContent = 'right';
  main.style.animation = 'toNext 1s linear';
  setTimeout(() => {
    previousBlock.style.display = 'flex';
    currentBlock.style.display = 'none';
  }, 500);
  setTimeout(() => {
    main.style.animation = '';
    accountBlock.style.justifyContent = 'initial';
  }, 1000);
}

export function nextAnimation(current, next) {
  const main = getRuleWithSelector('.accountPage .accountBlock::after');
  const currentBlock = document.getElementById(current);
  const nextBlock = document.getElementById(next);
  main.style.animation = 'toNext 1s linear';
  setTimeout(() => {
    nextBlock.style.display = 'flex';
    currentBlock.style.display = 'none';
  }, 500);
  setTimeout(() => {
    main.style.animation = '';
  }, 1000);
}
