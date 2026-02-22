// ==============================================================================
// AI-GENERATED CODE DISCLAIMER
// This code was generated with the assistance of an AI. 
// Please review and test thoroughly before using in a production environment.
// ==============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { execSync } from "child_process";

// Initialize Gemini API using the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    try {
        console.log("Gathering repository context...");
        
        // Get the file structure (ignoring node_modules and hidden files)
        const tree = execSync('git ls-tree -r HEAD --name-only').toString();
        // Get the 5 most recent commit messages
        const gitLog = execSync('git log -5 --pretty=format:"%h - %s"').toString();
        // Read the current README
        const currentReadme = fs.readFileSync('README.md', 'utf-8');

        const prompt = `You are an expert technical writer and repository maintainer. 
        Below is the current README.md, the current file structure of the repo, and the 5 most recent commits.
        
        Task: Update the README.md to accurately reflect the repository's current state.
        1. Keep the core documentation (like the Doppler SSH wrapper tutorial) entirely intact.
        2. Add or update a "Repository Structure" section to reflect the provided file tree.
        3. Add or update a "Recent Updates" section based on the recent commit messages.
        
        Output ONLY the raw markdown content for the new README.md. Do not wrap your response in markdown formatting blocks (\`\`\`markdown) as this will be piped directly into the file.
        
        --- CURRENT README ---
        ${currentReadme}
        
        --- FILE STRUCTURE ---
        ${tree}
        
        --- RECENT COMMITS ---
        ${gitLog}`;

        console.log("Sending prompt to Gemini...");
        // gemini-2.5-flash is perfect for fast, high-context text processing tasks
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        let newReadme = result.response.text();

        // Safety cleanup in case the model wraps the output in a markdown block
        if (newReadme.startsWith("```markdown")) {
            newReadme = newReadme.replace(/^```markdown\n/, "").replace(/\n```$/, "");
        } else if (newReadme.startsWith("```")) {
            newReadme = newReadme.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        fs.writeFileSync('README.md', newReadme);
        console.log("Successfully generated and saved new README.md!");

    } catch (error) {
        console.error("Error updating README:", error);
        process.exit(1);
    }
}

main();