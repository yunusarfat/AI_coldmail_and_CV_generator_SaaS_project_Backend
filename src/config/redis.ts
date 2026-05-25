// import Redis from "ioredis";
// export const redis=new Redis(process.env.REDIS_URL as string);


import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}

export const redis = new Redis(process.env.REDIS_URL);