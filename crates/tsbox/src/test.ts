type Karnetjs = {
    version: string;
    readFile: (path: string) => Promise<string>;
};

declare const karnetjs: Karnetjs;

console.log(karnetjs.version);

const path = "./README.md";

try {
    const content = await karnetjs.readFile(path);
    console.info(content);
} catch (error) {
    console.error(error);
}
