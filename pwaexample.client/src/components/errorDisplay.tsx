import { toast } from "sonner";

interface ErrorDisplayProps {
  error: Error;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  toast.error(error.message);
  return <div>Something went wrong...</div>;
}
