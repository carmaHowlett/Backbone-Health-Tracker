// js/views/selected.js
var app = app || {};

// The DOM element for a selected item...
app.selectedView = Backbone.View.extend({

    // Each food or beverage item is displayed in a table row
    tagName: 'tr',

    // Cache the template function for a single result item
    template: _.template($('#selectedTemplate').html()),

    // Events specific to an individual result item
    events: {
        'click .destroy': 'removeItem'
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

    // This function will destroy the model when the remove button is selected
    removeItem: function(model) {
        this.model.destroy();
    }

});
