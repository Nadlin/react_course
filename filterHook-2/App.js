import React from 'react';
import ReactDOM from 'react-dom';

import Filter from './components/Filter';

let wordListArr = ['california', 'everything', 'aboveboard', 'washington', 'basketball', 'weathering', 'characters', 'literature', 'contraband', 'appreciate'];

ReactDOM.render(
  <Filter wordList={wordListArr} />
  , document.getElementById('container') 
);

