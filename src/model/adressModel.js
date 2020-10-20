import _ from 'underscore'
import Bb from 'backbone'

var AdressModel = new Bb.Model.extend({
    defaults: {
        adressLabel: 'Unknown'
      }
})

export default AdressModel; 