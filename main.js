"use strict";
const fs_1 = require("fs");
const ts = require("typescript");
var settings = {
    parseWithCallback: false,
    parseFunctions: [],
    ignoreFunctions: []
};
function nodeToText(node) {
    return node.kind + ": " + ts.SyntaxKind[node.kind] + " " + node.getSourceFile().getText().slice(node.pos, node.end);
}
function parse(sourceFile, functionsToVisit) {
    var charOffset = 0;
    parseNode(sourceFile);
    function parseNode(node) {
        if (node.kind == ts.SyntaxKind.FunctionDeclaration) {
            let funcNode = node;
            if (!functionsToVisit.has(funcNode.name.text) && !settings.parseWithCallback)
                return;
            if (funcNode.parameters.length == 0)
                if (settings.parseWithCallback)
                    return;
                else {
                    console.error(`${funcNode.name.text} doesn't have a callback`);
                    return;
                }
            let lastParam = funcNode.parameters[funcNode.parameters.length - 1].type;
            if (lastParam.kind != ts.SyntaxKind.FunctionType)
                if (settings.parseWithCallback)
                    return;
                else {
                    console.error(`In ${funcNode.name.text}, the last parameter is not a callback`);
                    return;
                }
            if (!functionsToVisit.has(funcNode.name.text))
                throw new Error(funcNode.name.text);
            if (lastParam.parameters.length == 0) {
                console.error(`In ${funcNode.name.text}, the callback doesn't have an error parameter`);
                return;
            }
            var before = sourceText.slice(0, charOffset + (funcNode.parameters.length != 1 ?
                funcNode.parameters[funcNode.parameters.length - 2].end :
                funcNode.parameters[funcNode.parameters.length - 1].pos));
            var promiseParams;
            if (lastParam.parameters.length == 1) {
                promiseParams = "void";
            }
            else if (lastParam.parameters.length == 2) {
                promiseParams = lastParam.parameters[1].type.getText();
            }
            else {
                var d = ["hi", 4];
                promiseParams = `[${lastParam.parameters.slice(1).map(param => param.type.getText()).join(", ")}]`;
            }
            var during = `): Promise<${promiseParams}>;`;
            var after = funcNode.getFullText() + sourceText.slice(charOffset + funcNode.end);
            charOffset += before.length + during.length + after.length - sourceText.length;
            sourceText = before + during + after;
        }
        ts.forEachChild(node, parseNode);
    }
}
exports.parse = parse;
var fsFunctionsToVisit = [
    'rename',
    'ftruncate',
    'chown',
    'fchown',
    'lchown',
    'chmod',
    'fchmod',
    'stat',
    'lstat',
    'fstat',
    'link',
    'symlink',
    'readlink',
    'realpath',
    'unlink',
    'rmdir',
    'mkdir',
    'readdir',
    'close',
    'open',
    'utimes',
    'futimes',
    'fsync',
    'write',
    'read',
    'readFile',
    'writeFile',
    'appendFile',
    'pbkdf2',
    'randomBytes',
    'pseudoRandomBytes',
    'exec',
    'execFile',
    'deflate',
    'deflateRaw',
    'gzip',
    'gunzip',
    'inflate',
    'inflateRaw',
    'unzip',
    'lookup',
    'resolve',
    'resolve4',
    'resolve6',
    'resolveMx',
    'resolveTxt',
    'resolveSrv',
    'resolveNs',
    'resolveCname',
    'reverse',
    "access",
    'deflate',
    'deflateRaw',
    'gzip',
    'gunzip',
    'inflate',
    'inflateRaw',
    'unzip',
];
var sourceText;
const fileNames = ["C:\\Users\\Hickman\\Documents\\GitHub\\TSThenify\\test\\fs.d.ts"];
fileNames.forEach(fileName => {
    sourceText = fs_1.readFileSync(fileName).toString();
    let sourceFile = ts.createSourceFile(fileName, sourceText, 2, true);
    parse(sourceFile, new Set(fsFunctionsToVisit));
    console.log(sourceText);
});
