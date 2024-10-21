from flask import Flask , jsonify , request ,  redirect, url_for, render_template, session , make_response
import boto3
import uuid
import botocore
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
from flask_cors import CORS
from datetime import datetime
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import secrets
from Blueprints.TextAnalysis.transcript import transcript_bp
from Blueprints.TextAnalysis.speech import speech_bp

#creates the app and then enables the CORS for all domains
app = Flask(__name__)
#CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}}, allow_headers=["Content-Type", "Authorization"])
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

app.config['SESSION_TYPE'] = 'filesystem'  # or other storage types
app.config.update(
    SESSION_COOKIE_SAMESITE="None",  # Use "Lax" if you're testing within the same site
    SESSION_COOKIE_SECURE=False      # Use True only if using HTTPS
)

app.secret_key = secrets.token_hex(16)

#Loads in the routes in the blueprint
app.register_blueprint(transcript_bp, url_prefix = "/transcript")
#Loads in the speechrecognition endpoints defined in the blueprint
app.register_blueprint(speech_bp, url_prefix = "/speech")

#getting the dynamodb service resource
session = boto3.Session(profile_name='default')
dynamodb = session.resource('dynamodb', region_name='us-east-1')
users = dynamodb.Table('Users')

login_manager = LoginManager()
login_manager.init_app(app)


#user class is used to create a user whose ID is necessary for maintaining session data
class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id
    def __repr__(self):
        return f'User({self.id})'

#loader function that loads a user , but not from dynmamo , simply from the server
@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

@app.route('/test_current_user')
@login_required
def test_current_user():
    return jsonify({
        "authenticated": current_user.is_authenticated,
        "anon": current_user.is_anonymous,
        "user_id": current_user.get_id(),
    
    })

    

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
            user = User(email.lower())
            ##print(user)
            login_user(user)
            ##current user methods and properties
            print(f"The current user is {current_user.id}")
            print(f"Is authenticated {current_user.is_authenticated}")
            print(f"Is active {current_user.is_active}")
            print(f"Is anonymous {current_user.is_anonymous}")
            print(f"Get I {current_user.get_id()}")
            
            return make_response(jsonify({
                "message":f"User successfully found, session created! The current user is {current_user.id}",
                
            }), 200)
        else:
            return make_response(jsonify({
                "error":"Credentials could not be validated , please try again"
            }), 450) 

            
    except Exception as e:
        return make_response(jsonify({
            "error": str(e)
        }) , 500)  

#middleware?

#get request to get a user's confidence metrics
@app.get('/getconfidenceall')
def getConfidence():
    email =  current_user.get_id()
    print(f"The current user is {email}")
    print(email)
    try:
        
        response = users.scan(
            FilterExpression = Attr('user_id').eq(email) & Attr('confidence_value').exists()
        )
        items = response['Items']
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
@login_required
def postconfidence():
    data = request.get_json()
    confidence_value = data.get('confidence_value')
    interview_topic = data.get('interview_topic')
    interview_transcript = data.get('interview_transcript')
    interview_feedback = data.get('interview_feedback')
    user_id = current_user.id ## still need to figure out getting current user email
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