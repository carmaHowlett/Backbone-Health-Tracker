// js/views/appView.js
var app = app || {};

// The Health Tracker
// ---------------

// Our overall **AppView** is the top-level piece of UI.
app.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML - healthTracker
    el: '#healthTracker',

    // Our Template for the number of items selected and total calories
    counterTemplate: _.template($('#counterTemplate').html()),

    // Delegated events for creating, clearing, receiving search results data
    events: {
        'click #searchButton': 'getJson', // Receives Nutriotionix data when search is selected
        'click #clearResults': 'clearResults', // Clears all the results from local storage
        'click #clearSelected': 'clearSelected', // Clears the selected items from local storage
        'keyup #searchBar': 'processKey' // Allows the use of "enter" key instead of just the button select
    },

    // At initialization we bind to the relevant events on the `selectedFoods`
    // collection, when items are added or changed.
    initialize: function() {
        this.$counter = $('#counter');
        this.$searchBar = $('#searchBar');

        this.listenTo(app.foods, 'add', this.addToResults);
        this.listenTo(app.selectedFoods, 'add', this.addToSelected);
        this.listenTo(app.selectedFoods, 'reset', this.addAll);
        this.listenTo(app.selectedFoods, 'all', this.render);

        app.selectedFoods.fetch();
        app.foods.fetch();
    },

    // Rendering the counter of selected items at the bottom
    render: function() {
        var selected = app.selectedFoods.length;
        var totalCalories = 0;
        app.selectedFoods.each(function(model) {
            var calories = model.get('calories');
            totalCalories += calories;
        })

        if (app.selectedFoods.length) {
            this.$counter.show();

            this.$counter.html(this.counterTemplate({
                selected: selected,
                totalCalories: totalCalories
            }));
        } else {
            this.$counter.hide();
        }
    },

    // Add a single item to the list by creating a view for it, and
    // appending its element to the `<td>`.
    addToResults: function(item) {
        var searchResult = new app.foodView({
            model: item
        });
        $('#searchResults').append(searchResult.render().el);
    },

    // Adds views for the selected items and appends them to the selected results section
    addToSelected: function(item) {
        var selectedItem = new app.selectedView({
            model: item
        });
        $('#selectedResults').append(selectedItem.render().el);
        this.clearResults();
    },

    // Renders the selected items that are stores in the *localStorage*
    addAll: function() {
        this.selectedFoods.each(this.addToSelected, this);
    },

    // Fetches item data using the Nutritionix API
    getJson: function() {
        $('#searchResults').empty();
        var searchTerm = $('#searchBar').val();
        $('#searchBar').val('');
        var nutritionixUrl = 'https://api.nutritionix.com/v1_1/search/' + searchTerm + '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=79638cff&appKey=a7129008b91c0ae9412ae2316564d518'

        //Show loader gif
        $(".loader").fadeIn();

        $.ajax({
            method: 'GET',
            url: nutritionixUrl,
            dataType: 'json',
            success: function(data) {
                var jsonArray = data.hits;
                for (var i = 0; i < jsonArray.length; i++) {
                    var resultItem = new app.foodModel({
                        name: jsonArray[i].fields.item_name,
                        brand: jsonArray[i].fields.brand_name,
                        calories: jsonArray[i].fields.nf_calories,
                    });
                    app.foods.create(resultItem);
                }
                if (jsonArray.length == 0) {
                    $('#searchResults').append('<h2>Sorry! No results were found. Please try entering a different item</h2>');
                }
            },
            error: function() {
                $('#searchResults').append('<h2>Couldn\'t retrieve Nutritionix data. Please check internet connection or try again later.</h2>');
            }

        });
        //fade out loader gif
        $(".loader").fadeOut(500);
    },



    // This function will destroy models in foods collection
    clearResults: function() {
        _.invoke(app.foods.toArray(), 'destroy');
        this.$searchBar.val('');
        return false;
    },

    // This function will destroy models in selected foods collection
    clearSelected: function() {
        _.invoke(app.selectedFoods.toArray(), 'destroy');
        return false;
    },

    // This function allows the user to press enter button as well as clicking the button
    processKey: function(e) {
        if (e.which === 13)
            this.$('#searchButton').click();
    }
});
