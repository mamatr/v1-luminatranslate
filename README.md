# LuminaTranslate

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mamatr/generated-app-20250928-161455)

A minimalist and elegant web application for translating documents to and from Indonesian while preserving formatting.

LuminaTranslate is a visually stunning web application designed for seamless document translation between English and Indonesian. The core focus is on user experience and preserving the original document's formatting. The application features a clean, single-page interface where users can effortlessly upload documents via a drag-and-drop zone. The UI provides clear feedback through various states: idle, uploading, processing, success, and error, all enhanced with subtle micro-interactions and animations.

The backend is a mock API endpoint on a Cloudflare Worker, simulating the translation process to allow for a fully interactive and demoable frontend. This mock backend mimics the behavior of processing a document and returning a link to the translated version, paving the way for future integration with a real translation engine.

## ✨ Key Features

-   **Minimalist Single-Page UI:** A clean, focused interface for a seamless user experience.
-   **Drag-and-Drop File Upload:** Easily upload documents by dragging them onto the dropzone or clicking to browse.
-   **Bidirectional Translation:** Translate documents from English to Indonesian and vice-versa.
-   **Preserves Formatting:** Built with the goal of maintaining the original document's layout and styling.
-   **Rich UI Feedback:** Clear visual states for idle, uploading, processing, success, and error scenarios.
-   **Responsive Design:** Flawless performance and layout across all device sizes.
-   **Light & Dark Mode:** A theme toggle for user preference.

## 🛠️ Technology Stack

-   **Frontend:**
    -   React
    -   Vite
    -   TypeScript
    -   Tailwind CSS
    -   shadcn/ui
    -   Framer Motion
    -   Lucide React
    -   React Dropzone
-   **Backend:**
    -   Cloudflare Workers
    -   Hono

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/luminatranslate.git
    cd luminatranslate
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    The application will be available at `http://localhost:3000`.
    ```bash
    bun run dev
    ```

## 🖥️ Usage

The application is designed to be intuitive and straightforward:

1.  **Upload a Document:** Drag and drop your file (`.docx`, `.txt`, etc.) onto the designated area, or click the area to open a file browser.
2.  **Select Translation Direction:** Use the toggle to choose the source and target languages (e.g., English to Indonesian).
3.  **Start Translation:** Click the "Translate" button. The application will show a processing state.
4.  **Download:** Once complete, a "Download" button will appear. Click it to get your translated file.

## 🏗️ Project Structure

The codebase is organized into three main directories:

-   `src/`: Contains the frontend React application, including pages, components, hooks, and styles.
-   `worker/`: Contains the Cloudflare Worker backend code, built with Hono. This is where API routes and logic reside.
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and backend to ensure type safety.

## ☁️ Deployment

This project is configured for easy deployment to Cloudflare's global network.

1.  **Log in to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Deploy the application:**
    This command will build the frontend, bundle the worker, and deploy everything to Cloudflare.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mamatr/generated-app-20250928-161455)