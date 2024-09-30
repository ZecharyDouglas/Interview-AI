from flask import Flask , jsonify , request
import boto3
import botocore
from botocore.exceptions import ClientError
from flask_cors import CORS
from datetime import datetime

#creates the app and then enables the CORS for all domains
app = Flask(__name__)
CORS(app)

#getting the dynamodb service resource
session = boto3.Session(profile_name='default')
dynamodb = session.resource('dynamodb', region_name='us-east-1')
users = dynamodb.Table('Users')

#test for listening
@app.route('/' , methods=['GET'])
def method_name():
    return jsonify({
        'message':'The API works!'
    })
    

#post request to sign up user
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('username')
    password = data.get('password')
    # entry_time = datetime.now().isoformat()
    try:
        users.put_item(
            Item={
                'user_id': email,
                'password': password,
            },
            ConditionExpression="attribute_not_exists(user_id)"
        )
        return jsonify({
            'message':"User was created successfully"
        }) , 200
    except Exception as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return jsonify({
                "error" : "User already exists."
            })
        else:
            return jsonify({
                "error":str(e) 
            }) , 500

    
#post request to sign in a user

#middleware?

#get request to get a user's confidence metrics
#get request to see if a user is signed in 
#get request to plot user progress in charts

#post request to call model processing and return results to the database

if __name__ == '__main__':
    app.run(debug=True)