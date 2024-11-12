from flask import Flask , jsonify , request ,  redirect, url_for, render_template , make_response , session
import boto3
import uuid
import botocore
from cachelib.file import FileSystemCache
from flask_session import Session
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
from flask_cors import CORS , cross_origin
from datetime import datetime
import secrets
from Blueprints.TextAnalysis.transcript import transcript_bp
from Blueprints.TextAnalysis.speech import speech_bp
import os


#creates the app and then enables the CORS for all domains
app = Flask(__name__)
#CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}}, allow_headers=["Content-Type", "Authorization"])
app.config['SESSION_TYPE'] = 'cachelib'  # or other storage types
app.config['SESSION_CACHELIB'] = FileSystemCache(threshold=500, cache_dir="sessions")
app.config['SESSION_SERIALIZATION_FORMAT'] = 'json'
app.config['SESSION_COOKIE_DOMAIN'] = 'localhost'
app.config['SESSION_COOKIE_SAMESITE']="None"
app.config['SESSION_COOKIE_SECURE']=False
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# Ensure the sessions directory exists
if not os.path.exists("sessions"):
    os.makedirs("sessions")

Session(app)
    
app.secret_key = secrets.token_hex(16)

#Loads in the routes in the blueprint
app.register_blueprint(transcript_bp, url_prefix = "/transcript")
#Loads in the speechrecognition endpoints defined in the blueprint
app.register_blueprint(speech_bp, url_prefix = "/speech")

#getting the dynamodb service resource
aws_session = boto3.Session(profile_name='default')
dynamodb = aws_session.resource('dynamodb', region_name='us-east-1')
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
    email = data.get('email')
    password = data.get('password')
    occupation = data.get('occupation')
    name = data.get('name')
    itemId = str(uuid.uuid4())  # Generate a unique UUID for the item_id
    # entry_time = datetime.now().isoformat()
    try:
        users.put_item(
            Item={
                'user_id': email.lower(),#making sure we only work with lowercase version of text
                'password': password,
                'name': name,
                'occupation': occupation,
                'item_id': itemId
            },
            ConditionExpression="attribute_not_exists(user_id)"
        )
        return jsonify({
            'message':"User was created successfully"
        }) , 200
    except Exception as e:
        if isinstance(e, botocore.exceptions.ClientError) and e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return jsonify({
                "error" : "User already exists."
            })
        else:
            print(str(e) )
            return jsonify({
                "error":str(e) 
            }) , 500

    
#post request to sign in a user
@app.post('/signin')
@cross_origin(origins=["http://localhost:5173"] , supports_credentials=True)
def signIn():
    email = request.form['email']
    password = request.form['password']
    # data = request.get_json()
    # email = data.get('email')
    # password = data.get('password')
    try:
        response = users.query(KeyConditionExpression=Key('user_id').eq(email.lower()), FilterExpression=Attr('password').eq(password)
        )
        items = response['Items']
        print(items)
        if (len(items)>0):
            session['user_id'] = email.lower()
            print(session)
            
            return make_response(jsonify({
                "message":f"User successfully found, session created! The current user is {session.get('user_id')}",
            }), 200)
        else:
            return make_response(jsonify({
                "error":"Credentials could not be validated , please try again"
            }), 450) 

            
    except Exception as e:
        return make_response(jsonify({
            "error": f"{str(e)}"
        }) , 500)  

#middleware?

#get request to get a user's confidence metrics
@app.get('/getconfidenceall')
def getConfidence():
    print("Request Cookie:",request.cookies)
    email =  session.get('user_id')
    if not email :
        return make_response(jsonify({
            "message":"User fetch failed."
        }), 300)
    else:
        print(f"The current user is {email}")
        print(email)
        try:
            
            response = users.scan(
                FilterExpression = Attr('user_id').eq(email) & Attr('confidence_value').exists()
            )
            items = response['Items']
            print(items)
            # Iterate over each item and convert any sets to lists
            for item in items:
                for key, value in item.items():
                    if isinstance(value, set):  # Check if the value is a set
                        item[key] = list(value)  # Convert it to a list

            return jsonify(items)
        except Exception as e:
                return jsonify({
                    "error":str(e) 
                }) , 500


@app.post('/postconfidence')
def postconfidence():
    data = request.get_json()
    confidence_value = data.get('confidence_value')
    interview_topic = data.get('interview_topic')
    interview_transcript = data.get('interview_transcript')
    interview_feedback = data.get('interview_feedback')
    # user_id = session.get.id ## still need to figure out getting current user email
    entry_time = datetime.now().isoformat()
    itemId = str(uuid.uuid4())  # Generate a unique UUID for the item_id
    try:
        users.put_item(
            Item={
                'user_id': user_id,#making sure we only work with lowercase version of text
                'item_id': itemId,
                'confidence_value': confidence_value,
                'interview_topic': interview_topic,
                'interview_transcript': interview_transcript,
                'interview_feedback': interview_feedback,
                'entry_time': entry_time,
            },
            
        )
        return jsonify({
            'message':"Interview data was successfully uploaded"
        }) , 200
    except Exception as e:
        return jsonify({
                "error":str(e) 
            }) , 500


#post request to call model processing and return results to the database

if __name__ == '__main__':
    app.run(debug=True)