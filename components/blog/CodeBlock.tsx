"use client";

import { useState } from "react";

interface CodeBlockProps {
	filename: string;
	code: string;
}

export default function CodeBlock({ filename, code }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="rounded-md bg-[#f4f2ec] dark:bg-[#1e1e1e] text-sm font-mono overflow-hidden relative group">
			<div className="flex items-center px-4 py-2 bg-[#e8e6df] dark:bg-[#2d2d2d]">
				<span className="text-[#666] dark:text-[#888] text-xs">{filename}</span>
			</div>
			<button
				onClick={handleCopy}
				className="absolute top-2 right-3 px-2 py-1 text-xs rounded bg-[#ddd8cf] dark:bg-[#3a3a3a] text-[#888] hover:text-[#555] dark:hover:text-[#c0bdb5] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
			>
				{copied ? "copied!" : "copy"}
			</button>
			<div className="p-4 overflow-x-auto">
				<pre className="text-[#3a3a3a] dark:text-[#c0bdb5] whitespace-pre">{code}</pre>
			</div>
		</div>
	);
}
