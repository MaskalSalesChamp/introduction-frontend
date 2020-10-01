import _ from 'underscore';
import { View } from 'backbone.marionette';
import $ from 'jquery';

import './main.scss'; // this file should include imports for bootstrap

const MyView = View.extend({
  tagName: 'h1',
  template: _.template('Marionette says hi!')
});

const myView = new MyView();
myView.render(); 
$('body').append(myView.$el);