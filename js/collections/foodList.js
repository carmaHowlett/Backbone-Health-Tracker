// js/collections/foodList.js
var app = app || {};

// A simple variable for the food list collection
var foodList = Backbone.Collection.extend({
    model: app.foodModel,

    // Saving the foot item under 'foods-backbone'
    localStorage: new Backbone.LocalStorage('foods-backbone'),
});

// Creating a global collection of items
app.foods = new foodList();
