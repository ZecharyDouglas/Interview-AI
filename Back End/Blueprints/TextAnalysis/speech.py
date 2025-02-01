from flask import Blueprint, jsonify, request
import speech_recognition as sr
import pyttsx3 #Python text to speech Libary

# Initialize the Flask Blueprint
speech_bp = Blueprint('speech', __name__)

# Initialize the recognizer
r = sr.Recognizer()

# File to store recognized text
file_name = "digitalCircuitsOne.txt"

# Define the route for speech recognition
@speech_bp.route('/recognize', methods=['GET'])
def recognize_speech():
    # Use the default system microphone as the audio source
    with sr.Microphone() as source:
        print("Please say something:")
        # Adjust for ambient noise and record the audio
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)

    try:
        # Recognize speech using Google Web Speech API
        text = r.recognize_google(audio, language="en")
        print("You said:", text)

        # Append recognized text to the file
        with open(file_name, "a") as file:
            file.write(text + "\n")

        # Return the recognized text as a response
        return jsonify({"recognized_text": text}), 200

    except sr.UnknownValueError:
        return jsonify({"error": "Google Speech Recognition could not understand the audio."}), 400

    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results from Google Speech Recognition service; {e}"}), 500


def text_to_speech(text):
    #Need to fix, need to take in the data from the json request
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

#Define route for text to speech
# Define route for text-to-speech
@speech_bp.route('/api/texttospeech', methods=['POST'])
def utilize_text_to_speech():
    try:
        # Get the text from the JSON request
        data = request.get_json()

        # Validate JSON input
        if 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request"}), 400
        
        text = data['text']

        # Convert text to speech
        text_to_speech(text)

        return jsonify({"message": "Text-to-speech conversion successful"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500