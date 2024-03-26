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


### Inspiration

The inspiration for this project is to empower developers and teams to improve the quality of their codebases by identifying security, performance, and maintainability issues in their GitHub repositories. We wanted to create a tool that makes it easy to get valuable insights and recommendations to enhance code quality.

### What it does

Angel is an AI-powered code analysis platform that identifies security vulnerabilities, performance bottlenecks, and maintainability issues in GitHub repositories. It allows users to simply enter a GitHub repo URL, and leverages the powerful Claude AI to perform in-depth static analysis on all the code files. Angel then generates a comprehensive, well-organized report highlighting the identified issues, their severity levels, and provides recommendations for remediation.

### How we built it

We built Angel by integrating the Claude AI API to intelligently analyze code files and provide detailed insights into potential issues. The frontend is a sleek Next.js application that allows users to input GitHub repo URLs and view the generated analysis reports. The backend is powered by a Python FastAPI server that handles the repository processing, file content extraction using the GitHub API, and orchestrates the interaction with the Claude API for code analysis. We designed a multi-threaded architecture to efficiently process files concurrently for optimal performance.

### Challenges we ran into

During the development of Angel, we encountered several challenges. Designing an intuitive and visually appealing user interface required careful consideration of UX principles. Efficiently integrating the frontend with the backend API endpoints took some trial and error. Learning the intricacies of the Claude API and fine-tuning our prompts for accurate code analysis was an iterative process. Extracting file contents from GitHub repositories while handling authentication and rate limits presented its own set of hurdles. However, we tackled each challenge head-on and found innovative solutions to overcome them.

### Accomplishments that we're proud of

We are proud of several accomplishments in building Angel. Firstly, we successfully integrated with the Claude AI API to enable intelligent code analysis, leveraging its powerful language understanding capabilities. Secondly, we designed and implemented a robust and efficient analysis engine that can process large codebases quickly by utilizing multi-threading. Thirdly, we created an intuitive and visually appealing frontend interface that makes it easy for users to input repos and navigate the analysis reports. Lastly, we delivered a comprehensive and valuable tool that can genuinely help developers improve their code quality.

### What we learned

Throughout the development of Angel, we gained valuable knowledge and skills. We learned advanced code analysis techniques and how to effectively leverage AI for identifying issues in codebases. We deepened our understanding of API integration, particularly with the Claude API and GitHub API. We honed our skills in frontend development using Next.js and backend development using FastAPI. Collaborating as a team, we learned the importance of clear communication, task delegation, and agile development practices. Overall, this project has been an incredible learning experience for all of us.

### What's next for Angel

Looking ahead, we have exciting plans for the future of Angel. We aim to further refine the frontend user experience based on user feedback and add more interactive features. We plan to enhance the analysis engine to cover an even wider range of issues, including code complexity, test coverage, and potential optimizations. Integrating with additional AI models and expanding support for more programming languages are also on our roadmap. Ultimately, our vision is to make Angel the go-to tool for developers seeking to comprehensively improve the quality of their codebases.

### Built With

Next.js
FastAPI
Python
TypeScript
Prisma
MySQL
Anthropic Claude AI
GitHub API
Tailwind CSS

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
