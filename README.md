## Getting Started

1, Ensure you have MongDB and the latest version of node.js setup already

2, Create a new "upload" directory on the root of the project 
```bash
upload
```
This directory will be used for file upload, so ensure it has a Read and Write permission

2, Next Setup environment variable on:

```bash
# .env
NODE_ENV=<NODE_ENV>
PORT=8081<PORT>
MONGODB_URI=<MONGODB_URI>
JWT_ACCESS=<JWT_ACCESS>
FILE_ROOT_URL=<FILE_ROOT_URL>

```
Server will throw error is ENV is missing


3, Next Install all npm dependencies

```bash
npm install

```


4, Finally, run the server:

```bash
npm start

```

Next set up the next.js server [https://github.com/Emibrown/good-reads-client-nextjs](https://github.com/Emibrown/good-reads-client-nextjs)

