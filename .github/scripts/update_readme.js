// ==============================================================================
// AI-GENERATED CODE DISCLAIMER
// This code was generated with the assistance of an AI. 
// Please review and test thoroughly before using in a production environment.
// ==============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is missing.");
    process.exit(1);
}

// Initialize Gemini API using the environment variable
const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
    try {
        console.log("Gathering repository context...");
        
        // 1. Read the raw text template from the file system
        const templatePath = path.join(__dirname, "prompt_template.txt");
        const readmePath = path.join(REPO_ROOT, "README.md");

        const template = fs.readFileSync(templatePath, "utf-8");
        
        // 2. Gather dynamic repository data from git
        const tree = execSync("git ls-tree -r HEAD --name-only", { cwd: REPO_ROOT }).toString();
        const gitLog = execSync('git log -5 --pretty=format:"%h - %s"', { cwd: REPO_ROOT }).toString();
        const currentReadme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf-8") : "";

        // 3. Inject dynamic data into the template placeholders
        const prompt = template
            .replace("{{CURRENT_README}}", currentReadme)
            .replace("{{FILE_STRUCTURE}}", tree)
            .replace("{{RECENT_COMMITS}}", gitLog);

        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        console.log(`Sending prompt to Gemini model (${modelName})...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        let newReadme = result.response.text();

        // Safety cleanup in case the model wraps the output in a markdown block
        if (newReadme.startsWith("```markdown")) {
            newReadme = newReadme.replace(/^```markdown\n/, "").replace(/\n```$/, "");
        } else if (newReadme.startsWith("```")) {
            newReadme = newReadme.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        fs.writeFileSync(readmePath, newReadme);
        console.log("Successfully generated and saved new README.md!");

    } catch (error) {
        console.error("Error updating README:", error);
        process.exit(1);
    }
}

main();