import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import "./MarkdownMessage.css";

// Fix Markdown characters that the model has unnecessarily escaped.
// Preserve code blocks so code examples are not modified.
function cleanMarkdown(content) {
    return content
        .split(/(```[\s\S]*?```)/g)
        .map((part) => {
            if (part.startsWith("```")) return part;

            return part
                .replace(/\\([|*#._+\->~])/g, "$1")
                .replace(/&#x20;/gi, " ");
        })
        .join("");
}

export default function MarkdownMessage({ content }) {
    const cleanedContent = cleanMarkdown(content);

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                    a: ({ ...props }) => (
                        <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            >
                {cleanedContent}
            </ReactMarkdown>
        </div>
    );
}