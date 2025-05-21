const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Chatbot responses database
const chatbotResponses = {
    greetings: {
        patterns: ['hello', 'hi', 'hey', 'greetings'],
        responses: [
            'Hello! I\'m Karthik\'s portfolio assistant. How can I help you today?',
            'Hi there! I can tell you about Karthik\'s skills, projects, and experience. What would you like to know?',
            'Hey! I\'m here to help you learn more about Karthik\'s professional background. What interests you?'
        ]
    },
    experience: {
        patterns: ['experience', 'work', 'job', 'internship'],
        responses: [
            'Karthik has experience as a Java Intern at Besant Technologies in 2023. During this internship, he completed hands-on training in Core Java, developed deployable mini-projects, and mastered object-oriented programming concepts.',
            'His professional experience includes a Java Internship at Besant Technologies where he focused on Core Java development, OOP implementation, and building practical applications. This experience helped him strengthen his programming fundamentals.'
        ]
    },
    skills: {
        patterns: ['skills', 'technologies', 'programming', 'languages'],
        responses: [
            'Karthik\'s technical skills include:\n• Programming Languages: C/C++, Core Java, Python\n• Web Technologies: HTML5, CSS3, JavaScript\n• Tools: Git, GitHub, VS Code\n• Currently expanding knowledge in AI/ML and Cybersecurity\nHe has strong proficiency in C/C++ (85%), Java (80%), and web technologies (90%).',
            'His skill set covers both traditional programming and modern web development. He\'s particularly strong in C/C++ and Java, with growing expertise in web technologies and AI/ML. Would you like to know more about any specific skill?'
        ]
    },
    education: {
        patterns: ['education', 'degree', 'university', 'college'],
        responses: [
            'Karthik is currently in his 3rd year of B.Tech in Computer Science at TRR College of Technology (2021-2025). He completed his SSC at ZPHS Shivarampally with an impressive 8.7 GPA. His academic journey includes:\n• B.Tech in Computer Science (Current GPA: 8.5)\n• Active participation in technical workshops and seminars\n• Member of the college\'s technical club\n• Regular participant in coding competitions',
            'His educational background shows strong academic performance and active involvement in technical activities. He\'s pursuing B.Tech in Computer Science with a focus on practical learning and skill development.'
        ]
    },
    projects: {
        patterns: ['projects', 'portfolio', 'work', 'applications'],
        responses: [
            'Karthik has developed several notable projects:\n1. Diploma Learn – An educational study platform used by 50+ diploma students, increasing material accessibility by 30%\n2. Movie Recommendation Website with genre-based suggestions and dynamic content\nBoth projects demonstrate his skills in web development and user interface design. Would you like to know more about any specific project?',
            'His key projects showcase his practical application of skills:\n• Diploma Learn: A study resource platform helping students access educational materials\n• Movie Recommendation Website: A dynamic web application with genre-based suggestions\nThese projects highlight his ability to create user-friendly, functional applications.'
        ]
    },
    contact: {
        patterns: ['contact', 'email', 'phone', 'reach', 'connect'],
        responses: [
            'You can connect with Karthik through:\n• GitHub: github.com/karthik-ak-Git\n• LinkedIn: linkedin.com/in/yourprofile\n• Portfolio Website: ak47.infinityfreeapp.com\nFeel free to reach out for professional inquiries or collaboration opportunities!',
            'For professional inquiries, you can reach Karthik through his GitHub or LinkedIn profiles. He\'s always open to discussing new opportunities and collaborations.'
        ]
    },
    achievements: {
        patterns: ['achievements', 'accomplishments', 'awards', 'recognition'],
        responses: [
            'Karthik\'s key achievements include:\n• Secured distinction in Mathematics and Science during SSC\n• Active participant in science exhibitions and technical workshops\n• Member of college\'s technical club\n• Regular participant in coding competitions\n• Developed projects that have helped 50+ students',
            'His notable accomplishments include academic excellence (8.7 GPA in SSC), active participation in technical events, and successful project implementations that have made a positive impact on student learning.'
        ]
    },
    interests: {
        patterns: ['interests', 'hobbies', 'passions', 'what do you like'],
        responses: [
            'Karthik is passionate about:\n• Web Development\n• Artificial Intelligence & Machine Learning\n• Cybersecurity\n• Problem-solving and algorithm development\nHe continuously works on expanding his knowledge in these areas through projects and self-learning.',
            'His main interests lie in technology and innovation, particularly in web development and AI/ML. He\'s constantly learning and exploring new technologies to enhance his skills.'
        ]
    },
    default: {
        responses: [
            'I can tell you about Karthik\'s experience, skills, education, projects, achievements, or how to contact him. What would you like to know?',
            'I\'m here to help you learn more about Karthik\'s professional background. You can ask me about his experience, skills, education, projects, or achievements.'
        ]
    }
};

// Function to get chatbot response
function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const category in chatbotResponses) {
        if (category === 'default') continue;
        
        const patterns = chatbotResponses[category].patterns;
        if (patterns.some(pattern => lowerMessage.includes(pattern))) {
            const responses = chatbotResponses[category].responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    return chatbotResponses.default.responses[Math.floor(Math.random() * chatbotResponses.default.responses.length)];
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat message', (message) => {
        console.log('Received message:', message);
        const response = getChatbotResponse(message);
        
        // Simulate typing delay
        setTimeout(() => {
            socket.emit('chat response', response);
        }, 1000);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 