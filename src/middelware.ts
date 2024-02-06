import { Middleware } from '../types/Middleware';

const Middleware: Middleware = () => {
  return [() => console.log("🚀 Let's go! 🚀")];
};

export default Middleware;
