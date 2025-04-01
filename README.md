# React (Jay class) 

# My Todos App

A simple React-based todo list application that for users to track and manage their tasks.

## Description

My Todos App is a React app that demonstrates these React concepts (as of week 3 assignment) including:
- Component architecture
- Props and state management
- Form handling
- Component reusability

## Features

- Display a list of todo items
- Form to add new todo items
- Component-based architecture

## Installation

To set up this project locally:

1. Clone the repository:
   ```bash
   git clone the repository from https://github.com/hlimbachiya1/ctd_jay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. If steps 1 and 2 did not work, then you have to install nodejs from the website https://nodejs.org/en 
4. and once step 3 is done. redo the setps 1 and 2 skipping 3 and 4 this time. and continue along with next steps.

## Running the Development Server

Start the development server with:
```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

## Git Workflow

This project follows a feature branch workflow:

### Starting a New Feature/Assignment

1. Ensure your main branch is up to date:
   ```bash
   git checkout main
   git pull
   ```

2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
   Use a descriptive name like `week-0x -description` for assignment work.

3. Make your changes and test them locally with `npm run dev`

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Descriptive message about your changes"
   ```

5. Push your branch to GitHub:
   ```bash
   git push -u origin feature-name
   ```

6. Create a pull request on GitHub to merge your changes into main

### Common Issues and Solutions

- **Missing Component Errors**: Ensure component names match their import statements
- **Circular Dependencies**: Don't import components into themselves
- **React Component Hierarchy**: Use components (not direct HTML) to maintain proper hierarchy
- **Import Path Errors**: Use relative paths (`./ComponentName`) for local imports

## Project Structure

```
/src
  ├── App.jsx            # Main application component
  ├── App.css            # Application styles
  ├── TodoForm.jsx       # Form for adding new todos
  ├── TodoList.jsx       # Container for todo items
  ├── TodoListItem.jsx   # Component for individual todo items
  ├── main.jsx           # Entry point
  └── index.css          # Global styles
```

## Technology Stack

- React (UI library)
- Vite (Build tool)
- ESLint (Code quality)

## Template instruction and defaults

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.