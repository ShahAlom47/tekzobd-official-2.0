/* eslint-disable @typescript-eslint/no-explicit-any */

export {};



declare module "*.json" {
  const value: any;
  export default value;
}



declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

declare module "nodemailer";