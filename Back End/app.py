from flask import Flask , jsonify , request ,  redirect, url_for, render_template , make_response , session , flash , redirect
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


#Will act as the session that holds the current user information until 
#a better method is found
customSession = {
    'name': " " ,
    'email': " " ,
    'user_id': " " ,
    'occupation': " ",
    'item_id': " "
}
'''
Values:   
customSession['name'] =
customSession['email'] =
customSession['user_id'] =
customSession['occupation'] =
customSession['item_id'] =

    '''

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

#Can appearently use to store all of the credentials needed from the user to use
#in querying statements
class User(UserMixin):
    def __init__(self, email , name=None , occupation=None):
        self.id = email
        self.name = name
        self.occupation =occupation

@login_manager.user_loader
def load_user(user_id):
    # Fetch user data from the database based on user_id
    response = users.query(KeyConditionExpression=Key('user_id').eq(user_id))
    items = response.get('Items', [])

    if not items:
        return None
   
    user_data = items[0]
    return User(
        email=user_id,
        name=user_data.get('name'),
        occupation=user_data.get('occupation')
    )
    

#Loads in the routes in the blueprint
app.register_blueprint(transcript_bp, url_prefix = "/transcript")
#Loads in the speechrecognition endpoints defined in the blueprint
app.register_blueprint(speech_bp, url_prefix = "/speech")

#getting the dynamodb service resource
#This creates a new AWS session using a profile named 'default'
aws_session = boto3.Session(profile_name='default')
#This initializes a DynamoDB service resource in the region us-east-1.
dynamodb = aws_session.resource('dynamodb', region_name='us-east-1')
#This retrieves a reference to the "Users" table in DynamoDB.
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
        #Add the values to the custom session object when the user signs up
        customSession['name'] = name
        customSession['email'] = email.lower()
        customSession['user_id'] = email.lower() #The user_id is the email
        customSession['occupation'] = occupation
        customSession['item_id'] = itemId
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

        #Attempt to add the logged in user data to the custom session object
        user_data = items[0]  # Get the first user (assuming unique user_id)
        # customSession['name'] = user_data.get('name', 'No Name Found')  # Extract 'name'
        # customSession['occupation'] = user_data.get('occupation', 'No Occupation Found')  # Extract 'occupation'
        # customSession['item_id'] = user_data.get('item_id', 'No Item ID Found')
        # customSession['user_id'] = user_data.get('user_id', 'No User ID Found')
        name = user_data.get('name', 'No Name Found')  # Extract 'name'
        occupation = user_data.get('occupation', 'No Occupation Found')  # Extract 'occupation'
        #There is no email column in the database
        #customSession['email'] = user_data.get('email', 'No email Found')
        print(items)
        print(customSession)
        if (len(items)>0):
            user= User(email=email.lower() , name=name , occupation=occupation)
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
    #Logs the user out/clears the customSession object
    customSession = {
    'name': " " ,
    'email': " " ,
    'user_id': " " ,
    'occupation': " ",
    'item_id': " "
    }
    return jsonify({"message":"User sucessfully logged out."} , 200)


#Gets all of the user info by the name value in the customSession object
@app.get("/api/testgetbyname")
def getbyname():
    try:
        my_response = users.scan(
            FilterExpression=Attr('name').eq(customSession['name'])  # Searches for name "Steffan"
        )

        items = my_response.get('Items', [])
        if items:
            return jsonify(items), 200
        else:
            return jsonify({"error": "No user found with this name"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
'''
The @app.get("/api/testgetbyname") returns:
 {
        "item_id": "04ddecb9-8528-42e2-8998-bfc469cb6e9c",
        "name": "Steffan",
        "occupation": "student",
        "password": "Burnette",
        "user_id": "burnette"
    }
'''

#Call to update the users occupation, only need to input:
#"new_occupation":"the new value"
@app.route("/api/updateuser", methods = ['POST'])
def update_user():
    try:
        data = request.get_json()  # Get JSON data from request

        new_occupation = data.get('new_occupation')
        # Correct Key structure
        users.update_item(
            Key={'user_id': customSession['user_id'], 'item_id': customSession['item_id']},
            UpdateExpression="SET occupation = :occ",
            ExpressionAttributeValues={':occ': new_occupation}
        )

        return jsonify({"message": "User occupation updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.post('/api/putInterviewData')
@login_required
def put_interview_data():
    """
    Endpoint to store interview data into the DynamoDB table.
    Expected JSON input:
    {
      "interview_topic": "The topic of the interview",
      "interview_transcript": "The full transcript of the interview",
      "interview_feedback": "Feedback provided by the assessment model",
      "confidence_value": 3    // Optional: Confidence rating (1-5)
    }
    """
    data = request.get_json()

    # Extract data from the request
    interview_topic = data.get('interview_topic')
    interview_transcript = data.get('interview_transcript')
    interview_feedback = data.get('interview_feedback')
    confidence_value = data.get('confidence_value')  # This could be None if not provided

    # Validate required fields
    if not all([interview_topic, interview_transcript, interview_feedback]):
        return jsonify({"error": "Missing one or more required fields"}), 400

    entry_time = datetime.now().isoformat()
    item_id = str(uuid.uuid4())  # Generate a unique UUID for the item_id

    try:
        # Put the item into the DynamoDB table 'Users'
        users.put_item(
            Item={
                'user_id': current_user.id,  # Use the logged-in user's id (typically email)
                'item_id': item_id,
                'interview_topic': interview_topic,
                'interview_transcript': interview_transcript,
                'interview_feedback': interview_feedback,
                'confidence_value': confidence_value,
                'entry_time': entry_time,
            }
        )
        return jsonify({"message": "Interview data was successfully uploaded"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
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

#user_id - The partition key
#item_id - The sort key

'''
Columns in the db:
- user_id (string)
- item_id (string)
- confidence_value (int)
- entry_time
- interview_feedback (string)
- interview_topic (string)
- interview_transcript (string)
- name (string)
- occupation (string)
- password (string)
'''