import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express and TypeScript!').end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});