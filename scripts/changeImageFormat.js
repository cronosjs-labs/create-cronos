import sharp from "sharp";
import fs from "fs";

const inputBuffer = fs.readFileSync("./scripts/input.png");

const main = async () => {
  try {
    const outputBuffer = await sharp(inputBuffer).webp().toBuffer();
    fs.writeFileSync("./scripts/output.webp", outputBuffer);
  } catch (error) {
    console.log(error);
  }
};

main();
