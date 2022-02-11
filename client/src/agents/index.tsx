//@ts-nocheck

import { default as React, useState } from 'react';
import Agents from './Agents';
import Personalities from "./Personalities";
import Prompts from './Prompts';
import Settings from './Settings';
import { views } from './views';
import Nav from "./Nav";

const App = () => {
  const [currentView, setCurrentView] = useState(views.Personalities);

  const changeView = (view) => {
    setCurrentView(view);
  }

  return (
    <div className="agents-container">
      <Nav currentView={currentView} changeView={changeView} />
      {currentView === views.Personalities && <Personalities />}
      {currentView === views.Settings && <Settings />}
      {currentView === views.Agents && <Agents />}
      {currentView === views.Prompts && <Prompts />}
    </div>
  )

};

export default App;
