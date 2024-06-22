type PromptSuggestionProps = {
  suggestion: string;
  onClick: () => void;
  isLoading?: boolean;
};

/**
 * Renders a prompt suggestion pill-shaped button.
 */
export const PromptSuggestion: React.FC<PromptSuggestionProps> = ({
  suggestion,
  onClick,
  isLoading = false,
}) => {
  return (
    <button onClick={() => onClick()} disabled={isLoading}
      className={`rounded-2xl border p-2 ${
        !isLoading ? "cursor-pointer" : "cursor-not-allowed"
      } transition hover:bg-gray-100`}
    > {suggestion}
    </button>
  );
};
