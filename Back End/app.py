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

#creates the app and then enables the CORS for all domains
app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'  # or other storage types
app.secret_key = secrets.token_hex(16)
CORS(app)


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
    return User.get(user_id)
    

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
            return make_response(jsonify({
                "message":"User successfully found, session created!"
            }), 200)
        else:
            return make_response(jsonify({
                "error":"Credentials could not be validated , please try again"
            }), 450) 

            
    except Exception as e:
        return make_response(jsonify({
            "error": str(e)
        } , 500) , 500) 

#middlware?

#get request to get a user's confidence metrics
@app.get('/getconfidence')
#@login_required
def getConfidence():
    try:
        #email = str(current_user.get_id())
        email =  'darrenjames@gmail.com'
        #print(email)
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


#post request to call model processing and return results to the database

if __name__ == '__main__':
    app.run(debug=True)