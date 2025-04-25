import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Swal from "sweetalert2";

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [explanation, setExplanation] = useState("");

  const noCodeSelectedAlert = () => {
    return Swal.fire({
      title: "No Code Selected",
      text: "Please select some code to proceed.",
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    })
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
      console.log(parts[0].trim());
      setExplanation(parts[1]?.trim() || "No explanation provided.");
    } else {
      setOutput("Error: " + res.data.error);
    }
  };

  const handleApply = () => {
    const model = editorRef.current.getModel();
    const range = editorRef.current.getSelection();
    // Extract only the code between markdown code fences
    let codeContent = output;
    const codeMatch = output.match(/```python\s*([\s\S]*?)\s*```/);
    if (codeMatch && codeMatch[1]) {
      codeContent = codeMatch[1];
    }
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
      <div className="editor">
        <Editor
          height="50vh"
          defaultLanguage="python"
          defaultValue="# Select code here"
          onMount={(editor) => (editorRef.current = editor)}
          className="editor"
          theme="vs-dark"
        />
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
            <pre style={{width:'100%'}}>{output}</pre>
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
