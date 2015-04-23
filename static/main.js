var app = app || {};


(function() {
    app.top_tags_template = Handlebars.compile($("#top_tags_template").html());
    app.panel_template = Handlebars.compile($("#panel_template").html());
    app.thank_you_template = Handlebars.compile($("#thank_you_template").html());    
})();


app.init_click_handlers = function() {
    $('body').on('click', '.query_one', function(e) {
        query_one_api();
    });
    $('body').on('click', '.query_two', function(e) {
        query_two_api();
    });
    $('body').on('click', '.query_three', function(e) {
        query_three_api();
    });
    $('body').on('click', '.query_four', function(e) {
        query_four_api();
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
            
            var panel_html = app.panel_template({
                heading: "Top rated questions",
                content: "Results show the top rated questions based on votes they recieved in a pie chart"
            });
            $('.result').empty().prepend(panel_html).append('<div id="chart"></div>');
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
            var html = app.panel_template({
                heading: "Tagging trends in a year",
                content: "Results show the tagged questions trends for the year 2014 in a stacked bar chart. #calculus, #combinatorics, #limits"
            });
            $('.result').empty().prepend(html).append('<div id="chart"></div>');
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
    var query_three_api = function() {
        data = {};
        data.query_num = '3';
        
        var promise = $.ajax({
            url: "/query/",
            type: "POST",
            data: data
        });
        
        promise.success(function(response) {
            var start_html = '<ul class="list-group" style="width:450px;">';
            var li = '';
            var panel_html = app.panel_template({
                heading: "Top ten tags for mathematics",
                content: "Results show the top 10 tags in mathematics category"
            });
            $.each(response['results'], function(i, tag_info) {
                var html = app.top_tags_template(tag_info);
                li += html;
            });
            $('.result').empty().prepend(panel_html);
            $('.result').append(start_html + li + '</ul>');
        });
        promise.error(function() {
            
        });
    };
    var query_four_api = function() {
        data = {};
        data.query_num = '4';
        
        var promise = $.ajax({
            url: "/query/",
            type: "POST",
            data: data
        });
        
        promise.success(function(response) {
            var start_html = '<ul class="list-group" style="width:450px;">';
            var li = '';
            var panel_html = app.panel_template({
                heading: "Thank you answers",
                content: "Results show the thank you comments when users comment on answers they find usefull"
            });
            $.each(response['results'], function(i, comment) {
                var html = '';
                comment.Text = comment.Text.replace(new RegExp('thank you', 'ig'), "<span class='label label-warning'>thank you</span>");
                html = app.thank_you_template(comment);
                li += html;
            });
            $('.result').empty().prepend(panel_html);
            $('.result').append(start_html + li + '</ul>');
        });
        promise.error(function() {
            
        });
    };
    
};

app.init_click_handlers();
