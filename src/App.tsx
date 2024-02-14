import { useState } from "react";

import "./App.css";

const headersList = [
  "accept",
  "authorization",
  "x-glofox-branch-id",
  "glofox-api-token",
];

function App() {
  const [curlState, setCurlState] = useState("");

  const [minifiedCurl, setMinifiedCurl] = useState("");

  const handleMinify = (curlReq: string) => {
    setCurlState(curlReq);

    curlReq = curlReq.replaceAll("--header", "-H");

    const headers = curlReq.match(/-H '.*?'/g) || [];
    const necessaryHeaders = headers.filter((header) => {
      const headerName = header.split(":")[0].split(" ")[1].replace(/'/g, "");
      return headersList.includes(headerName);
    });

    let minifiedCurl = curlReq;
    headers.forEach((header) => {
      minifiedCurl = minifiedCurl.replace(
        header,
        necessaryHeaders.includes(header) ? `${header}` : ""
      );
    });

    minifiedCurl = minifiedCurl
      .replace(/(\\?\n)+(?!\s*-H)/g, "")
      .replace(/\\/g, "");
    minifiedCurl = minifiedCurl.replace(/--compressed/g, "\n--compressed");
    minifiedCurl = minifiedCurl.replace(/--data/g, "\n--data");

    setMinifiedCurl(minifiedCurl);
  };

  return (
    <div className="container">
      <h1>cURL minifier</h1>

      <main className="main">
        <div className="input-container">
          <label htmlFor="curl" className="field-label">
            Insert original cURL
          </label>
          <textarea
            id="curl"
            name="curl"
            className="field"
            value={curlState}
            onChange={(e) => handleMinify(e.target.value)}
            rows={8}
          ></textarea>
        </div>

        <div className="output-container">
          <h2>Output</h2>
          <div className="output">
            <p>{minifiedCurl}</p>
            {minifiedCurl && (
              <button
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(minifiedCurl)}
              >
                Copy
              </button>
            )}
          </div>
        </div>

        <button
          className="action-button"
          onClick={() => {
            setCurlState("");
            setMinifiedCurl("");
          }}
        >
          Reset
        </button>
      </main>
    </div>
  );
}

export default App;
