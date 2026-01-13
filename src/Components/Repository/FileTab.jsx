import { useEffect} from "react";
import LoadingState from "../Layout/Loading";
import ErrorState from "../Layout/Error";
import { useMemo, useState } from "react";
import { getFileTree, resetTree } from "../../features/fileTreeSlice";
import CodeEditor from "./CodeEditor";
import { useDispatch,useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
function FilesTab() {

  const dispatch = useDispatch();
  const { id:repoId} = useParams();

  //all state 

  const fileTree = useSelector(state => state.fileTree.tree);
  const fileError =  useSelector(state => state.fileTree.error);
  const fileStatus = useSelector(state => state.fileTree.status);
  const currentPath = useSelector(state => state.fileTree.currentPath);
   

  useEffect(()=>{
    if(fileStatus==="idle"){
      dispatch(getFileTree({repoId,path:'/',ref:'main'}))
    }

    return ()=>{
      dispatch(resetTree());
    }

  },[dispatch,repoId])

  const [selectedFile, setSelectedFile] = useState(null);
  const selectedFilePath = useMemo(() => {
    if (!selectedFile) return null;
    const path =
      currentPath === "/" ? `/${selectedFile}` : `${currentPath}/${selectedFile}`;
    return path.replace(/\/+/g, "/");
  }, [selectedFile, currentPath]);

  if (fileStatus === "loading") {
    return <LoadingState />;
  }

  if (fileError) {
    return (
      <ErrorState message={fileError} onRetry={() => dispatch(resetTree())} />
    );
  }

  if (selectedFile) {
    return (
      <div>
        <button
          onClick={() => setSelectedFile(null)}
          className="group mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 transition-all duration-200 font-medium"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm">Back to Files</span>
        </button>

        <div className="bg-[#0b0d14] rounded-xl border border-indigo-500/20 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-[#161927] to-[#1a1d2e] px-6 py-4 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="text-white font-semibold text-lg">
                {selectedFile}
              </span>
            </div>
          </div>

          <div className="p-6 text-slate-300 text-sm">
            <CodeEditor
              repoId={repoId}
              filePath={selectedFilePath}
              refName="main"
            />
          </div>
        </div>
      </div>
    );
  }

  const handleFolderClick = (folderName) => {
    // Build new path: currentPath + folderName
    const newPath = currentPath === '/' 
      ? `/${folderName}` 
      : `${currentPath}/${folderName}`;
    
    // Normalize path (remove double slashes)
    const normalizedPath = newPath.replace(/\/+/g, '/');
    
    // Dispatch getFileTree with new path
    dispatch(getFileTree({ repoId, path: normalizedPath, ref: 'main' }));
  };

  const handleFileClick = (fileName) => {
    // Just select the file, don't reset tree
    setSelectedFile(fileName);
  };

  const handleBackClick = () => {
    if (currentPath === '/') {
      return; // Already at root
    }
    
    // Go up one directory
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop(); // Remove last part
    const newPath = pathParts.length === 0 ? '/' : '/' + pathParts.join('/');
    
    dispatch(getFileTree({ repoId, path: newPath, ref: 'main' }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white">Repository Files</h3>
          {currentPath !== '/' && (
            <button
              onClick={handleBackClick}
              className="px-3 py-1.5 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 rounded-lg transition-all text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}
          {currentPath !== '/' && (
            <span className="text-slate-400 text-sm font-mono bg-black/30 px-3 py-1 rounded-lg">
              {currentPath}
            </span>
          )}
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload File
        </button>
      </div>
      <div className="space-y-2 bg-[#0b0d14] rounded-xl border border-white/10 p-2">
        {fileTree.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-slate-400">No files found in this repository</p>
          </div>
        ) : (
          fileTree.map((file, index) => (
            <button
              key={file.hash || file.name || index}
              onClick={() => {
                if (file.type === 'directory' || file.type === 'tree') {
                  handleFolderClick(file.name);
                } else {
                  handleFileClick(file.name);
                }
              }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-indigo-500/10 rounded-lg text-left transition-all group border border-transparent hover:border-indigo-500/30"
            >
              <div className={`p-2 rounded-lg ${file.type === 'tree' || file.type === 'directory' ? 'bg-indigo-500/10' : 'bg-slate-500/10'} group-hover:scale-110 transition-transform`}>
                {file.type === 'tree' || file.type === 'directory' ? (
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <span className="text-white flex-1 group-hover:text-indigo-300 transition-colors font-medium text-base">{file.name}</span>
              {file.hash && (
                <span className="text-slate-500 text-xs font-mono bg-black/30 px-3 py-1 rounded-lg">
                  {file.hash.substring(0, 7)}
                </span>
              )}
              {file.type === 'file' && (
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {(file.type === 'tree' || file.type === 'directory') && (
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}


export default FilesTab;