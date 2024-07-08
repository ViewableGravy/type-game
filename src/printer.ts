import * as ts from "typescript"

function extractTypeSignature(filename: string, aliasName: string): string {

    const program: ts.Program = ts.createProgram([ filename ], { emitDeclarationOnly: true });
    const sourceFile: ts.SourceFile = program.getSourceFile(filename);
    const typeChecker: ts.TypeChecker = program.getTypeChecker();
    // Get the declaration node you're looking for by it's type name.
    // This condition can be adjusted to your needs
    const statement: ts.Statement | undefined = sourceFile.statements.find(
      (s) => ts.isTypeAliasDeclaration(s) && s.name.text === aliasName
    );
    if (!statement) {
        throw new Error(`Type: '${aliasName}' not found in file: '${filename}'`);
    }
    const type: ts.Type = typeChecker.getTypeAtLocation(statement);

    return type.value;
}

const typeBSignature = extractTypeSignature("src/index.ts", "History");
// write to file or console log
console.log(typeBSignature);