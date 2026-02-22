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
        Below is the current main README.md, the current file structure of the repo, and the 5 most recent commits.
        
        Task: Update the main README.md to act strictly as a high-level index and overview of the repository.
        
        Rules:
        1. Keep the original introduction ("Forever a student...") completely intact.
        2. "Repository Structure" Section: Map out the major folders (e.g., doppler, ssh, databricks). For each folder, write a brief 1-2 sentence summary of its purpose and provide a relative markdown link to the folder.
        3. "Recent Updates" Section: Summarize the recent commit log into a clean, bulleted list.
        4. CRITICAL CONSTRAINT: DO NOT copy, paste, or summarize the full contents of tutorials, scripts, or sub-READMEs into this main file. This file must remain a brief table of contents.
        
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