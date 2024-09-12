# Alias Web Based

Thesis project done for my IT programme at Metropolia University of Applied Sciences. The project is a digitalized version of the popular Finnish game [Alias](https://alias.eu/about-alias).

## Setting up a local environment

### Clone the project

Run the command below to clone a local version of the repository.

```bash
git clone https://github.com/phamduylong/AliasWebBased.git
```

There should be an option to clone using SSH if you wish to.

### Managing NPM packages

Run the install command to install npm packages needed for the project.

```bash
npm install
```

If the command failed, check if you have installed Node on the local machine. If you have not, install it from [here](https://nodejs.org/en).

## Running the application

### Running PocketBase

We'll start with some environment variables. To do this, create a .env file in the root directory (do not go under any child directory as this will prevent SvelteKit from properly recognizing these variables). The content of the file should be something like this:

```
POCKETBASE_URL='http://localhost:8090/'
```

**POCKETBASE_URL** will be used to instantiate a PocketBase instance. The URL could be replaced by a PocketBase instance URL if you have decided to host it somewhere else. Localhost shall be sufficient for storing data in a local environment. If you had decide to use localhost, the command below has to be run before running the development server:

```bash
cd .\pocketbase && .\pocketbase serve
```

This will fire up the local PocketBase instance.

### Starting SvelteKit application

After everything is set up, you shall have a directory named **AliasWebBased** in your file system. Open up the terminal in this directory, and run the following command to see magic happen:

```bash
npm run dev -- --open
```

A new browser window should open with the application preseting.

## Notes

- The project is using Vercel's cron jobs to do some clean ups with database entries. Using a local server will disable this feature and entries will have to be cleaned up manually.
