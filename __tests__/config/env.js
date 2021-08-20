const fs = require("fs");
const { read } = require("../../config/env");

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

describe("env.js", () => {
  it("can read and set environment variables", () => {
    expect(process.env.var1).toEqual(undefined);
    expect(process.env.var2).toEqual(undefined);

    const content = "var1=someKey1\nvar2=someKey2";
    fs.readFileSync.mockReturnValueOnce(content);
    read("__test");

    expect(process.env.var1).toEqual("someKey1");
    expect(process.env.var2).toEqual("someKey2");

    delete process.env.var1;
    delete process.env.var2;
  });
});
