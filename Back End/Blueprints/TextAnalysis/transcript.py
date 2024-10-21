from flask import Flask, Blueprint, request, jsonify
import os
from dotenv import load_dotenv
from langchain import OpenAI, PromptTemplate
from langchain.chains import LLMChain

# Load environment variables from .env file
load_dotenv()
# Set up the OpenAI model with your API key
openai_api_key = os.getenv("OPENAI_API_KEY")
#Creates the model object
llm = OpenAI(temperature=0.7, openai_api_key=openai_api_key)

# Create a prompt template
template = """You are a helpful AI assistant with the main task of assessing the end users performance during said mock interview. The end user will have participated in a mock interview and you will be given the transcript. When looking at the transcript be sure to look for:
- Confidence in response. You want to make sure that the end user is coming off as confident in their responses.
- Redundancy. You want to make sure that the end user is not repeating themselves or explaining the same thing over and over again unless prompted to elaborate or asked to repeat.
- Growth. Look for areas of improvement. Look for any other potential weakness that the end user might have exhibited in the interview , highlight them in the response and give the end user tips on ways in which it can improve its responses.
Overall, for your response to the end user I want you to provide them with constructive feedback that can be used to help improve their performance on future interviews. Here is the transcribed interview: {question}"""
#Allows the template to take a variable as input
prompt = PromptTemplate(
    input_variables=["question"],
    template=template,
)
# Create a chain that takes the prompt and LLM
chain = LLMChain(prompt=prompt, llm=llm)






#Create the blueprint object that will have its routes be loaded into the app.py
transcript_bp = Blueprint("transcript", __name__)

#Here are the routes/endpoints in the transcript_bp Blueprint

#This route will return advice for the end user based on the interview
@transcript_bp.route("/advice", methods=['POST'])  # Allow POST method
def advice_response():
    try:
        # Extract 'user_prompt' from the JSON body
        data = request.get_json()  # Get JSON data from the request
        user_prompt = data.get('user_prompt')  # Extract 'user_prompt' key
        
        if not user_prompt:
            return jsonify({"error": "No user_prompt provided"}), 400
        
        # Pass the user_prompt to your chain function
        final_response = chain.run(user_prompt)
        
        # Return the final response
        return jsonify({"response": final_response}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Create a prompt template
confidence_template = """You are a helpful AI assistant with the main task of assessing the end users performance during said mock interview.
The end user will have participated in a mock interview and you will be given the transcript. I want you to return ONLY a rating (from 1 -5) with 1 being a poor performance and 5 being an outstanding performance.
Your output should look like: 1 for instance. Here is the transcript: {question}"""
confidence_prompt = PromptTemplate(
    input_variables=["question"],
    template=confidence_template,
)
# Create a chain that takes the prompt and LLM
confidence_chain = LLMChain(prompt=confidence_prompt, llm=llm)


@transcript_bp.route("/confidenceScore", methods=['POST'])  # Allow POST method
def confidence_response():
    try:
        # Extract 'user_prompt' from the JSON body
        data = request.get_json()  # Get JSON data from the request
        user_prompt = data.get('user_prompt')  # Extract 'user_prompt' key
        
        if not user_prompt:
            return jsonify({"error": "No user_prompt provided"}), 400
        
        # Pass the user_prompt to your chain function
        final_confidence_score = confidence_chain.run(user_prompt)
        
        # Return the final response
        return jsonify({"response": final_confidence_score}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500