import { main as runTwinsScript } from "./twins/main";
import { main as runGitHubScript } from "./github/main";

import { config } from "dotenv";
config();

const risyu = await runTwinsScript();
console.log(risyu.splice(0, 3));

await runGitHubScript();
