# Angel
AI-Powered Code Analysis Platform Angel is an AI-powered code analysis platform that identifies security vulnerabilities, performance bottlenecks, and maintainability issues in GitHub repositories. It leverages the powerful 
Claude AI to perform in-depth static analysis on code files and generates comprehensive reports with actionable insights. 

## Features 
Analyze GitHub repositories for security, performance, and maintainability issues - Generate detailed reports with issue descriptions and severity levels - Intuitive and user-friendly web interface - Fast and efficient 
analysis using multi-threaded processing - Integration with Claude AI for intelligent code analysis 

## Getting Started 
![demo_2-ezgif com-video-to-gif-converter](https://github.com/ptempelman/Angel/assets/93888864/aa06a92a-5462-49d6-8251-a7f6cbd72e03)
![Image 3-24-24 at 2 59 PM](https://github.com/ptempelman/Angel/assets/93888864/6ba884ae-8d94-4849-bb59-e7983928d6dc)
![Screenshot 2024-03-24 at 2 57 32 PM](https://github.com/ptempelman/Angel/assets/93888864/721dfa8f-37bf-4699-a5af-e1e8834be35d)
![Screenshot 2024-03-24 at 2 57 49 PM](https://github.com/ptempelman/Angel/assets/93888864/b60fc2c7-e3e1-4a3f-aa10-14bec8dd8de9)




### Prerequisites
 Node.js (version 14 or above) - Python (version 3.7 or above) - MySQL database 
 
 ### Installation 
   1. Clone the repository: git clone [https://github.com/yourusername/angel.git](https://github.com/ptempelman/Angel.git) cd angel
   2. Install frontend dependencies: cd angel npm install
   3. Set up the database: - Create a MySQL database named `angel` - Update the database connection URL in `angel/.env` file
   4. Run database migrations: npx prisma migrate dev
   5. Install backend dependencies: cd ../angelapi python -m venv venv source venv/bin/activate # For Windows: venv\Scripts\activate pip install -r requirements.txt
   6. Set up environment variables: - Create a `.env` file in the `angelapi` directory - Add the following variables: ANTHROPIC_API_KEY=your_anthropic_api_key

### Running the Application 
   1. Start the frontend development server: cd angel npm run dev
   2. Start the backend server: cd angelapi uvicorn main:app --reload
   3. Open your browser and navigate to `http://localhost:3000` to access the Angel web interface.

## Usage 
   1. Sign in to Angel using your credentials.
   2. Enter a GitHub repository URL in the provided input field.
   3. Select the desired analysis type (security, performance, or maintainability).
   4. Click on the "Generate Analysis" button to start the code analysis process.
   5. Once the analysis is complete, you will be redirected to the report page.
   6. Explore the generated report, which highlights the identified issues, their severity levels, and provides recommendations for improvement.


## Contributing Contributions are welcome! If you'd like to contribute to Angel, please follow these steps: 
   1. Fork the repository
   2. Create a new branch (`git checkout -b feature/your-feature`)
   3. Commit your changes (`git commit -m 'Add some feature'`)
   4. Push to the branch (`git push origin feature/your-feature`)
   5. Open a pull request ## License This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
