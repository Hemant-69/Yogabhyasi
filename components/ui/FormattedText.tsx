import React from "react";

interface FormattedTextProps {
  text: string;
}

export default function FormattedText({ text }: FormattedTextProps) {
  if (!text) return null;

  // Split content by newlines
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let elementKey = 0;

  const parseInlineStyles = (content: string) => {
    // Basic bold parsing: **text**
    const parts = content.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, index) => {
      // Odd indices are bold
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-sage-950">{part}</strong>;
      }
      return part;
    });
  };

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${elementKey++}`} className="list-disc pl-6 space-y-2 my-4">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "") {
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      const headingText = line.substring(3).trim();
      elements.push(
        <h2 key={`h2-${elementKey++}`} className="font-serif font-bold text-lg md:text-xl text-sage-950 mt-8 mb-4">
          {headingText}
        </h2>
      );
    } else if (line.startsWith("* ")) {
      const itemText = line.substring(2).trim();
      currentListItems.push(
        <li key={`li-${elementKey++}`}>
          {parseInlineStyles(itemText)}
        </li>
      );
    } else {
      flushList();
      elements.push(
        <p key={`p-${elementKey++}`} className="mb-4">
          {parseInlineStyles(line)}
        </p>
      );
    }
  }

  flushList();

  return <div className="space-y-4">{elements}</div>;
}
