const { execFile } = require("child_process");
const path = require("path");

function processUserFile(filename) {
  // Validate filename to prevent path traversal
  if (
    !filename ||
    typeof filename !== "string" ||
    filename.includes("..") ||
    filename.includes("/")
  ) {
    console.error("Invalid filename");
    return;
  }

  const logPath = `/var/log/${filename}.log`;

  execFile("grep", ["error", logPath], (error, stdout) => {
    if (error) {
      console.error(`Command failed: ${error}`);
      return;
    }
    console.log(`Log analysis results: ${stdout}`);
  });
}

function convertImageFile(inputFile, outputFormat) {
  // Validate inputs
  if (
    !inputFile ||
    !outputFormat ||
    typeof inputFile !== "string" ||
    typeof outputFormat !== "string"
  ) {
    console.error("Invalid input parameters");
    return;
  }

  // Sanitize file extension
  const allowedFormats = ["jpg", "png", "gif", "bmp", "webp"];
  if (!allowedFormats.includes(outputFormat.toLowerCase())) {
    console.error("Unsupported output format");
    return;
  }

  const outputFile = `output.${outputFormat}`;

  execFile("convert", [inputFile, outputFile], (error) => {
    if (error) {
      console.error(`Conversion failed: ${error}`);
      return;
    }
    console.log("Image converted successfully");
  });
}

function pingHost(hostname) {
  // Validate hostname
  if (!hostname || typeof hostname !== "string") {
    console.error("Invalid hostname");
    return;
  }

  // Simple hostname validation
  const hostnameRegex = /^[a-zA-Z0-9.-]+$/;
  if (!hostnameRegex.test(hostname)) {
    console.error("Invalid hostname format");
    return;
  }

  execFile("ping", ["-c", "3", hostname], (error, stdout) => {
    if (error) {
      console.error(`Ping failed: ${error}`);
      return;
    }
    console.log(`Ping result: ${stdout}`);
  });
}

module.exports = { processUserFile, convertImageFile, pingHost };
