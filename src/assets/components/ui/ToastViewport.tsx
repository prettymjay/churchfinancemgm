interface ToastViewportProps {
  message: string;
}

export default function ToastViewport({ message }: ToastViewportProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      <div className="toast toast-success">{message}</div>
    </div>
  );
}
