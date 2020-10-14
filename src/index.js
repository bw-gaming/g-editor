import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { saveLocal, getPage } from './globals/fake-data';

import './core';

import Editor from './pages/editor';
import Preview from './pages/preview';
import SquidexFormField from './globals/editor-sdk';

let element = window.Bw;
console.log('window.Bw');
const field = new SquidexFormField();
field.onInit(context => {
  console.log('on init');
  if(context.initialContent && context.initialContent.data.content){
    field.valueChanged((context.initialContent.data.content.iv));
    console.log('on init value set:',context.initialContent.data.content.iv);
  }
  else 
  {
    field.valueChanged(undefined);
  }
  
});


field.onValueChanged(function (value) {
  console.log('value', value);
  if (value)
  {
    element = JSON.parse(value);
  }
  else{
    element = getPage();
  }
  window.Bw2 = field;
  saveLocal(element);
});


ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/preview" component={ Preview } />
      <Route exact path="/posts" component={ Editor } />
      <Route exact path="/pages" component={ Editor } />
      <Route component={ Editor } />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
