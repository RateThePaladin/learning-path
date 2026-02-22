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
        
        // 1. Read the raw text template from the file system
        const template = fs.readFileSync('scripts/prompt_template.txt', 'utf-8');
        
        // 2. Gather the dynamic repository data
        const tree = execSync('git ls-tree -r HEAD --name-only').toString();
        const gitLog = execSync('git log -5 --pretty=format:"%h - %s"').toString();
        const currentReadme = fs.readFileSync('README.md', 'utf-8');

        // 3. Inject the dynamic data into the template placeholders
        const prompt = template
            .replace('{{CURRENT_README}}', currentReadme)
            .replace('{{FILE_STRUCTURE}}', tree)
            .replace('{{RECENT_COMMITS}}', gitLog);

        console.log("Sending prompt to Gemini...");
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