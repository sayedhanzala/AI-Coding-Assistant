import React, { useState, useRef } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import axios from "axios";
import Swal from "sweetalert2";

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [suggestedCode, setSuggestedCode] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const noCodeSelectedAlert = () => {
    return Swal.fire({
      title: "No Code Selected",
      text: "Please select some code to proceed.",
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
  };

  const handleSuggest = async () => {
    const selectedCode = editorRef.current
      ?.getModel()
      .getValueInRange(editorRef.current.getSelection());

    if (!selectedCode) {
      await noCodeSelectedAlert();
      return;
    }

    const res = await axios.post("http://localhost:8000/suggest", {
      selected_code: selectedCode,
      prompt: prompt,
    });

    if (res.data.suggested_code) {
      const parts = res.data.suggested_code.split(
        "**Explanation of Changes and Improvements**"
      );
      setOutput(parts[0].trim());
      setOriginalCode(selectedCode)
      setSuggestedCode(parts[0].trim());
      setShowDiff(true);
      setExplanation(parts[1]?.trim() || "No explanation provided.");
    } else {
      setOutput("Error: " + res.data.error);
    }
  };

  const handleApply = () => {
    const model = editorRef.current.getModel();
    const range = editorRef.current.getSelection();
    let codeContent = output;
    const codeMatch = output.match(/```python\s*([\s\S]*?)\s*```/);
    if (codeMatch && codeMatch[1]) {
      codeContent = codeMatch[1];
    }
    setShowDiff(false);
    model.pushEditOperations(
      [],
      [
        {
          range,
          text: codeContent,
          forceMoveMarkers: true,
        },
      ]
    );
  };

  return (
    <div className="main">
      <div
        className="editor"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          height: "40vh",
        }}
      >
        <div style={{ flex: showDiff ? "0 0 40vh" : "1" }}>
          <Editor
            height="100%"
            defaultLanguage="python"
            defaultValue="# Select code here"
            onMount={(editor) => (editorRef.current = editor)}
            className="editor"
            theme="vs-dark"
          />
        </div>
        {showDiff && (
          <div
            style={{
              flex: "0 0 40vh",
              border: "1px solid #ddd",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DiffEditor
              height="100%"
              original={originalCode}
              modified={suggestedCode}
              language="python"
              theme="vs-dark"
              options={{
                renderSideBySide: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
            <div
              style={{
                padding: "0.5rem",
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
                borderTop: "1px solid #ddd",
                zIndex: '999'
              }}
            >
              <button onClick={() => setShowDiff(false)}>Hide Diff</button>
              <button onClick={handleApply}>Integrate Code</button>
            </div>
          </div>
        )}
      </div>
      <div className="prompt">
        <textarea
          placeholder="Describe the change..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", height: "60px", marginTop: "1rem" }}
        />
      </div>
      <div className="button">
        <button onClick={handleSuggest}>Suggest Change</button>
      </div>
      <div className="response">
        {output && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Suggested Code:</h3>
            <pre style={{ width: "100%" }}>{output}</pre>
            <h4>Explanation:</h4>
            <p>{explanation}</p>
          </div>
        )}
        {output && (
          <div className="button">
            <button onClick={handleApply}>Integrate Code</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
