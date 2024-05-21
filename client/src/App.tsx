import React, { useState } from 'react'
import Editor from './components/Editor/Editor'
//import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [code, setCode] = useState('');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
      <div>
        <Editor initialValue={code} onChange={handleCodeChange} />
      </div>
  );
};

export default App;
