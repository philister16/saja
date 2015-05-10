# Saja
A super small CLI for Sassyjade
## Usage
```
$ saja <yourProject>
```
This command will fetch the latest version of [Sassyjade](http://rhinerock.com/sassyjade) boilerplate and install all its dependencies in a new folder called "yourProject", relative to the folder from where you ran the command.

Since the command also installs all necessary dependencies via npm you might run into some permission errors. In this case try to execute the command as super user: `$ sudo saja <yourProject>`.
```
$ saja --blank <yourProject>
```
If you don't want the default folder and file structre of Sassyjade add the `--blank` flag. You can also just use `-b` instead.
## License
MIT &copy; [philister16](mailto:phil@rhinerock.com)