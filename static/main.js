var app = app || {};

/*
(function() {
    var source = $("#tweet-template").html();
    app.tweet_template = Handlebars.compile(source);
})();
*/

app.init_click_handlers = function() {
    $('body').on('click', '.query_one', function(e) {
        var data = {};
        query_one_api();
    });
    $('body').on('click', '.all_terms', function(e) {
        var data = {};
        data.query = $('.search_input', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        all_terms_search(data);
    });
    var query_one_api = function() {
        data = {};
        data.query_num = '1';
        
        var promise = $.ajax({
            url: "/query/",
            type: "POST",
            data: data
        });
        
        promise.success(function(response) {
            console.log(response);
            /*app.show_tweets(response, function(text) {
                text = text.replace(new RegExp(data.query, 'ig'), "<span class='highlight_term'>" + data.query + "</span>");
                return text;
            });*/
        });
        promise.error(function() {
            
        });
    };
    
};

app.init_click_handlers();
