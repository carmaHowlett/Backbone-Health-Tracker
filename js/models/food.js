// js/models/food.js
var app = app || {};

// Food Model
// ----------
// Our basic **food** model has 'name', 'brand' and 'calories' attributes.

app.foodModel = Backbone.Model.extend({

    // Default attributes
    defaults: {
        name: '',
        brand: '',
        calories: ''
    }
});
