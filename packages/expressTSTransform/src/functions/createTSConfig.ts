import fs from "fs";
import path from "path";

const createTsConfig = (folderPath: string) => {
    const tsConfig = {
        compilerOptions: {
            target: "es2022",
            lib: ["es2022"],
            strict: true,
            module: "CommonJS",
            rootDir: "src",
            outDir: "dist",
            moduleResolution: "node",
            skipLibCheck: true,
            sourceMap: true,
            allowSyntheticDefaultImports: true,
            forceConsistentCasingInFileNames: true,
            esModuleInterop: true,
            importHelpers: true,
            removeComments: true,
            noFallthroughCasesInSwitch: true,
            noImplicitOverride: true,
            noUnusedLocals: true,
            noUncheckedIndexedAccess: true,
            allowUnreachableCode: false,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
        },
        include: ["src"],
        exclude: ["node_modules"],
    };



    fs.writeFileSync(
        path.join(folderPath, "tsconfig.json"),
        JSON.stringify(tsConfig, null, 2)
    );
};

export default createTsConfig;