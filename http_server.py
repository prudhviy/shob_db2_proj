import os
from flask import Flask, request, jsonify
from pymongo import MongoClient

DB = 'mathstack'

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')


def get_query_one(db):
    query_one_coll = db['query_one']
    result = []

    for each in query_one_coll.find().sort([("value", -1)]).limit(10):
        result.append(each)

    return result


@app.route("/query/", methods=['POST'])
def query_api():
    """ Query MongoDB """

    client = MongoClient('localhost', 27017)
    db = client[DB]

    if request.method == 'POST':
        query_num = request.form['query_num']
        #query_field = request.form['query_field']
        
        result = {'results': []}
        
        if query_num == '1':
            result['results'] = get_query_one(db)
            print result
       

    return jsonify(**result)

@app.route('/static/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(os.path.join('static', path))


if __name__ == "__main__":
    app.run(debug=True)
    #app.run(host='0.0.0.0')
