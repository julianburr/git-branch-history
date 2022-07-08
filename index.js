#!/usr/bin/env node

const p = require("child_process");
const chalk = require("chalk");
const inquirer = require("inquirer");

const argv = require("yargs/yargs")(process.argv.slice(2))
  .usage("Usage: $0 [options]")
  .option("c", {
    alias: "count",
    default: 10,
    description: "Number of recent branches you want to print out",
  })
  .help("help").argv;

const cmd = `git for-each-ref --count=${argv.count} --sort=-committerdate refs/heads/ --format='%(refname:short)'`;
const str = p.execSync(cmd).toString();

const options = str
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const prompt = inquirer.createPromptModule();
prompt([
  {
    type: "list",
    name: "branch",
    message: "Which branch do you want to check out?",
    choices: options,
    loop: false,
    pageSize: 30,
  },
])
  .then(({ branch }) => {
    p.execSync(`git checkout ${branch}`);
    console.log(
      `${chalk.bold.green("✔")} Successfully checked out ${chalk.bold(branch)}`
    );
  })
  .catch((e) => {
    console.log(
      chalk.red(`${chalk.bold("✖︎")} Checkout failed\n\n${e.message}`)
    );
  });
