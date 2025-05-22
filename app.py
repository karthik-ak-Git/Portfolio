from flask import Flask, render_template, request, jsonify, url_for
from flask_socketio import SocketIO, emit
import json
import random
import os

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Load portfolio data
with open('portfolio_data.json', 'r') as f:
    portfolio_data = json.load(f)

# Create training data for the chatbot
training_data = {
    'greetings': {
        'patterns': ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
        'responses': [
            'Hello! I\'m Karthik\'s portfolio assistant. How can I help you today?',
            'Hi there! I can tell you about Karthik\'s skills, projects, and experience. What would you like to know?',
            'Hey! I\'m here to help you learn more about Karthik\'s professional background. What interests you?'
        ]
    },
    'experience': {
        'patterns': ['experience', 'work', 'job', 'internship', 'work experience', 'professional experience'],
        'responses': [
            'Karthik has experience as a Java Intern at Besant Technologies in 2023. During this internship, he completed hands-on training in Core Java, developed deployable mini-projects, and mastered object-oriented programming concepts.',
            'His professional experience includes a Java Internship at Besant Technologies where he focused on Core Java development, OOP implementation, and building practical applications.',
            'At Besant Technologies, Karthik worked on real-world Java projects, implemented OOP concepts, and gained practical experience in software development.'
        ]
    },
    'skills': {
        'patterns': ['skills', 'technologies', 'programming', 'languages', 'what can you do', 'expertise'],
        'responses': [
            'Karthik\'s technical skills include:\n• Programming Languages: C/C++ (85%), Core Java (80%), Python (75%)\n• Web Technologies: HTML5 (90%), CSS3 (85%), JavaScript (80%)\n• Tools: Git, GitHub, VS Code\n• Currently expanding knowledge in AI/ML and Cybersecurity',
            'His skill set covers both traditional programming and modern web development. He\'s particularly strong in C/C++ and Java, with growing expertise in web technologies and AI/ML.',
            'Karthik is proficient in multiple programming languages and web technologies, with a strong foundation in C/C++ and Java. He\'s also skilled in version control and modern development tools.'
        ]
    },
    'education': {
        'patterns': ['education', 'degree', 'university', 'college', 'academic', 'qualification'],
        'responses': [
            'Karthik is currently in his 3rd year of B.Tech in Computer Science at TRR College of Technology (2021-2025) with a GPA of 8.5. He completed his SSC at ZPHS Shivarampally with an impressive 8.7 GPA.',
            'His educational background includes:\n• B.Tech in Computer Science (Current GPA: 8.5)\n• Active participation in technical workshops and seminars\n• Member of the college\'s technical club',
            'Karthik is pursuing his B.Tech in Computer Science with excellent academic performance. He actively participates in technical events and is a member of the college\'s technical club.'
        ]
    },
    'projects': {
        'patterns': ['projects', 'portfolio', 'work', 'applications', 'what have you built', 'showcase'],
        'responses': [
            'Karthik has developed several notable projects:\n1. Diploma Learn – An educational study platform used by 50+ diploma students\n2. Movie Recommendation Website with genre-based suggestions\nBoth projects demonstrate his skills in web development and user interface design.',
            'His key projects showcase his practical application of skills:\n• Diploma Learn: A study resource platform helping students access educational materials\n• Movie Recommendation Website: A dynamic web application with genre-based suggestions',
            'Karthik has built impactful projects including Diploma Learn, which helps students access educational resources, and a Movie Recommendation Website that suggests films based on user preferences.'
        ]
    },
    'contact': {
        'patterns': ['contact', 'email', 'phone', 'reach', 'get in touch', 'connect'],
        'responses': [
            'You can reach Karthik through:\n• Email: karthik@example.com\n• Phone: +91 XXXXXXXXXX\n• LinkedIn: linkedin.com/in/karthik',
            'To connect with Karthik:\n• Email: karthik@example.com\n• Phone: +91 XXXXXXXXXX\n• LinkedIn: linkedin.com/in/karthik',
            'Feel free to contact Karthik via email at karthik@example.com or connect with him on LinkedIn.'
        ]
    }
}

def get_response(user_input):
    user_input = user_input.lower()
    
    # Find the best matching category
    best_match = None
    max_matches = 0
    
    for category, data in training_data.items():
        matches = sum(1 for pattern in data['patterns'] if pattern in user_input)
        if matches > max_matches:
            max_matches = matches
            best_match = category
    
    # If no match found, return a default response
    if best_match is None:
        return "I'm not sure about that. You can ask me about Karthik's skills, experience, education, projects, or contact information."
    
    # Return a random response from the best matching category
    return random.choice(training_data[best_match]['responses'])

@app.route('/')
def index():
    try:
        return render_template('protfolio.html')
    except Exception as e:
        print(f"Error rendering template: {str(e)}")
        print(f"Current working directory: {os.getcwd()}")
        print(f"Templates directory contents: {os.listdir('templates')}")
        return f"Error loading template: {str(e)}", 500

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('chat message')
def handle_message(message):
    print(f'Received message: {message}')
    response = get_response(message)
    print(f'Sending response: {response}')
    emit('chat response', response)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
