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
import formTemp from './templates/formTemplate.hbs';
//import { AdressModel } from './model/adressModel.js';

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

var State = Backbone.Model.extend({
  defaults: {
    selectedAdress: null
  },
});
var FormView = View.extend({
  template: formTemp,
  regions: {
  }
})

var HeaderView = View.extend({
  template: headerTemp,
  initialize (model) {
    this.labelAdress = this.model.get('selectedAdress') || 'Neznama ulica';
    this.listenTo(this.model, 'change:selectedAdress', this.onStreetChange);
    //this.model.on('change:street',this.reRender);  
    //console.log(this.model);

  },
  onStreetChange() {
    /*console.log('CHANGEEEEEE!!');
    console.log(this.model.get('selectedAdress').attributes.street);*/
    this.labelAdress = this.model.get('selectedAdress').attributes.street;
    this.render();
  },
  templateContext () {
    return {
      labelAdress: this.labelAdress
    }
  }
})
var ButtonsView = View.extend({
  template: buttonsTemp,
  triggers: {
    'click @ui.nt': 'onNTClick',
    'click @ui.ovk': 'onOVKClick'
  },
  ui: {
    nt: '#NT',
    ovk: '#OVK'
  },
  initialize () {
    this.listenTo(this.model, 'change:selectedAdress', this.onStreetChange);
  },
  onStreetChange(){
  },
  /*onNTClick() {
    var attributes = Backbone.Model.extend({});
    attributes = this.model.get('selectedAdress').attributes;
    //var status = this.model.get('selectedAdress');
    console.log(attributes);
    this.attributes.set('status','NT');
    console.log(this.model.get('selectedAdress').attributes);
    //console.log(this.model.get('selectedAdress').attributes.id);
    //console.log("https://introduction-api.do.saleschamp.io/introduction-api/items/address/"+ this.model.get('selectedAdress').attributes.id);

    console.log(this.model.url + this.model.get('selectedAdress').attributes.id);
    this.model.save('selectedAdress.attributes.status', 'NT', {url:"https://introduction-api.do.saleschamp.io/introduction-api/items/address/"+ this.model.get('selectedAdress').attributes.id});
    console.log(this.model.get('selectedAdress'));
  },
  onOVKClick() {
    console.log(this.getUI('ovk'));
  }*/
})
var SearchView = View.extend({
  template: searchTemp,
  regions: {
    searchRegion: '#search-region'
  }
})


var ListView = CollectionView.extend({
  initialize () {
    //console.log(this.options.model);
  },
  tagName: 'ul',
  className: 'list-group',
  childViewOptions (model) {
    //console.log(model);
    //console.log(model.get('adresses'))
    return { collection: model.get('adresses'),state: this.options.model}
  },

  childView: CollectionView.extend({
    tagName:'li',
      className: 'list-group-item',
    childViewEvents: {
      'select:item': 'itemSelected'
    },
    itemSelected (view) {
      var stateModel = this.options.state;
      this.$el.toggleClass('active');
      this.toggleElement = this.$el[0];

      stateModel.set('selectedAdress', view.model);
      console.log(stateModel.get('selectedAdress').attributes.street);

    },
    childView: View.extend({
      tagName:'span',
      initialize () {},
      triggers: {
        'click span': 'select:item'
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
  childViewEvents: {
    'onNTClick': 'NTClicked',
    'onOVKClick': 'OVKClicked'
  },

  NTClicked() {
    this.model.save('selectedAdress.attributes.status', 'NT', {url:"https://introduction-api.do.saleschamp.io/introduction-api/items/address/"+ this.model.get('selectedAdress').attributes.id, patch: true});
    console.log(this.model.get('selectedAdress'));
  },
  OVKClicked() {
    this.showChildView('mainRegion', new FormView());
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
          new ListView({ collection: streetCollection, model:this.model})
        )
      }
    }),
    this.showChildView(
      'header',
      new HeaderView({model:this.model})
    ),
    this.showChildView('buttons', new ButtonsView({model:this.model}))
    this.showChildView('search', new SearchView())
    this.listenTo(this.model, 'change',() => console.log('change made' + this.model))


  },

})
const App = Application.extend({
  region: '#app-container',
  onBeforeStart(app, options) {
    this.model = new State(options.data);
  },

  onStart (app) {
    this.showView(new MyView({
      model: this.model
    }))
    //console.log(this.model.attributes.selectedAdress);
  }
})
const app = new App()

app.start({
  data: {
    id: 0,
    city: 'unknown - city',
    status: 'unknown - status',
    street: 'unknown - street',
    postalCode: 'unknown - postalCode',
    isSelected: false
  }
})
