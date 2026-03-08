"use client";

import Image from "next/image";
import Terminal from "@/components/blog/Terminal";
import NeovimSetupSection from "@/components/blog/NeovimSetupSection";

const codeCls = "rounded bg-[#f4f2ec] dark:bg-[#181818] px-1.5 py-0.5";
const tipBoxCls = "border-l-2 border-[#c0bdb5] dark:border-[#3a3a3a] pl-6 py-4 bg-[#f4f2ec]/70 dark:bg-[#181818]/80 rounded-r-md";

const ghosttyConfig = `# Theme
theme = Catppuccin Mocha

# Font
font-family = JetBrainsMono Nerd Font
font-size = 14

# Window
macos-titlebar-style = transparent
window-padding-x = 8
window-padding-y = 4
background-opacity = 0.95
background-blur-radius = 20

# Cursor
cursor-style = bar
cursor-style-blink = true

# Scrollback
scrollback-limit = 10000

# Shell integration
shell-integration = zsh

# Mouse
mouse-hide-while-typing = true

# Clipboard
clipboard-read = allow
clipboard-write = allow
copy-on-select = true`;

const zshConfig = `# Starship prompt
eval "$(starship init zsh)"

# Zoxide (smart cd)
eval "$(zoxide init zsh)"

# fzf keybindings & completion (Ctrl+R history, Ctrl+T files)
source <(fzf --zsh)

# thefuck (corrects previous command)
eval $(thefuck --alias)

# Zsh plugins
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Better CLI aliases
alias ls="eza --icons --git"
alias ll="eza --icons --git -la"
alias la="eza --icons --git -a"
alias lt="eza --icons --git --tree --level=2"
alias cat="bat"
alias cd="z"`;

export default function NeovimIsntActuallyThatScary() {
	return (
		<div className="space-y-6">
			<p>
				We all love IDEs, they&#39;re easy to use and just work out of the box. I was an avid VS Code
				user myself until one day I got bored enough to reconfigure everything and switch over to
				NeoVim. And honestly? It&#39;s actually kind of fun.
			</p>

			<Image
				src="/full-vim-configuration.png"
				alt="Full Vim configuration"
				width={1200}
				height={700}
				className="rounded-md w-full"
			/>

			<h2 className="text-xl md:text-2xl font-semibold">Preamble</h2>
			<p>
				If you&#39;re not already familiar with Vim, you should definitely get acquainted before diving
				in. Open up your terminal and run:
			</p>
			<Terminal command="vimtutor" />
			<p>
				This launches a built-in interactive tutorial that walks you through all the basics. I&#39;d
				recommend running through it a few times until the motions start to feel natural.
			</p>

			<p>
				If you&#39;re only here to make your terminal look better, feel free to skip ahead, this
				part is just for those configuring Neovim. But if you&#39;re too lazy to do vimtutor, I get
				it. Here&#39;s a quick crash course.
			</p>

			<p>
				Vim is <em>modal</em>, so instead of just typing into a file, you switch between modes:
			</p>
			<ul className="list-disc pl-6 space-y-1">
				<li><code className={codeCls}>Esc</code> <strong>Normal</strong> mode, for navigating and editing</li>
				<li><code className={codeCls}>i</code> <strong>Insert</strong> mode, for typing text</li>
				<li><code className={codeCls}>v</code> <strong>Visual</strong> mode, for selecting</li>
				<li><code className={codeCls}>:</code> <strong>Command</strong> mode, for running commands</li>
			</ul>

			<p>And to not get trapped in Vim forever:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li><code className={codeCls}>:w</code> save</li>
				<li><code className={codeCls}>:q</code> quit</li>
				<li><code className={codeCls}>:wq</code> save and quit</li>
				<li><code className={codeCls}>:q!</code> force quit (for when you&#39;ve messed everything up)</li>
			</ul>

			<div className={tipBoxCls}>
				<p>
					<strong>Tip:</strong> It can be difficult to get around quickly in Neovim at first. The repeat rate controls how fast a held key fires, and the delay controls how long you
					have to hold it before it starts repeating. Go into your settings and set your key repeat rate to fast and delay until repeat to short. This makes moving around in Neovim feel way
					snappier.
				</p>
			</div>

			{/* ── Terminal Configuration ── */}
			<h2 className="text-xl md:text-2xl font-semibold">My Terminal Configuration</h2>
			<p>
				I&#39;m on a Mac, so some of this might differ if you&#39;re on Linux or Windows. Adjust accordingly.
			</p>

			<p>
				If you have not already, install <strong>Homebrew</strong>. It's the package manager for macOS
				and we&#39;ll be using it for basically everything.
			</p>
			<Terminal command={`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`} />

			<h3 className="text-lg md:text-xl font-semibold">Ghostty</h3>
			<p>
				For my terminal emulator I use <strong>Ghostty</strong> which I STRONGLY recommend. It&#39;s GPU-accelerated, very fast,
				and has a very simgple config file. It also
				has native macOS rendering so everything looks clean.
			</p>
			<Terminal command="brew install --cask ghostty" />

			<h3 className="text-lg md:text-xl font-semibold">Nerd Font</h3>
			<p>
				Most terminal tools expect a Nerd Font for icons to render properly. Let&#39;s install it. 
			
			</p>
			<Terminal command="brew install --cask font-jetbrains-mono-nerd-font" />

			<h3 className="text-lg md:text-xl font-semibold">Starship</h3>
			<p>
				A <strong>prompt</strong> is the bit of text that shows up before your cursor in the terminal,
				things like your current directory, git branch, etc. Starship is a cross-shell prompt
				that&#39;s fast, customizable, and looks great out of the box.
			</p>
			<Terminal command="brew install starship" />

			<h3 className="text-lg md:text-xl font-semibold">Ghostty Config</h3>
			<p>
				Open Ghostty and hit <code className={codeCls}>⌘</code> + <code className={codeCls}>,</code> to
				open the config file. Paste this in:
			</p>
			<Terminal command={ghosttyConfig} multiline />
			<p>Quick breakdown:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li><strong>Theme</strong> Catppuccin Mocha, my personal favorite. Warm, easy on the eyes.</li>
				<li><strong>Font</strong> JetBrains Mono Nerd Font at size 14. The Nerd Font variant gives us all the icons.</li>
				<li><strong>Window</strong> transparent titlebar, slight padding, and a subtle blur + transparency.</li>
				<li><strong>Cursor</strong> bar style with blink.</li>
				<li><strong>Scrollback</strong> 10k lines so you can scroll way back.</li>
				<li><strong>Shell integration</strong> hooks into zsh for nicer prompt/scrollback behavior.</li>
				<li><strong>Mouse &amp; clipboard</strong> hide cursor while typing, and copy-on-select so you can highlight and paste without extra steps.</li>
			</ul>

			<h3 className="text-lg md:text-xl font-semibold">Shell Tools</h3>
			<p>
				These are the CLI tools that make the terminal actually enjoyable to use. Install them all in one go:
			</p>
			<Terminal command="brew install starship zoxide fzf thefuck eza bat git-delta zsh-autosuggestions zsh-syntax-highlighting" />

			<p>
				Now we need to add some config to your <code className={codeCls}>~/.zshrc</code>.
				If you&#39;re wondering, <strong>Zsh</strong> is the shell that runs in your terminal (it&#39;s
				been the default on macOS since Catalina), and <code className={codeCls}>.zshrc</code> is
				its config file.
			</p>
			<p>Add this to yours:</p>
			<Terminal command={zshConfig} multiline />

			<p>What each of these does:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li><strong>Starship</strong> the pretty prompt we installed earlier.</li>
				<li><strong>Zoxide</strong> a smarter <code className={codeCls}>cd</code> that learns your most visited directories. Just type <code className={codeCls}>z projects</code> and it knows where to go.</li>
				<li><strong>fzf</strong> fuzzy finder. <code className={codeCls}>Ctrl+R</code> for fuzzy history search, <code className={codeCls}>Ctrl+T</code> for file search. Life changing.</li>
				<li><strong>thefuck</strong> when you mistype a command, just type <code className={codeCls}>fuck</code> and it corrects it. Yes, really.</li>
				<li><strong>eza</strong> <code className={codeCls}>ls</code> but with icons, colors, and git status.</li>
				<li><strong>bat</strong> <code className={codeCls}>cat</code> but with syntax highlighting and line numbers.</li>
				<li><strong>git-delta</strong> makes your git diffs actually readable with side-by-side view and syntax highlighting.</li>
				<li><strong>zsh-autosuggestions</strong> suggests commands as you type based on your history. Accept with the right arrow key.</li>
				<li><strong>zsh-syntax-highlighting</strong> colors your commands as you type so you can spot typos before hitting enter.</li>
			</ul>

			<h3 className="text-lg md:text-xl font-semibold">Starship Theme</h3>
			<p>
				We&#39;ve already set Ghostty to Catppuccin Mocha, so let&#39;s match the prompt. One command:
			</p>
			<Terminal command="starship preset catppuccin-powerline -o ~/.config/starship.toml" />

			<p>And that&#39;s it, your terminal should be looking all pretty now.</p>

			<Image
				src="/terminal-prompt.png"
				alt="Starship prompt with Catppuccin theme"
				width={2038}
				height={128}
				className="rounded-md w-full"
			/>

			<p>
				If you&#39;re only here for the terminal setup, you can stop here. But, if you want to
				turn Neovim into a full development environment, keep reading.
			</p>

			<NeovimSetupSection />
		</div>
	);
}
