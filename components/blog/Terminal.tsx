"use client";

import { useState } from "react";

interface TerminalProps {
	command: string;
	multiline?: boolean;
}

export default function Terminal({ command, multiline = false }: TerminalProps) {
	const [copied, setCopied] = useState(false);

	const copyText = multiline
		? command
		: command.replace(/^\$\s*/, "");

	const handleCopy = () => {
		navigator.clipboard.writeText(copyText);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="rounded-md bg-[#f4f2ec] dark:bg-[#1e1e1e] text-sm font-mono overflow-hidden relative group">
			<div className="flex items-center gap-2 px-4 py-2 bg-[#e8e6df] dark:bg-[#2d2d2d]">
				<span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
				<span className="w-3 h-3 rounded-full bg-[#febc2e]" />
				<span className="w-3 h-3 rounded-full bg-[#28c840]" />
			</div>
			<button
				onClick={handleCopy}
				className="absolute top-2 right-3 px-2 py-1 text-xs rounded bg-[#ddd8cf] dark:bg-[#3a3a3a] text-[#888] hover:text-[#555] dark:hover:text-[#c0bdb5] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
			>
				{copied ? "copied!" : "copy"}
			</button>
			<div className="p-4 overflow-x-auto">
				{multiline ? (
					<pre className="text-[#3a3a3a] dark:text-[#c0bdb5] whitespace-pre">{command}</pre>
				) : (
					<code className="text-[#3a3a3a] dark:text-[#c0bdb5]">
						<span className="text-[#2d8a2d] dark:text-[#6bbd6b]">~</span>{" "}
						<span className="text-[#888]">$</span> {command}
					</code>
				)}
			</div>
		</div>
	);
}
