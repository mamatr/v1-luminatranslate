import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}
export function FileUpload({ file, onFileSelect, disabled }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      // Handle rejected files if needed, e.g., show a toast notification
      console.error('File rejected:', fileRejections[0].errors[0].message);
      return;
    }
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled,
    accept: {
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    }
  });
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };
  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative group w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ease-in-out',
        'border-border hover:border-primary/80',
        isDragActive && 'border-primary bg-primary/10',
        disabled && 'cursor-not-allowed bg-muted/50 opacity-60'
      )}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex items-center justify-between space-x-4 text-left">
          <div className="flex items-center space-x-3 min-w-0">
            <FileIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
            onClick={removeFile}
            disabled={disabled}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="border border-dashed rounded-full p-3 bg-muted/50">
            <UploadCloud className={cn('h-8 w-8 text-muted-foreground transition-transform duration-300', isDragActive && 'scale-110 -translate-y-1')} />
          </div>
          <p className="text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">Supports: .docx, .txt</p>
        </div>
      )}
    </div>
  );
}