import React, { useState, useEffect, useRef } from 'react';
import './Editor.css';
import Parser from '../../../../src/backend/parser';
import { createGlobalScope } from '../../../../src/runtime/enviroment';
import { evaluate } from '../../../../src/runtime/interpreter';

interface EditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);
  const [lines, setLines] = useState<string[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setLines(value.split('\n'));
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const handleTabKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.currentTarget;
      const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
      setValue(newValue);
      setTimeout(() => {
        event.currentTarget.selectionStart = event.currentTarget.selectionEnd = selectionStart + 1;
      }, 0);
    }
  };

  const highlightSyntax = (line: string) => {
    const keywords = /\b(const|let|var|if|else|for|while|fn|return)\b/g;
    const comments = /\/\/.*|\/\*[^]*?\*\//g;
    const numbers = /\b\d+\b/g;

    return line
      .replace(keywords, '<span class="keyword">$&</span>')
      .replace(comments, '<span class="comment">$&</span>')
      .replace(numbers, '<span class="number">$&</span>');
  };

  const runCode = () => {
    const parser = new Parser();
    const enviroment = createGlobalScope();

    const program = parser.produceAST(value);
    const result = evaluate(program, enviroment);

    console.log(result);
  };

  return (
    <div className="editor-container">
      <button onClick={runCode}>Run</button>
      <div className="line-numbers">
        {lines.map((_, index) => (
          <div key={index} className="line-number">{index + 1}</div>
        ))}
      </div>
      <div className="code-container">
        <div className="code-editor">
          {lines.map((line, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }} />
          ))}
        </div>
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleTabKey}
          className="hidden-textarea"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Editor;
