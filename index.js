/* #! /usr/bin/env node */

/**
 * Saja - CLI for Sassyjade Boilerplate
 *
 * @license MIT
 * @author Philipp Nueesch <phil@rhinerock.com> (http://rhinerock.com)
 */

/* ### Todo ###

for whatever reason npmInstalls() doesnt call getConfig()
it worked before, it doesn't anymore

### */

/*=========================================
  Requires
  =========================================*/

// to run commands in terminal
var exec = require("child_process").exec;

// read user input from terminal
var readline = require("readline");

// file system
var fs = require("fs");


/*=========================================
  Process
  =========================================*/

// get the user options
var userArgs = process.argv.splice(2);

//pass the return from the check on userArgs
var args = checkUserArgs(userArgs);

// if checkUserArgs didn't return false
if(args !== false) {

  // donwload the files and install everything and finally create config
  downloadZip();
  //getConfig(args, writeConfig);
}


/*=========================================
  Util
  =========================================*/

/**
 * Writes the config.jade file to disk
 * @param obj user provided arguments
 * @param obj user provided config options
 * @return func console.log
 */
function writeConfig(args, config) {

  if(config.have) {
      console.log("Your config options are as follows:");
      console.log(config);
      console.log("You can change these manually at all times.");

    var string = "//- Sassyjade's Jade Configuration File\n\n";
    
    string += "//- Project name\n";
    string += "- var site = '" + config.name +"';\n\n";

    string += "//- Project root\n";
    string += "- var root = '" + config.root + "';\n\n";

    string += "//- CSS file to be included in distribution\n";
    string += "- var css = '" + config.css + "';\n\n";

    string += "//- JS file to be included in distribution\n";
    string += "- var js = '" + config.js + "';\n\n";

    string += "//- Page title format\n";
    string += "- var title = site + ' | ' + page;\n\n";

    string += "//- Global includes\n";
    string += "include ../mixin/jadestones.jade";

    var file = args.name + "/src/templ/incl/config.jade";

    fs.writeFile(file, string, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Created config file at src/templ/incl/config.jade");       
      }
    });

  } // endif

  console.log("Sassyjade is now ready to rock'n'roll :-)");

} // writeConfig()

/**
 * Prompts the user to input configuration options
 * @param obj the user arguments
 * @param func callback
 * @return obj user defined options
 */
function getConfig(args, cb) {

  var config = {};

  rl = readline.createInterface(process.stdin, process.stdout);

  rl.question("Do you want Saja to help you configure your project? (Y/n) > ", function(answ) {
    
    // Configuration workflow
    switch(answ.trim()) {

      // Workflow w/o configuration  
      case "n":
      case "N":
        console.log("Ok boss, Saja won't configure your project. You can do this later on manually.");
        config.have = false;
        cb(args, config);
        rl.close();
        break;

      // Workflow w/ configuration
      default:
        
        // Project naming
        rl.question("Project name ("+args.name+"): ", function(answ) {
          switch(answ.trim().length) {
            case 0:
              config.name = args.name;
              break;

            default:
              config.name = answ.trim();
              break
          }

          // Root path
          rl.question("Dist root path ("+process.cwd()+"/"+args.name+"/dist/): ", function(answ) {
            switch(answ.trim().length) {
              case 0:
                config.root = process.cwd() + "/" + args.name + "/dist/";
                break;

              default:
                config.root = answ.trim();
                break;
            }

            // CSS name
            rl.question("CSS name (main.css): ", function(answ) {
              switch(answ.trim().length) {
                case 0:
                  config.css = "main.css";
                  break;

                default:
                  config.css = answ.trim();
                  break;
              }

              // JS name
              rl.question("JS name (main.js): ", function(answ) {
                switch(answ.trim().length) {
                  case 0:
                    config.js = "main.js";
                    break;

                  default:
                    config.js = answ.trim();
                    break;
                }
                config.have = true;
                cb(args, config);
                rl.close();
                
              });
            });
          });
        });
        break;
  
    } // switch

  });

} // getConfig()

/**
 * checks if user args are valid
 * @params arr user provided arguments
 * @return obj with valid user arguments
 */
function checkUserArgs(userArgs) {
  
  var blankFlag = false;
  var projName = "";
  var errStack = [];
  var patt = /^[a-zA-Z0-9_-]+$/

  // if more than 2 arguments add err to stack
  if(userArgs.length > 2) {
    errStack.push("Too many arguments. Make sure to pass a name for your project and the --blank flag if needed only.");
  }

  // if less than 1 argument add err to stack
  if(userArgs.length < 1) {
    errStack.push("Please give your project a name.");
  }

  // if 2 arguments check that 1 is either --blank or -b
  if(userArgs.length === 2) {
    if(userArgs[0] === "--blank" || userArgs[0] === "-b") {
      // and the other is a valid string
      if(patt.test(userArgs[1])) {
        // then set blankFlag to true and projName to the string provided
        blankFlag = true;
        projName = userArgs[1];
      } else {     
        errStack.push("Make sure you pass a string to name your project. Characters, numbers, underscore and dash are supported only.");
      } 
    } else if(userArgs[1] === "--blank" || userArgs[1] === "-b") {
      if(patt.test(userArgs[0])) {
        blankFlag = true;
        projName = userArgs[0];
      } else {
        errStack.push("Make sure you pass a string to name your project. Characters, numbers, underscore and dash are supported only.");
      }
    } else {
      errStack.push("You can pass a string to name your project and the --blank flag only. For the name characters, numbers, underscore and dash are supported.");
    }
  }

  // if 1 argument is passed make sure it is a valid string
  if(userArgs.length === 1) {
    if(patt.test(userArgs[0])) {
      blankFlag = false;
      projName = userArgs[0];
    } else {
      errStack.push("Make sure you pass a string to name your project. Characters, numbers, underscore and dash are supported only.");
    }
  }

  // if errStack.length is < 1
  // then return projName and blankFlag as properties in args obj
  // else loop through errStack and console.log all err
  if(errStack.length === 0) {
    var args = {
      name: projName,
      blank: blankFlag
    }
    return args;
  } else {
    for(var i = 0; i < errStack.length; i++) {
      console.log("--ERR: ", errStack[i],"--");
    }
    return false;
  }

} // func checkUserArgs()


/**
 * Downloads the zip file and kicks-off the unZip()
 * @return bool true if no errors
 * @callback unZip()
 */
function downloadZip() {
  var url = "https://github.com/philister16/sassyjade/archive/master.zip";
  var target = "master.zip";
  var cmd = "curl -L -o " + target + " " + url;
  console.log("Loading...");
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      throw err;
      return false;
    } else {
      unZip();
      return true;
    }
  });
}

/**
 * Unzips the download
 * @return bool true if no err
 * @callback rmZip()
 */
function unZip() {
  var target = "master.zip";
  var cmd = "unzip " + target;
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      throw err;
      return false;
    } else {
      rmZip();
      return true;
    }
  });
}

/**
 * Removes the zip file after unzipped
 * @return bool true if no err
 * @callback rename()
 */
function rmZip() {
  var target = "master.zip";
  var cmd = "rm " + target;
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      throw err;
      return false;
    } else {
      rename(args);
      return true;
    }
  });
}

/**
 * Renames the directory
 * @param obj arguments provided by the user
 * @return bool true if no err
 * @callback npmInstalls() || makeBlank()
 */
function rename(args) {
  var target = "./sassyjade-master";
  var cmd = "mv " + target + " ./" + args.name;
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      throw err;
      return false;
    } else if(args.blank) {
      makeBlank(args);
    } else {
      console.log("... hang on, installing the dependencies now. This can take a few minutes.");
      npmInstalls(args);
      return true;
    }
  });
}

/**
 * Removes all folders
 * @param obj user provided arguments
 * @return bool true if no err
 */
function makeBlank(args) {
  var target = args.name;
  var cmd = "cd " + target + " && rm -r src";
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      throw err;
      return false;
    } else {
      console.log("... and done! Your blank project is ready. Please be aware that blank projects do NOT install any dependencies.");
      return true;
    }
  });
}

/**
 * Install the dev-dependencies
 * @param obj arguments provided by user
 * @ return bool true if no err
 */
function npmInstalls(args) {
  var target = args.name;
  var cmd = "cd " + target + " && npm install";
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      rollback(args);
      return false;
    } else {
      console.log("... and done!");
      jadeConfigurator(args);
      //return true;
    }
  });
}

/**
 * Rollback npmInstalls in case of permission error
 * @param obj arguments provided by user
 * @return bool true if no err
 */
function rollback(args) {
  var target = args.name;
  var cmd = "rm -r " + target;
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      throw err;
      return false;
    } else {
      console.log("--ERR: There was a problem when trying to install dependencies with npm.--");
      console.log("Try to run this command as root admin.");
      return true;
    }
  });
}

function jadeConfigurator(args) {
  getConfig(args, writeConfig);
}












