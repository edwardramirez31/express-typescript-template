/* eslint-disable no-console */
import express from 'express';

const app = express();
const port = 5000;
app.get('/', (_, res) => {
  res.status(200).send('<h1>Here</h1>');
});

app.listen(port, () => console.log(`Running on port ${port}`));
// import express, { Application, Request, Response } from "express";

// const app: Application = express();
// const port = 3000;

// // Body parsing Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get(
//     "/",
//     async (req: Request, res: Response): Promise<Response> => {
//         return res.status(200).send({
//             message: "Hello World!",
//         });
//     }
// );

// try {
//     app.listen(port, (): void => {
//         console.log(`Connected successfully on port ${port}`);
//     });
// } catch (error) {
//     console.error(`Error occured: ${error.message}`);
// }
