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
import formTemp from './templates/formTemplate.hbs'
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
  url:
    'https://introduction-api.do.saleschamp.io/introduction-api/items/address',
  defaults: {
    selectedAdress: null
  }
})

var HeaderView = View.extend({
  template: headerTemp,
  initialize (model) {
    var adressModel = this.options.adressModel;
    console.log(adressModel);
    this.labelAdress = this.model.get('selectedAdress') || adressModel.get('street');
    this.listenTo(this.model, 'change:selectedAdress', this.onStreetChange)
  },
  onStreetChange () {
    this.labelAdress = this.model.get('selectedAdress').attributes.city + ', ' 
    + this.model.get('selectedAdress').attributes.street 
    + ' ' + this.model.get('selectedAdress').attributes.number
    this.render()
  },
  templateContext () {
    return {
      labelAdress: this.labelAdress
    }
  }
})
var FormView = View.extend({
  template: formTemp,
  ui: {
    cancel: '#cancel',
    save: '#save',
    name: '#InputName',
    email: '#InputEmail',
    form: '#form'
  },
  preventDefault: true,
  events: {
    'click @ui.cancel': 'cancelling',
    'click @ui.save': 'saving'
  },
  triggers: {
    'click @ui.cancel': 'onCancelClick',
    'click @ui.save': 'onSaveClick',
    'submit @ui.form': 'click:submit'
  },
  cancelling(){
  },

  saving(){
    console.log(this.model)
    var name = this.ui.name.val();
    var email = this.ui.email.val();
    var activeId = this.model.get('selectedAdress').id
    //console.log('https://introduction-api.do.saleschamp.io/introduction-api/items/address/' + activeId);

    this.model.get('selectedAdress').save(
      { status: 'OVK', name: name, email: email },
      {
        url:
          'https://introduction-api.do.saleschamp.io/introduction-api/items/address/' +
          activeId,
        patch: true,
        success () {
          console.log('saved OVK')
        }
      }
    )
    this.model.set('selectedAdress');
  }
})

var ButtonsView = View.extend({
  template: buttonsTemp,
  triggers: {
    'click @ui.nt': 'onNTClick',
    'click @ui.ovk': 'onOVKClick'
  },
  events: {
    'click @ui.ovk': 'NTClicked',
    'click @ui.ovk': 'OVKClicked'
  },
  ui: {
    nt: '#NT',
    ovk: '#OVK'
  },
  initialize () {
    this.listenTo(this.model, 'change:selectedAdress', this.onStreetChange)
  },
  onStreetChange () {}
})
var SearchView = View.extend({
  template: searchTemp,
  regions: {
    searchRegion: '#search-region'
  },
  triggers: {
    'keyup #searchField': 'onSearchKeyUp'
  }
})

var ListView = CollectionView.extend({
  //streetListView
  initialize () {
    //console.log(this.options);

  },
  tagName: 'ul',
  className: 'list-group listSearch',
  childViewOptions (model) {
    //console.log(model);
    //console.log(model.get('adresses').models);
    //console.log(_.each(_.pick(model.get('adresses').models, number));
    var itemLabel = model.get('street');
    var adressArray = model.get('adresses').models
    return { collection: model.get('adresses'), state: this.options.model }
  },

  childView: CollectionView.extend({
    //streetView
    initialize() {
      //console.log(this.options);
    },
    tagName: 'li',
    className: 'list-group-item streetItem',
    childViewEvents: {
      'select:item': 'itemSelected'
    },
    events: {
      'click li' : 'onSelect'
    },
    itemSelected (view) {
      var stateModel = this.options.state
      //console.log(view.model);

      //stateModel.set('selectedAdress', view.model)
    },
    childViewOptions() {
      return {state: this.options.state}
    },
    childView: View.extend({
      //streetAdressView

      template: adressTemplate,
      tagName: null,
      className: 'list-group-item',

      initialize () {
        //console.log(this.options.state);
        //console.log(this.model.attributes.number);
        //console.log(this.collection);
        console.log(this.options.model);
      },
      triggers: {
        'click span': 'select:item'
      },
      events: {
        'click li' : 'onNumberClick',
        'click span': 'onSelect'
      },
      onNumberClick() {
        var stateModel = this.options.state
        console.log(stateModel);

        stateModel.set('selectedAdress', this.options.model)
        //stateModel.set('collection', this.model.collection)
        this.$el.find('.numberItem').addClass('active');
        this.$el.parents('.streetItem').siblings().find('.numberItem').removeClass('active')
      },
      onSelect () {
        this.$el.find('span').children().removeClass('d-none');
      }
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
    onNTClick: 'NTClicked',
    onOVKClick: 'OVKClicked',
    onSaveClick: 'onSaved',
    onCancelClick: 'onCancel',
    'click:submit': 'onSubmit',
    onSearchKeyUp: 'onSearch'
  },

  onSearch(){
    console.log(this.$el.find('.listSearch').children('.streetItem').find('.daco'));
  },

  onSubmit() {
    console.log('submit??')
    console.log(this.model);
    this.render();
  },
  onCancel() {
    console.log('CANCEL??');
    //this.showChildView('search', new SearchView());
    this.$el.find('#search-region').removeClass('d-none');
    this.onRender();
    console.log(this.model)

  },
  NTClicked () {
    var activeId = this.model.get('selectedAdress').id
    //console.log(activeId)
    //console.log('https://introduction-api.do.saleschamp.io/introduction-api/items/address/' + activeId);

    this.model.get('selectedAdress').save(
      { status: 'NT' },
      {
        url:
          'https://introduction-api.do.saleschamp.io/introduction-api/items/address/' +
          activeId,
        patch: true,
        success () {
          console.log('saved')
        }
      },
    )
  },
  OVKClicked () {
    this.showChildView('list', new FormView({ model: this.model }))
    this.$el.find('#search-region').addClass('d-none');
    
    

  },
  onRender () {
    console.log('rendering')
    var collection = new AdressCollection({})
    collection.fetch({
      
      success: response => {
        console.log('fetched')
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
          new ListView({ collection: streetCollection, model: this.model })
        ),
          this.showChildView('buttons', new ButtonsView({ model: this.model })),
          this.showChildView('header', new HeaderView({ model: this.model, adressModel: streetCollection.at(0)}))
          console.log(streetCollection)
          console.log('rendering done')

      }
    }),
      //this.showChildView('header', new HeaderView({ model: this.model })),
      //this.showChildView('buttons', new ButtonsView({model:this.model}))
      this.showChildView('search', new SearchView())
    this.listenTo(this.model, 'change', () => {
      console.log('change made')

    }
    )

  }
})
const App = Application.extend({
  region: '#app-container',
  onBeforeStart (app, options) {
    this.model = new State(options.data)
  },

  onStart (app) {
    this.showView(
      new MyView({
        model: this.model
      })
    )
    console.log(this.model)
    //console.log(this.model.attributes.selectedAdress);
  }
})
const app = new App()

app.start({
  data: {
  }
})
