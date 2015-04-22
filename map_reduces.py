from bson.code import Code
from pymongo import MongoClient
import time
import sys

DB_NAME = 'mathstack'

map_query_one = Code("""
function() {
    if(this.VoteTypeId == "2") {
        emit(this.PostId, parseInt(this.VoteTypeId));
    }
}
""")

reduce_query_one = Code("""
function(key, values) {
    return values.length;
}
""")

map_query_two = Code("""
function() {
	var cnt = 0;
	var curr = this.Tags;
	var date_obj = new Date(this.CreationDate);
	var tags = [];

	if(curr) {
		for (var i = 0; i < curr.length; i++) {
			if(curr[i] === '<') {
				cnt += 1;
			}
		}
	}
	if(cnt > 1) {
		curr = curr.replace(/></g, " ");
		curr = curr.replace(/</g, "");
		curr = curr.replace(/>/g, "");
		var temp = curr.split(" ");
		for (var i = 0; i < temp.length; i++) {
		    tags.push(temp[i]);
		}
	} else if(cnt == 1) {
		curr = curr.replace(/</g, "");
		curr = curr.replace(/>/g, "");
		tags.push(curr);
	}

	if(cnt > 0 && date_obj.getFullYear() == 2014) {
		for (var i = 0; i < tags.length; i++) {
			var month = date_obj.getMonth() + 1;
		    emit(tags[i] + '_' + month, 1);
		}
	}
}
""")

reduce_query_two = Code("""
function(key, values) {
	return Array.sum(values);
}
""")


"""
var month_cnt = {};
	for (var i = 0; i < values.length; i++) {
		if(values[i] in month_cnt) {
			month_cnt[values[i]] += 1;
		}
		else {
			month_cnt[values[i]] = 1;
		}
	}
    return month_cnt;
"""

def run_mapr_query_one(db):
	db['votes'].map_reduce(map_query_one, reduce_query_one, "query_one", connectTimeoutMS=None)


def run_mapr_query_two(db):
	db['posts'].map_reduce(map_query_two, reduce_query_two, "query_two", connectTimeoutMS=None)

if __name__ == "__main__":
	query_num = sys.argv[1]
	
	client = MongoClient('localhost', 27017)
	db = client[DB_NAME]

	start_time = time.time()

	if query_num == "1":
		run_mapr_query_one(db)
	elif query_num == "2":
		run_mapr_query_two(db)

	print("--- %s seconds ---" % (time.time() - start_time))
