import React from 'react';
import ReactDom from 'react-dom';
import Demo from './components/demo';

function App() {
  return (
    <div>
      <Demo />
    </div>
  );
}

ReactDom.render(<App />, document.getElementById('app'));
