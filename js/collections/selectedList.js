// js/collections/selectedList.js
var app = app || {};

// A simple variable for the selected food list collection
var selectedList = Backbone.Collection.extend({
    model: app.foodModel,

    // Saving the foot item under 'selectedFoods-backbone'
    localStorage: new Backbone.LocalStorage('selectedFoods-backbone'),
});

// Creating a global collection of items
app.selectedFoods = new selectedList();
