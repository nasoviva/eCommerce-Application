# eCommerce-Application

This platform replicates real-world shopping experiences in a digital environment.

## 📌 Project Overview

This is an educational project developed as part of the RS School course. It is a Single Page Application (SPA) for an online store, integrated with the CommerceTools platform.

## 🎯 Project Goals

	•	Build a fully functional eCommerce application with features such as:
	•	User registration and authentication
	•	Product browsing, filtering, searching, and sorting
	•	Shopping cart functionality
	•	Viewing user profile and application information
	•	Gain hands-on experience with:
	•	Configuring and working with CommerceTools
	•	Implementing unit testing
	•	Collaborating in a team environment

## 🧪 Technology Stack

	•	Architecture - Single Page Application (SPA)
	•	Programming Language - TypeScript
	•	Setting styles - CSS
	•	Linting - ESLint
	•	Code Formatting - Prettier
	•	CSS linting - Stylelint
	•	Bundler - Webpack
	•	Git Hooks - Husky
	•	Testing - Jest
	•	eCommerce Backend - CommerceTools


## 📜 Scripts


### Testing

Runs unit tests using Jest:

	npm test


### Preparation

Installs Git hooks using Husky:

	npm run prepare


### Start the Project

Formats code using Prettier and launches Webpack Dev Server with development configuration:

	npm start


### Development Mode

Starts Webpack Dev Server without running Prettier beforehand:

	npm run dev


### Build the Project

Executes a multi-step production build:
	1.	Formats code with Prettier
	2.	Fixes TypeScript issues with ESLint
	3.	Fixes style issues with Stylelint
	4.	Checks code formatting
	5.	Bundles the application using Webpack in production mode

	npm run build


### Code Formatting

Formats all project files using Prettier:

	npm run format

Checks whether files are formatted according to Prettier rules without making any changes:

	npm run format:check


### TypeScript Linting

Lints TypeScript files in the src directory using ESLint:

	npm run lint

Lints and automatically fixes TypeScript files where possible:

	npm run lint:fix


### Style Linting

Lints all .css files using Stylelint:

	npm run stylelint

Lints and automatically fixes style issues where possible:

	npm run stylelint:fix


## 🛠 Step-by-step instructions for setting up and running the project locally:

1. Clone the Repository
   ```
	git clone https://github.com/nasoviva/eCommerce-Application.git
	cd eCommerce-Application

2. Install Dependencies

		npm install

3. Start the Development Server

		npm run dev

The project will be available at: http://localhost:8081/#home


## 👥 Team

This project was developed as part of a team effort during the RSSchool:

- [AntonSmelchakov](https://github.com/AntonSmelchakov)
- [Dedal88](https://github.com/Dedal88)
- [nasoviva](https://github.com/nasoviva)
