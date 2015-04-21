from bson.code import Code
from pymongo import MongoClient

import sys

DB_NAME = 'mathstack'

map_query_one = """
function() {
    if(this.VoteTypeId == "2") {
        emit(this.PostId, parseInt(this.VoteTypeId));
    }
}
"""
reduce_query_one = """
function(key, values) {
    return values.length;
}
"""

def run_mapr_query_one(db):
	db['votes'].map_reduce(map_query_one, reduce_query_one, "query_one", connectTimeoutMS=None)

if __name__ == "__main__":
	query_num = sys.argv[1]
	
	client = MongoClient('localhost', 27017)
	db = client[DB_NAME]

	if query_num == "1":
		run_mapr_query_one(db)