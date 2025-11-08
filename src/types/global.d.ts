// Ambient declaration to prevent TS build errors from legacy references
// where a `user` variable may be read without being defined in scope.
// This only affects type-checking; the runtime must not rely on this.
declare const user: { uid?: string } | undefined;

