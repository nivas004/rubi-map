# RUBI Map Project

## Overview
The RUBI Map project is an interactive policy map designed to visualize and explore the concepts of Retroactive Universal Basic Income (RUBI) and its associated use cases. The application is built using React and TypeScript, providing a responsive experience for both desktop and mobile users.

## Features
- **Responsive Design**: The application adapts to different screen sizes, providing an optimized experience for both desktop and mobile users.
- **Interactive Map**: Users can hover or tap on nodes to explore various use cases and their descriptions.
- **Type Safety**: The project utilizes TypeScript for type safety, ensuring robust and maintainable code.

## Project Structure
```
rubi-map
├── app
│   ├── components
│   │   ├── MapDesktop.tsx      # Component for desktop view
│   │   ├── MapMobile.tsx       # Component for mobile view
│   │   └── index.ts             # Exports for components
│   ├── page.tsx                 # Main landing page
│   └── types
│       └── index.ts             # Type definitions
├── package.json                  # npm configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd rubi-map
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm start
```
This will launch the application in your default web browser.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.