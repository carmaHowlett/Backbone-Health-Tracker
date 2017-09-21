// js/views/health.js
var app = app || {};

// The DOM element for a item...
app.foodView = Backbone.View.extend({

    // Each food or beverage item is displayed in a table row
    tagName: 'tr',

    // Cache the template function for a single result item
    template: _.template($('#healthTemplate').html()),

    // Events specific to an individual result item
    events: {
        'click .add': 'addToSelected'
    },

    // This function will update the view when the model is changed or destroyed
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    // This function will render the view
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    // This function adds the result item model to the selected results collection
    // when the add button is selected
    addToSelected(e) {

      if (this.$el.hasClass('disabled')) return;

      // hide add button
      e.target.style.display = 'none';
      this.$el.addClass('disabled');

        var newItem = new app.foodModel({
            name: this.model.get('name'),
            brand: this.model.get('brand'),
            calories: this.model.get('calories'),
        });
        app.selectedFoods.create(newItem);
    }

});
