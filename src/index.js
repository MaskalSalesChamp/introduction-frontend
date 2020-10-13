import _ from 'underscore'
import Bb from 'backbone'
import { View, Application, CollectionView } from 'backbone.marionette'
import $ from 'jquery'
import listTemp from './templates/ListView.hbs'
import headerTemp from './templates/headerView.hbs'
import buttonsTemp from './templates/buttonsView.hbs'
import searchTemp from './templates/searchView.hbs'
import appLayoutTemp from './templates/appLayoutView.hbs'
import listItemTemp from './templates/ListItemView.hbs'
import adressTemplate from './templates/adressTemplate.hbs'

import '@fortawesome/fontawesome-free/js/all.js'

import './main.scss' // this file should include imports for bootstrap

var AdressCollection = Backbone.Collection.extend({
  url:
    'https://introduction-api.do.saleschamp.io/introduction-api/items/address',
  parse: function (data) {
    return data.data
  },

  initialize: function () {
    this.bind('reset', function () {
      console.log('Inside event')
      //console.log(model)
    })
  }
})
/*var dataCollectionInstance = new dataCollection()
  dataCollectionInstance.fetch({
    success: function (response) {
      console.log('Inside success')
      console.log(response)
    },
    error: function (errorResponse) {
      console.log(errorResponse)
    }
  })*/
//var App = new Backbone.Marionette.Application();
var HeaderView = View.extend({
  template: headerTemp,
  regions: {
    headerRegion: '#header-region'
  },
  initialize (options) {
    this.labelAdress = options.labelAdress || 'Neznama ulica';
  },
  templateContext () {
    return {
      labelAdress: this.labelAdress
    }
  }
})
var ButtonsView = View.extend({
  template: buttonsTemp,
  regions: {
    buttonRegion: '#button-region'
  }
})
var SearchView = View.extend({
  template: searchTemp,
  regions: {
    searchRegion: '#search-region'
  }
})

var ListView = CollectionView.extend({
  childViewOptions (model) {
    //console.log(model);
    //console.log(model.get('adresses'))
    return { collection: model.get('adresses') }
  },
  /*adressSelected: function(childView){
    console.log('adress selected: ' + childView.model.cid);
    this.triggerMethod('selected:adress', this, childView);
  },*/

  childView: CollectionView.extend({
    childViewEvents: {
      'select:item': 'itemSelected'
    },    
  
    addClass() {
    },
    itemSelected (view) {
      console.log(this.$el);
      this.$el.addClass('active');
      this.toggleElement = this.$el[0];
      //console.log(this.toggleElement);
      //var selectedAdress = _.values(this.collection.models);
      var selectedAdress = this.collection.toJSON()
      console.log(selectedAdress[0].city)
      var newHeaderView = new HeaderView({
        labelAdress: selectedAdress[0].city
      });
      console.log(newHeaderView);
      newHeaderView.render();

    },
    childView: View.extend({
      classname: 'active',
      initialize () {},
      triggers: {
        'click li': 'select:item'
      },
      template: adressTemplate,
    })
  })
})

const MyView = View.extend({
  template: appLayoutTemp,
  regions: {
    mainRegion: '#main-region',
    header: '#header-region',
    buttons: '#buttons-region',
    search: '#search-region',
    list: '#list-region'
  },
  onRender () {
    var collection = new AdressCollection()
    collection.fetch({
      success: response => {
        var streetCollection = new Backbone.Collection(
          _.values(
            _.mapObject(
              collection.groupBy(adress => {
                return adress.get('city') + adress.get('street')
              }),
              (value, key) => {
                return {
                  street: key,
                  adresses: new Backbone.Collection(
                    value.map(model => {
                      //console.log(model.attributes);
                      return model.attributes
                    })
                  )
                }
              }
            )
          )
        )
        this.showChildView(
          'list',
          new ListView({ collection: streetCollection })
        )
        this.showChildView(
          'header',
          new HeaderView({})
          
        )
        console.log(new HeaderView({}));

        //console.log(streetCollection)
        //console.log(response);
      }
    }),
      this.showChildView('buttons', new ButtonsView())
    this.showChildView('search', new SearchView())
  },
  childItemSelected: function () {
    console.log('daco')
  }
})
const App = Application.extend({
  region: '#app-container',

  onStart (app) {
    this.showView(new MyView({}))
  }
})
const app = new App()

app.start({})
