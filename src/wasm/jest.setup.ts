import '@testing-library/jest-dom'; 


global.window = Object.create(window);
(window as any).loadPyodide = jest.fn().mockResolvedValue({
  runPythonAsync: jest.fn().mockResolvedValue(null), 
  loadPackage: jest.fn().mockResolvedValue(null), 
  
});

