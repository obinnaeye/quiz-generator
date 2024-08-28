# Quiz Generator App

## Overview

The Quiz Generator App is a web application built using Next.js with the App Router, TypeScript, and Tailwind CSS. This application allows users to create quizzes by entering questions and answers, take the quiz, and view their score. The app features a responsive design and dynamic interactions enabled by Next.js's new features.

## Features

- **Homepage:** Create and manage quiz questions and answers.
- **Quiz Page:** Take the quiz and view the score.
- **Responsive Design:** Styled using Tailwind CSS for a modern and adaptive layout.

## Getting Started

### Prerequisites

- **Node.js** (>= 18.x)
- **pnpm** (Install globally with `npm install -g pnpm`)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the Development Server:**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`.

## File Structure

- **`src/app/page.tsx`**: Homepage component where users can input quiz questions and answers.
- **`src/app/quiz/page.tsx`**: Quiz page component where users can take the quiz and view their score.
- **`styles/globals.css`**: Global styles including Tailwind CSS configuration.

## Project Setup

1. **Next.js App Router**: Utilizes Next.js's App Router feature for page management.
2. **Tailwind CSS**: Configured for styling with a custom `tailwind.config.js`.

### Client Components

- Added `'use client';` directive to components using client-side features like `useState` and `useRouter` (from `next/navigation`).

## How to Test

1. **Install Dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the Development Server:**

   ```bash
   pnpm dev
   ```

3. **Access the Application:**

   - Navigate to `http://localhost:3000` to view the homepage.
   - Add quiz questions and submit to navigate to the quiz page.

4. **Verify Functionality:**

   - Confirm the ability to add multiple questions on the homepage.
   - Check that the quiz page displays the questions correctly and calculates the score.

## Additional Information

- **Dependencies Added:** Next.js, Tailwind CSS, TypeScript.
- **Potential Improvements:** Future enhancements may include adding unit tests, improving error handling, and refining UX/UI based on user feedback.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, discuss with the maintainers by opening an issue.

