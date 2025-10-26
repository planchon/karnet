const { core } = Deno;

function argsToMessage(...args) {
    return args.map((arg) => JSON.stringify(arg)).join(" ");
}

globalThis.console = {
    log: (...args) => {
        core.print(`[log] ${argsToMessage(...args)}\n`);
    },
    error: (...args) => {
        core.print(`[error] ${argsToMessage(...args)}\n`);
    },
    info: (...args) => {
        core.print(`[info] ${argsToMessage(...args)}\n`);
    },
};

globalThis.karnetjs = {
    version: "0.1.0",
    readFile: (path) => core.ops.op_read_file(path),
};
