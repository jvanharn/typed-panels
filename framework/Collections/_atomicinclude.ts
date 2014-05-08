// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.

declare module Collections {}
declare module Collections.Specialized {}

/// <reference path="Enumerable.ts" />
/// <reference path="Collection.ts" />
/// <reference path="Tuple.ts" />
/// <reference path="Array.ts" />
/// <reference path="List.ts" />
/// <reference path="Dictionary.ts" />