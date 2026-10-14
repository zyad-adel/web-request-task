const fs = require("fs");
const EventEmitter = require("events");

const myEmitter = new EventEmitter();
let file1Content;
let file2Content;

myEmitter.on("filesReady", (content1, content2) => {
  const combinedContent = `${content1}\n${content2}`;

  fs.writeFile("combined.txt", combinedContent, (error) => {
    if (error) {
      console.log("Error writing file:", error);
      return;
    }

    console.log("[Event Triggered] Files merged successfully!");
  });
});

console.log("Reading files...");

fs.readFile("file1.txt", "utf8", (error, data) => {
  if (error) {
    console.log("Error reading file1:", error);
    return;
  }

  file1Content = data;

  fs.readFile("file2.txt", "utf8", (error, data) => {
    if (error) {
      console.log("Error reading file2:", error);
      return;
    }

    file2Content = data;

    myEmitter.emit("filesReady", file1Content, file2Content);
  });
});
