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
    $('body').on('click', '.query_two', function(e) {
        var data = {};
        query_two_api();
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
            var columns_data = [];
            $.each(response['results'], function(i, pie) {
                var post_id = 'Rank ' + (i+1).toString() + ' - ' + pie['value'] + ' votes';
                var votes = pie['value'];
                columns_data.push([post_id, votes]);
            });
            
            var chart = c3.generate({
                bindto: '#chart',
                data: {    
                    columns: columns_data,
                    type : 'pie',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                }
            });
        });
        promise.error(function() {
            
        });
    };
    var query_two_api = function() {
        data = {};
        data.query_num = '2';
        data.tags = 'calculus,combinatorics,limits';
        
        var promise = $.ajax({
            url: "/query/",
            type: "POST",
            data: data
        });
        
        promise.success(function(response) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var columns_data = [];
            var months_data = {};
            
            $.each(response['results'], function(i, tag){
                $.each(tag, function(i, v) {
                    var tag_month = v['_id'];
                    tag_month = tag_month.split('_')
                    var tag_name = tag_month[0];
                    var month = parseInt(tag_month[1]);
                    var month_name = months[month - 1];
                    
                    if(month_name in months_data) {
                        months_data[month_name].push(v['value']);
                    } else {
                        months_data[month_name] = [v['value']];
                    }
                });    
            });
            
            $.each(months_data, function(k, v) {
                v.splice(0, 0, k);
            });

            $.each(months, function(i, name) {
                columns_data.push(months_data[name]);
            });

            var tags_data = [];

            var chart = c3.generate({
                data: {
                    columns: columns_data,
                    type: 'bar',
                    groups: [
                        months
                    ]
                },
                grid: {
                    y: {
                        lines: [
                                  {value: 1, text: 'calculus'},
                                  {value: 2, text: 'real-analysis'},
                                  {value: 3, text: 'linear-algebra'}
                                ]
                    }
                },
                bindto: '#chart'
            });
        });

        promise.error(function() {
            
        });
    };
    
};

app.init_click_handlers();
