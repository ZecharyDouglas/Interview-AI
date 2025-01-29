from flask import Flask , jsonify , request ,  redirect, url_for, render_template , make_response , session 
from flask_login import LoginManager , UserMixin , login_required , login_user ,logout_user , current_user
import logging #not using
import boto3
from functools import wraps #MALWaRE
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
app.secret_key = secrets.token_hex(16)
#CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}}, allow_headers=["Content-Type", "Authorization"])
app.config['SESSION_TYPE'] = 'cachelib'  # or other storage types
app.config['SESSION_CACHELIB'] = FileSystemCache(threshold=500, cache_dir="sessions")
app.config['SESSION_SERIALIZATION_FORMAT'] = 'json'
app.config['SESSION_COOKIE_DOMAIN'] = 'localhost'
app.config['SESSION_COOKIE_SAMESITE']="Lax"
app.config['SESSION_COOKIE_SECURE']=False
CORS(app, supports_credentials=True , resources={r"/*": {"origins": "http://localhost:5173"}})
logging.getLogger('flask_cors').level = logging.DEBUG

# Ensure the sessions directory exists
if not os.path.exists("sessions"):
    os.makedirs("sessions")

server_session = Session(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "/signin"


class User(UserMixin):
    def __init__(self, email):
        self.id = email

@login_manager.user_loader
def load_user(user_id):
    return User(email=user_id)
    

#Loads in the routes in the blueprint
app.register_blueprint(transcript_bp, url_prefix = "/transcript")
#Loads in the speechrecognition endpoints defined in the blueprint
app.register_blueprint(speech_bp, url_prefix = "/speech")

#getting the dynamodb service resource
aws_session = boto3.Session(profile_name='default')
dynamodb = aws_session.resource('dynamodb', region_name='us-east-1')
users = dynamodb.Table('Users')

#test for listening
@app.route('/api/' , methods=['GET'])
def method_name():
    return jsonify({
        'message':'The API works!'
    })

@login_manager.unauthorized_handler
def unauthorized():
    if request.is_json:  # Check if the request is an API call
        return jsonify({"error": "Unauthorized access. Please log in."}), 401
    else:
        # Redirect for regular web requests
        return redirect('/error-401')
    

@app.get("/api/checkauth")
def middleware():
    if current_user.is_authenticated:
        return make_response(jsonify({"message":"Authenticated"}), 200)
    else: 
        return make_response(jsonify({"message":"Not authenticated"}) , 401)

#post request to sign up user
@app.route('/api/signup', methods=['POST'])
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
@app.post('/api/signin')
def signIn():
    email = request.form['email']
    password = request.form['password']
    
    try:
        response = users.query(KeyConditionExpression=Key('user_id').eq(email.lower()), FilterExpression=Attr('password').eq(password)
        )
        items = response['Items']
        print(items)
        if (len(items)>0):
            user= User(email=email.lower())
            login_user(user)
            #session['user_id'] = email.lower()
            #print(session)
            
            response = make_response(jsonify({
                "message":f"User successfully found, session created! The current user is {current_user.id}",
            }), 200)
            
            return response
        else:
            return make_response(jsonify({
                "error":"Credentials could not be validated , please try again"
            }), 401) 

            
    except Exception as e:
        return make_response(jsonify({
            "error": f"{str(e)}"
        }) , 500)  

#middleware?

#get request to get a user's confidence metrics
@app.get('/api/getconfidenceall')
@login_required
def getConfidence():
    email =  current_user.id
    print(f"This is the current user{email}")
    if not email :
        return make_response(jsonify({
            "message":"User fetch failed."
        }), 300)
    else:
        # print(f"The current user is {email}")
        # print(email)
        try:
            
            response = users.scan(
                FilterExpression = Attr('user_id').eq(email) & Attr('confidence_value').exists() & Attr('entry_time').exists()
            )
            items = response['Items']         
            sorted_items = sorted(items, key=lambda x: x['entry_time'], reverse=True)[:5]       
            # Iterate over each item and convert any sets to lists
            for item in sorted_items:
                for key, value in item.items():
                    if isinstance(value, set):  # Check if the value is a set
                        item[key] = list(value)  # Convert it to a list
            
            response =  jsonify(sorted_items)
            return response
        except Exception as e:
                return jsonify({
                    "error":str(e) 
                }) , 500

#Sends user comnfidence score to dynamodb database
@app.post('/api/postconfidence')
@login_required
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
                'user_id': current_user.id,#making sure we only work with lowercase version of text
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
    

@app.post("/api/logout")
@login_required
def logoutUser():
    logout_user()
    return jsonify({"message":"User sucessfully logged out."} , 200)
    
# @app.after_request
# def add_cors_headers(response):
#     response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
#     response.headers["Access-Control-Allow-Credentials"] = "true"
#     response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
#     response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
#     return response



#post request to call model processing and return results to the database

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)