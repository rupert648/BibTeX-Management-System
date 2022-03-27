# CS4099 Project - BibTeX Management System
Under development. Being built using [Neon Bindings](https://neon-bindings.com): a library for writing safe and fast native Node.js modules in Rust, and [Electron](https://www.electronjs.org).

### The Project
To develop a lightweight, fast desktop application for collating and merging `.bib` files on a volume. The application (will) searches a directory and subdirectories for any `.bib` files, then merges them, using techniques to find duplicate or near-duplicate citations. It then interacts with the user to choose the best method to proceed. 

### Building and Running the Project
#### Backend Module
**This module must be built before the frontend can be ran**
`native` contains the npm module built using [Neon Bindings](https://neon-bindings.com) in Rust.
To build this module both `cargo` and `node`/`npm` are required.

Building the module can be done as follows
```
cd native
npm install
npm run build -- --release
```
To use the built module it can simply be imported as a node module once built. For example:
```
node
> require('.').levenshtein('pass', 'past')
1
```
**This module must be built before the frontend can be ran**
#### Frontend
`frontend` contains the code for building and running the GUI [Electron](https://www.electronjs.org) app.
To install dependencies for the frontend perform the following:
```
cd frontend
npm install
```
Then, to ensure the native module is installed
```
cd ./release/app
npm i ../../../native
```
To run the GUI. Run the following
```
npm run start
```
This should open a GUI in development mode, which will look something as follows
![GUI on load](./guionload.png)

#### Testing scripts
To run testing scrips, navigate to the base directory and run `npm install`.
The two provided scripts can then be run as follows.
```
node ./algorithm_comparison_script.js
```
```
node ./test_script.js
```