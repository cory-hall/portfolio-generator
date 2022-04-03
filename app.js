const inquirer = require('inquirer');
const generatePage = require('./src/page-template');
const { writeFile, copyFile} = require('./utils/generate-site');



const promptUser = () => {
   return inquirer.prompt([
      {
         type: 'input',
         name: 'name',
         message: 'What is your name? (Required)',
         validate: nameInput => {
            if (nameInput) {
               return true;
            } else {
               console.log('Please enter your name!');
               return false;
            }
         }
      },
      {
         type: 'input',
         name: 'github',
         message: 'Enter your GitHub Username (Required)',
         validate: usernameInput => {
            if (usernameInput) {
               return true;
            } else {
               console.log('Please enter your GitHub Username!');
               return false;
            }
         }
      },
      {
         type: 'confirm',
         name: 'confirmAbout',
         message: 'Would you like to enter some information about yourself for an "About" section?',
         default: true
      },
      {
         type: 'input',
         name: 'about',
         message: 'Provide some information about yourself:',
         when: ({ confirmAbout }) => {
            if (confirmAbout) {
               return true;
            } else {
               return false;
            }
         }
      }
   ]);
};

const promptProject = portfolioData => {
   if (!portfolioData.projects) {
      portfolioData.projects = [];
   }
   console.log(`
=================
Add a New Project
=================
   `);
   return inquirer.prompt([
      {
         type: 'input',
         name: 'name',
         message: 'What is the name of your project? (Required)',
         validate: projectNameInput => {
            if (projectNameInput) {
               return true;
            } else {
               console.log('Please enter the name of your project!');
               return false;
            }
         }
      },
      {
         type: 'input',
         name: 'description',
         message: 'Provide a description of the project (Required)',
         validate: projectDescription => {
            if (projectDescription) {
               return true;
            } else {
               console.log('Please enter a description of your project!');
               return false;
            }
         }
      },
      {
         type: 'checkbox',
         name: 'languages',
         message: "What did you build this project with? (Check all that apply)",
         choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
      },
      {
         type: 'input',
         name: 'link',
         message: 'Enter the GitHub link to your project. (Required)',
         validate: githubLink => {
            if (githubLink) {
               return true;
            } else {
               console.log('Please enter a link to your project GitHub repo!');
               return false;
            }
         }
      },
      {
         type: 'confirm',
         name: 'feature',
         message: 'Would you like to feature this project?',
         default: false
      },
      {
         type: 'confirm',
         name: 'confirmAddProject',
         message: 'Would you like to enter another project?',
         default: false
      }
   ])
      .then(projectData => {
         portfolioData.projects.push(projectData);
         if (projectData.confirmAddProject) {
            return promptProject(portfolioData);
         } else {
            return portfolioData;
         }
      });
};

// ask the user for their information using inquirer prompts
// returns a all data as an object within a Promise
promptUser()
   // capture the returned data and stored within the projects array
   // recursively call promptProject for as many projects
   // the user wants to add
   // returns the entire data
   .then(promptProject)
   // the finished portfolio data object is returned as portfolioData
   // and sent into the generatePage() function, which will return the
   // finished HTML template code into pageHTML
   .then(portfolioData => {
      return generatePage(portfolioData);
   })
   // we pass pageHTML into writeFile() function, which returns a Promise
   // into the next .then() method
   .then(pageHTML => {
      return writeFile(pageHTML);
   })
   // upon a successful file creation, we take the writeFileResponse
   // object provided by the writeFile() functions resolve() execution
   // to log it, and then we return copyFile()
   .then(writeFileResponse => {
      console.log(writeFileResponse);
      return copyFile();
   })
   // the Promise returned by copyFile() then lets is know if the css
   // file was coping correctly, and if so, we're all done
   .then(copyFileResponse => {
      console.log(copyFileResponse);
   })
   .catch(err => {
      console.log(err);
   })