/// <reference path="typings/node/node.d.ts" />

import {readFileSync} from "fs";
import * as ts from "typescript";

var settings = {
    parseWithCallback: false,
    parseFunctions: [],
    ignoreFunctions: []
}

function nodeToText(node: ts.Node) {
    return node.kind + ": " + ts.SyntaxKind[node.kind] + " " + node.getSourceFile().getText().slice(node.pos, node.end)
}

export function parse(sourceFile: ts.SourceFile, functionsToVisit: Set<string>) {
    var charOffset = 0;
    parseNode(sourceFile);
    function parseNode(node: ts.Node) {
        if(node.kind == ts.SyntaxKind.FunctionDeclaration){
            //console.log(nodeToText(node));
            let funcNode = <ts.FunctionDeclaration>node;

            if(!functionsToVisit.has(funcNode.name.text) && !settings.parseWithCallback)
                return;

            if(funcNode.parameters.length == 0)
                if(settings.parseWithCallback)
                    return;
                else{
                    console.error(`${funcNode.name.text} doesn't have a callback`)
                    return;
                }

            let lastParam = <ts.FunctionOrConstructorTypeNode>funcNode.parameters[funcNode.parameters.length - 1].type

            if(lastParam.kind != ts.SyntaxKind.FunctionType)
                if(settings.parseWithCallback)
                    return;
                else{
                    console.error(`In ${funcNode.name.text}, the last parameter is not a callback`)
                    return;
                }

            if(!functionsToVisit.has(funcNode.name.text))
                throw new Error(funcNode.name.text)

            if(lastParam.parameters.length == 0){
                console.error(`In ${funcNode.name.text}, the callback doesn't have an error parameter`)
                return;
            }

            var before = sourceText.slice(0, charOffset + (funcNode.parameters.length != 1?
                funcNode.parameters[funcNode.parameters.length - 2].end:
                    //More than 1 param, set begin to after the last real parameter
                funcNode.parameters[funcNode.parameters.length - 1].pos));
                    //1 param (which is the callback), set begin to the before the callback

            var promiseParams: string;
            if(lastParam.parameters.length == 1){
                promiseParams = "void"
            }
            else if(lastParam.parameters.length == 2){
                promiseParams = lastParam.parameters[1].type.getText();
            }
            else{
                var d:[string, number] = ["hi", 4];
                promiseParams = `[${lastParam.parameters.slice(1).map(param => param.type.getText()).join(", ")}]`;
            }

            var during = `): Promise<${promiseParams}>;`
            var after = funcNode.getFullText() + sourceText.slice(charOffset + funcNode.end) ;
            charOffset += before.length + during.length + after.length - sourceText.length
            sourceText = before + during + after
        }
        ts.forEachChild(node, parseNode);
    }
}

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



var sourceText: string;
const fileNames = ["C:\\Users\\Hickman\\Documents\\GitHub\\TSThenify\\test\\fs.d.ts"];
fileNames.forEach(fileName => {
    // Parse a file
    sourceText = readFileSync(fileName).toString()
    let sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES6, /*setParentNodes */ true);
    // delint it
    parse(sourceFile, new Set(fsFunctionsToVisit));
    console.log(sourceText)
});
