# Saja
A super small CLI for Sassyjade
## Usage
```bash
$ saja <yourProject>
```
This command will fetch the latest version of [Sassyjade](http://rhinerock.com/sassyjade) boilerplate and install all its dependencies in a new folder called "yourProject", relative to the folder from where you ran the command.

Since the command also installs all necessary dependencies via npm you might run into some permission errors. In this case try to execute the command as super user: `$ sudo saja <yourProject>`.
### Configure Jade
After the installation is complete saja will allow you to configure `jade.config` via command line.
```bash
$ Do you want Saja to help you configure your project? (Y/n) > Y
```
The values in parenthesis are the default values used if you don't pass any value. You can change `config.jade` later on at any time. You can set the following options:

Option | Description | Default
:----- | :---------- | :------
Project name | The title of your site | The project name you passed to saja
Project root | Full root path of your application, such as a path in the file system or a full URI | Path to folder in which you ran `$ saja`
CSS name | The path and name of your css file | `css/main.css`
JavaScript name | The path and name of your javascript file | `js/main.js`
### Create a blank project
```bash
$ saja --blank <yourProject>
```
If you don't want the default folder and file structre of Sassyjade add the `--blank` flag. You can also just use `-b` instead.
## License
MIT &copy; [philister16](mailto:phil@rhinerock.com)