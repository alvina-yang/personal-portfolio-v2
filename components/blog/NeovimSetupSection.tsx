"use client";

import Image from "next/image";
import Terminal from "@/components/blog/Terminal";
import CodeBlock from "@/components/blog/CodeBlock";

const codeCls = "rounded bg-[#f4f2ec] dark:bg-[#181818] px-1.5 py-0.5";
const tipBoxCls = "border-l-2 border-[#c0bdb5] dark:border-[#3a3a3a] pl-6 py-4 bg-[#f4f2ec]/70 dark:bg-[#181818]/80 rounded-r-md";

/* ─── Config file contents ─── */

const initLua = `-- Leader key (must be set before lazy.nvim)
vim.g.mapleader = " "

-- Basic options
vim.opt.termguicolors = true
vim.opt.guicursor = "n-v-c-sm:block-blinkwait300-blinkon200-blinkoff150,i-ci-ve:ver25-blinkwait300-blinkon200-blinkoff150,r-cr-o:hor20-blinkwait300-blinkon200-blinkoff150"
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.timeoutlen = 300
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.softtabstop = 2
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.wrap = false
vim.opt.scrolloff = 8
vim.opt.signcolumn = "yes"
vim.opt.cursorline = true

-- Autosave when leaving insert mode or losing focus
vim.api.nvim_create_autocmd({ "InsertLeave", "FocusLost", "BufLeave" }, {
  callback = function()
    local buf = vim.api.nvim_get_current_buf()
    if vim.bo[buf].modified and vim.bo[buf].modifiable and vim.bo[buf].buftype == "" and vim.fn.expand("%") ~= "" then
      vim.cmd("silent! write")
    end
  end,
})

-- Disable netrw (using nvim-tree instead)
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

-- Git-blame: show in statusline, not inline
vim.g.gitblame_display_virtual_text = 0

-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Load plugins from lua/plugins/
require("lazy").setup("plugins")

-- Diagnostics
require("config.diagnostics")

-- Keymaps
require("config.keymaps")`;

const colorschemeLua = `return {
  {
    "catppuccin/nvim",
    name = "catppuccin",
    lazy = false,
    priority = 1000,
    config = function()
      require("catppuccin").setup({
        flavour = "mocha",
        integrations = {
          alpha = true,
          gitsigns = true,
          nvimtree = true,
          telescope = { enabled = true },
          treesitter = true,
          notify = true,
          noice = true,
          which_key = true,
          flash = true,
          indent_blankline = { enabled = true },
          native_lsp = {
            enabled = true,
            underlines = {
              errors = { "undercurl" },
              warnings = { "undercurl" },
            },
          },
        },
      })
      vim.cmd("colorscheme catppuccin-mocha")
    end,
  },
  { "nvim-tree/nvim-web-devicons", opts = {} },
  { "folke/tokyonight.nvim", lazy = true, priority = 1000 },
  { "rebelot/kanagawa.nvim", lazy = true, priority = 1000 },
  { "EdenEast/nightfox.nvim", lazy = true, priority = 1000 },
}`;

const nvimTreeLua = `return {
  "nvim-tree/nvim-tree.lua",
  dependencies = "nvim-tree/nvim-web-devicons",
  lazy = false,
  keys = {
    { "<leader>e", "<cmd>NvimTreeToggle<cr>", desc = "Toggle file explorer" },
  },
  config = function()
    -- Close any conflicting NvimTree buffers before setup
    for _, buf in ipairs(vim.api.nvim_list_bufs()) do
      local name = vim.api.nvim_buf_get_name(buf)
      if name:match("NvimTree_") then
        vim.api.nvim_buf_delete(buf, { force = true })
      end
    end

    require("nvim-tree").setup({
      view = { width = 35, relativenumber = true },
      renderer = {
        highlight_git = "name",
        indent_markers = { enable = true },
        icons = {
          git_placement = "after",
          show = { git = true },
          glyphs = {
            folder = { arrow_closed = "", arrow_open = "" },
            git = {
              unstaged = "", staged = "", unmerged = "",
              renamed = "➜", untracked = "★", deleted = "", ignored = "◌",
            },
          },
        },
      },
      actions = { open_file = { window_picker = { enable = false } } },
      filters = { custom = { ".DS_Store" } },
      git = { ignore = false },
    })

    -- Git colors in NvimTree
    vim.api.nvim_set_hl(0, "NvimTreeGitIgnored", { fg = "#6b727f", italic = true })
    vim.api.nvim_set_hl(0, "NvimTreeGitNew", { fg = "#73daca" })
    vim.api.nvim_set_hl(0, "NvimTreeGitDirty", { fg = "#e0af68" })
    vim.api.nvim_set_hl(0, "NvimTreeGitStaged", { fg = "#9ece6a" })
    vim.api.nvim_set_hl(0, "NvimTreeGitDeleted", { fg = "#f7768e" })
  end,
}`;

const telescopeLua = `return {
  "nvim-telescope/telescope.nvim",
  dependencies = {
    "nvim-lua/plenary.nvim",
    { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    "nvim-tree/nvim-web-devicons",
    "folke/todo-comments.nvim",
    "ahmedkhalf/project.nvim",
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")

    telescope.setup({
      defaults = {
        path_display = { "smart" },
        mappings = {
          i = {
            ["<C-k>"] = actions.move_selection_previous,
            ["<C-j>"] = actions.move_selection_next,
            ["<C-q>"] = actions.send_selected_to_qflist + actions.open_qflist,
          },
        },
      },
    })

    telescope.load_extension("fzf")
    telescope.load_extension("projects")

    vim.keymap.set("n", "<leader>fp", "<cmd>Telescope projects<cr>", { desc = "Find projects" })
    vim.keymap.set("n", "<leader>ff", "<cmd>Telescope find_files<cr>", { desc = "Fuzzy find files in cwd" })
    vim.keymap.set("n", "<leader>fr", "<cmd>Telescope oldfiles<cr>", { desc = "Fuzzy find recent files" })
    vim.keymap.set("n", "<leader>fg", "<cmd>Telescope live_grep<cr>", { desc = "Find string in cwd" })
    vim.keymap.set("n", "<leader>fc", "<cmd>Telescope grep_string<cr>", { desc = "Find string under cursor in cwd" })
    vim.keymap.set("n", "<leader>ft", "<cmd>TodoTelescope<cr>", { desc = "Find todos" })
    vim.keymap.set("n", "<leader>gc", "<cmd>Telescope git_commits<cr>", { desc = "Git commits" })
    vim.keymap.set("n", "<leader>gb", "<cmd>Telescope git_branches<cr>", { desc = "Git branches" })
  end,
}`;

const treesitterLua = `return {
  "nvim-treesitter/nvim-treesitter",
  event = { "BufReadPre", "BufNewFile" },
  build = ":TSUpdate",
  dependencies = { "windwp/nvim-ts-autotag" },
  config = function()
    local ok, configs = pcall(require, "nvim-treesitter.configs")
    if ok then
      configs.setup({
        highlight = { enable = true },
        indent = { enable = true },
        autotag = { enable = true },
        ensure_installed = {
          "json", "javascript", "typescript", "tsx", "yaml", "html", "css",
          "markdown", "markdown_inline", "bash", "lua", "vim", "vimdoc",
          "python", "ruby", "toml", "c", "query", "dockerfile", "gitignore",
        },
        incremental_selection = {
          enable = true,
          keymaps = {
            init_selection = "<C-space>",
            node_incremental = "<C-space>",
            scope_incremental = false,
            node_decremental = "<bs>",
          },
        },
      })
    else
      require("nvim-treesitter").setup({
        ensure_installed = {
          "json", "javascript", "typescript", "tsx", "yaml", "html", "css",
          "markdown", "markdown_inline", "bash", "lua", "vim", "vimdoc",
          "python", "ruby", "toml", "c", "query", "dockerfile", "gitignore",
        },
        auto_install = true,
      })
    end
  end,
}`;

const editorLua = `return {
  -- Autopairs
  {
    "windwp/nvim-autopairs",
    event = "InsertEnter",
    config = function()
      require("nvim-autopairs").setup({})
    end,
  },

  -- Color highlighter
  {
    "brenoprata10/nvim-highlight-colors",
    event = "BufReadPre",
    config = function()
      require("nvim-highlight-colors").setup({
        render = "background",
        enable_named_colors = true,
        enable_tailwind = true,
      })
    end,
  },

  -- Comments (with tsx/jsx/svelte/html support)
  {
    "numToStr/Comment.nvim",
    event = { "BufReadPre", "BufNewFile" },
    dependencies = { "JoosepAlviste/nvim-ts-context-commentstring" },
    config = function()
      local ts_context_commentstring = require("ts_context_commentstring.integrations.comment_nvim")
      require("Comment").setup({
        pre_hook = ts_context_commentstring.create_pre_hook(),
      })
    end,
  },

  -- Todo comments
  {
    "folke/todo-comments.nvim",
    event = { "BufReadPre", "BufNewFile" },
    dependencies = { "nvim-lua/plenary.nvim" },
    config = function()
      local todo_comments = require("todo-comments")
      vim.keymap.set("n", "]t", function() todo_comments.jump_next() end, { desc = "Next todo comment" })
      vim.keymap.set("n", "[t", function() todo_comments.jump_prev() end, { desc = "Previous todo comment" })
      todo_comments.setup()
    end,
  },

  -- Surround
  {
    "kylechui/nvim-surround",
    event = "BufReadPre",
    config = function()
      require("nvim-surround").setup()
    end,
  },

  -- Indent guides
  {
    "lukas-reineke/indent-blankline.nvim",
    main = "ibl",
    event = "BufReadPost",
    config = function()
      require("ibl").setup()
    end,
  },

  -- Flash: jump anywhere on screen
  {
    "folke/flash.nvim",
    event = "VeryLazy",
    keys = {
      { "s", function() require("flash").jump() end, mode = { "n", "x", "o" }, desc = "Flash jump" },
      { "S", function() require("flash").treesitter() end, mode = { "n", "x", "o" }, desc = "Flash treesitter select" },
    },
    config = function()
      require("flash").setup()
    end,
  },

  -- Illuminate: highlight word under cursor
  {
    "RRethy/vim-illuminate",
    event = "BufReadPost",
    config = function()
      require("illuminate").configure({
        delay = 200,
        filetypes_denylist = { "NvimTree", "alpha", "TelescopePrompt" },
      })
      vim.keymap.set("n", "]]", function() require("illuminate").goto_next_reference() end, { desc = "Next reference" })
      vim.keymap.set("n", "[[", function() require("illuminate").goto_prev_reference() end, { desc = "Previous reference" })
    end,
  },
}`;

const lspLua = `return {
  -- LSP
  {
    "neovim/nvim-lspconfig",
    event = "BufReadPre",
    dependencies = {
      "williamboman/mason.nvim",
      "williamboman/mason-lspconfig.nvim",
    },
    config = function()
      require("mason").setup()
      local lspconfig = require("lspconfig")
      local on_attach = function(_, bufnr)
        local map = function(keys, func, desc)
          vim.keymap.set("n", keys, func, { buffer = bufnr, desc = desc })
        end
        map("gd", vim.lsp.buf.definition, "Go to definition")
        map("gr", vim.lsp.buf.references, "References")
        map("K", vim.lsp.buf.hover, "Hover docs")
        map("<leader>rn", vim.lsp.buf.rename, "Rename symbol")
        map("[d", vim.diagnostic.goto_prev, "Previous diagnostic")
        map("]d", vim.diagnostic.goto_next, "Next diagnostic")
        map("<leader>d", vim.diagnostic.open_float, "Show diagnostic message")
        map("<leader>q", vim.diagnostic.setloclist, "Diagnostic list")
        map("<leader>ca", vim.lsp.buf.code_action, "Code action")
      end

      require("mason-lspconfig").setup({
        ensure_installed = { "lua_ls", "pyright" },
        handlers = {
          function(server_name)
            lspconfig[server_name].setup({ on_attach = on_attach })
          end,
          ["lua_ls"] = function()
            lspconfig.lua_ls.setup({
              on_attach = on_attach,
              settings = { Lua = { diagnostics = { globals = { "vim" } } } },
            })
          end,
          ["pyright"] = function()
            lspconfig.pyright.setup({ on_attach = on_attach })
          end,
        },
      })
    end,
  },

  -- Autocompletion
  {
    "hrsh7th/nvim-cmp",
    event = "InsertEnter",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "L3MON4D3/LuaSnip",
      "saadparwaiz1/cmp_luasnip",
    },
    config = function()
      local cmp = require("cmp")
      local luasnip = require("luasnip")
      cmp.setup({
        snippet = {
          expand = function(args) luasnip.lsp_expand(args.body) end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<C-b>"] = cmp.mapping.scroll_docs(-4),
          ["<C-f>"] = cmp.mapping.scroll_docs(4),
          ["<C-Space>"] = cmp.mapping.complete(),
          ["<C-e>"] = cmp.mapping.abort(),
          ["<CR>"] = cmp.mapping.confirm({ select = true }),
          ["<Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_next_item()
            elseif luasnip.expand_or_jumpable() then
              luasnip.expand_or_jump()
            else
              fallback()
            end
          end, { "i", "s" }),
          ["<S-Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_prev_item()
            elseif luasnip.jumpable(-1) then
              luasnip.jump(-1)
            else
              fallback()
            end
          end, { "i", "s" }),
        }),
        sources = cmp.config.sources({
          { name = "nvim_lsp" },
          { name = "luasnip" },
        }, {
          { name = "buffer" },
          { name = "path" },
        }),
      })
    end,
  },

  -- Trouble: diagnostic panel
  {
    "folke/trouble.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    cmd = "Trouble",
    keys = {
      { "<leader>xx", "<cmd>Trouble diagnostics toggle<cr>", desc = "Diagnostics (Trouble)" },
      { "<leader>xd", "<cmd>Trouble diagnostics toggle filter.buf=0<cr>", desc = "Buffer diagnostics (Trouble)" },
    },
    config = function()
      require("trouble").setup()
    end,
  },

  -- LSP progress in statusline
  {
    "linrongbin16/lsp-progress.nvim",
    event = "BufReadPre",
    config = function()
      require("lsp-progress").setup()
    end,
  },
}`;

const lualineLua = `return {
  "nvim-lualine/lualine.nvim",
  dependencies = { "nvim-tree/nvim-web-devicons" },
  event = "VimEnter",
  config = function()
    local lazy_status = require("lazy.status")

    require("lualine").setup({
      options = { theme = "catppuccin" },
      sections = {
        lualine_a = { "mode" },
        lualine_b = {
          {
            "branch",
            icon = "",
            fmt = function(str)
              if str == "" or str == nil or str == ".invalid" or str:match("^%.") then
                local handle = io.popen("git rev-parse --abbrev-ref HEAD 2>/dev/null")
                if handle then
                  local result = handle:read("*a"):gsub("%s+$", "")
                  handle:close()
                  if result ~= "" then return result end
                end
              end
              return str
            end,
          },
          "diff",
          "diagnostics",
        },
        lualine_c = { "filename" },
        lualine_x = {
          {
            function() return require("lsp-progress").progress() end,
          },
          {
            lazy_status.updates,
            cond = lazy_status.has_updates,
            color = { fg = "#ff9e64" },
          },
          { "encoding" },
          { "fileformat" },
          { "filetype" },
        },
        lualine_y = { "progress" },
        lualine_z = { "location" },
      },
    })
  end,
}`;

const uiLua = `return {
  -- Bufferline (tabs)
  {
    "akinsho/bufferline.nvim",
    version = "*",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    event = "VimEnter",
    config = function()
      require("bufferline").setup({
        options = {
          mode = "buffers",
          diagnostics = "nvim_lsp",
          offsets = {
            { filetype = "NvimTree", text = "File Explorer", highlight = "Directory" },
          },
          show_close_icon = false,
          separator_style = "slant",
        },
      })
    end,
  },

  -- Noice: modern command line and popups
  {
    "folke/noice.nvim",
    event = "VeryLazy",
    dependencies = { "MunifTanjim/nui.nvim", "rcarriga/nvim-notify" },
    config = function()
      require("noice").setup({
        lsp = {
          override = {
            ["vim.lsp.util.convert_input_to_markdown_lines"] = true,
            ["vim.lsp.util.stylize_markdown"] = true,
            ["cmp.entry.get_documentation"] = true,
          },
        },
        presets = {
          bottom_search = true,
          command_palette = true,
          long_message_to_split = true,
          inc_rename = false,
          lsp_doc_border = false,
        },
      })
      vim.keymap.set("n", "<leader>nd", "<cmd>NoiceDismiss<cr>", { desc = "Dismiss notifications" })
      vim.keymap.set("n", "<leader>nm", "<cmd>Noice history<cr>", { desc = "Message history" })
      vim.keymap.set("n", "<leader>nl", "<cmd>Noice last<cr>", { desc = "Last message" })
    end,
  },

  -- Notifications
  {
    "rcarriga/nvim-notify",
    config = function()
      local notify = require("notify")
      notify.setup({
        background_colour = "#000000",
        stages = "fade_in_slide_out",
        timeout = 3000,
        level = vim.log.levels.ERROR,
        max_height = function() return math.floor(vim.o.lines * 0.75) end,
        max_width = function() return math.floor(vim.o.columns * 0.75) end,
      })
      vim.notify = notify
      require("telescope").load_extension("notify")
      vim.keymap.set("n", "<leader>nn", "<cmd>Telescope notify<cr>", { desc = "Search notifications" })
    end,
  },

  -- Breadcrumbs (LSP-powered code location bar)
  {
    "SmiteshP/nvim-navic",
    lazy = true,
    opts = { lsp = { auto_attach = true }, highlight = true },
  },
  {
    "utilyre/barbecue.nvim",
    name = "barbecue",
    version = "*",
    dependencies = { "SmiteshP/nvim-navic", "nvim-tree/nvim-web-devicons" },
    event = "LspAttach",
    opts = {},
  },

  -- Incline: floating filename labels on splits
  {
    "b0o/incline.nvim",
    event = "BufReadPre",
    config = function()
      require("incline").setup({
        window = {
          padding = 0,
          margin = { horizontal = 0 },
        },
        render = function(props)
          local filename = vim.fn.fnamemodify(vim.api.nvim_buf_get_name(props.buf), ":t")
          if filename == "" then filename = "[No Name]" end
          local ft_icon, ft_color = require("nvim-web-devicons").get_icon_color(filename)
          local modified = vim.bo[props.buf].modified
          return {
            ft_icon and { " ", ft_icon, " ", guifg = ft_color } or "",
            " ",
            { filename, gui = modified and "bold,italic" or "bold" },
            " ",
          }
        end,
      })
    end,
  },

  -- Dressing: prettier input/select dialogs
  {
    "stevearc/dressing.nvim",
    event = "VeryLazy",
    config = function()
      require("dressing").setup()
    end,
  },

  -- Which-key
  {
    "folke/which-key.nvim",
    event = "VeryLazy",
    config = function()
      require("which-key").setup()
    end,
  },
}`;

const gitLua = `return {
  -- Git blame
  {
    "f-person/git-blame.nvim",
    lazy = false,
    config = function()
      require("gitblame").setup({ enabled = true })
    end,
  },

  -- LazyGit
  {
    "kdheepak/lazygit.nvim",
    cmd = { "LazyGit", "LazyGitConfig", "LazyGitCurrentFile", "LazyGitFilter", "LazyGitFilterCurrentFile" },
    dependencies = { "nvim-lua/plenary.nvim" },
    keys = {
      { "<leader>lg", "<cmd>LazyGit<cr>", desc = "LazyGit" },
    },
  },

  -- Gitsigns: inline diff markers in the gutter
  {
    "lewis6991/gitsigns.nvim",
    event = "BufReadPre",
    config = function()
      require("gitsigns").setup({
        signs = {
          add = { text = "+" },
          change = { text = "~" },
          delete = { text = "_" },
          topdelete = { text = "‾" },
          changedelete = { text = "~" },
        },
        on_attach = function(bufnr)
          local gs = package.loaded.gitsigns
          local map = function(keys, func, desc)
            vim.keymap.set("n", keys, func, { buffer = bufnr, desc = desc })
          end
          map("]h", gs.next_hunk, "Next hunk")
          map("[h", gs.prev_hunk, "Previous hunk")
          map("<leader>hp", gs.preview_hunk, "Preview hunk")
          map("<leader>hr", gs.reset_hunk, "Reset hunk")
        end,
      })
    end,
  },

  -- Diffview: side-by-side git diff viewer
  {
    "sindrets/diffview.nvim",
    cmd = { "DiffviewOpen", "DiffviewFileHistory" },
    keys = {
      { "<leader>gd", "<cmd>DiffviewOpen<cr>", desc = "Git diff view" },
      { "<leader>gh", "<cmd>DiffviewFileHistory %<cr>", desc = "File git history" },
      { "<leader>gH", "<cmd>DiffviewFileHistory<cr>", desc = "Branch git history" },
      { "<leader>gq", "<cmd>DiffviewClose<cr>", desc = "Close diff view" },
    },
    config = function()
      require("diffview").setup()
    end,
  },
}`;

const alphaLua = `return {
  {
    "ahmedkhalf/project.nvim",
    config = function()
      require("project_nvim").setup({
        manual_mode = true,
        detection_methods = { "pattern", "lsp" },
        patterns = { ".git", "Makefile", "package.json", "Cargo.toml", "go.mod", ".project_root" },
        silent_chdir = true,
      })
    end,
  },
  {
    "goolord/alpha-nvim",
    event = "VimEnter",
    dependencies = { "ahmedkhalf/project.nvim" },
    config = function()
      local alpha = require("alpha")
      local theta = require("alpha.themes.theta")
      local dashboard = require("alpha.themes.dashboard")

      -- Header
      local header = {
        type = "text",
        val = {
          "                                                   ",
          "                                              ___  ",
          "                                           ,o88888 ",
          "                                        ,o8888888' ",
          "                  ,:o:o:oooo.        ,8O88Pd8888\\"  ",
          "              ,.::.::o:ooooOoOoO. ,oO8O8Pd888'\\"    ",
          "            ,.:.::o:ooOoOoOO8O8OOo.8OOPd8O8O\\"      ",
          "           , ..:.::o:ooOoOOOO8OOOOo.FdO8O8\\"        ",
          "          , ..:.::o:ooOoOO8O888O8O,COCOO\\"          ",
          "         , . ..:.::o:ooOoOOOO8OOOOCOCO\\"            ",
          "          . ..:.::o:ooOoOoOO8O8OCCCC\\"o             ",
          "             . ..:.::o:ooooOoCoCCC\\"o:o             ",
          "             . ..:.::o:o:,cooooCo\\"oo:o:            ",
          "          \`   . . ..:.:cocoooo\\"'o:o:::'            ",
          "          .\`   . ..::ccccoc\\"'o:o:o:::'             ",
          "         :.:.    ,c:cccc\\"':.:.:.:.:.'              ",
          "       ..:.:'\`::::c:\\"\\''..:.:.:.:.:.'               ",
          "     ...:.'.:.::::\\"\\'    . . . . .'                 ",
          "    .. . ....:.\\"\\'  \`   .  . . ''                    ",
          "  . . . ....\\"\\'                                     ",
          "  .. . .\\"\\'                                         ",
          " .                                                 ",
          "",
        },
        opts = { hl = "AlphaHeader", position = "center" },
      }

      -- (two-column layout with actions + recent projects)
      -- ... full dashboard config ...

      alpha.setup(config)
    end,
  },
}`;

const sessionLua = `return {
  "rmagatti/auto-session",
  config = function()
    require("auto-session").setup({
      auto_restore_enabled = false,
      auto_save_enabled = false,
      auto_session_suppress_dirs = { "~/", "~/Dev/", "~/Downloads", "~/Documents", "~/Desktop/" },
    })
    vim.keymap.set("n", "<leader>wr", "<cmd>AutoSession restore<CR>", { desc = "Restore session for cwd" })
    vim.keymap.set("n", "<leader>ws", "<cmd>AutoSession save<CR>", { desc = "Save session for auto session root dir" })
  end,
}`;

const toolsLua = `return {
  -- Oil: edit filesystem like a buffer
  {
    "stevearc/oil.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    keys = {
      { "<leader>o", "<cmd>Oil<cr>", desc = "Open Oil file manager" },
    },
    config = function()
      require("oil").setup({ view_options = { show_hidden = true } })
    end,
  },

  -- Markdown preview
  {
    "iamcco/markdown-preview.nvim",
    cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
    ft = { "markdown" },
    build = "cd app && npm install",
    keys = {
      { "<leader>mp", "<cmd>MarkdownPreviewToggle<cr>", desc = "Toggle markdown preview" },
    },
  },
}`;

const keymapsLua = `-- Split navigation
vim.keymap.set("n", "<C-h>", "<C-w>h", { silent = true })
vim.keymap.set("n", "<C-j>", "<C-w>j", { silent = true })
vim.keymap.set("n", "<C-k>", "<C-w>k", { silent = true })
vim.keymap.set("n", "<C-l>", "<C-w>l", { silent = true })

-- Splits (using <leader>s prefix to avoid conflicts)
vim.keymap.set("n", "<leader>sv", "<cmd>vsplit<cr>", { desc = "Split right", silent = true })
vim.keymap.set("n", "<leader>sh", "<cmd>split<cr>", { desc = "Split below", silent = true })
vim.keymap.set("n", "<leader>sc", "<cmd>close<cr>", { desc = "Close split", silent = true })

-- Buffers (tabs)
vim.keymap.set("n", "<Tab>", "<cmd>BufferLineCycleNext<cr>", { desc = "Next tab", silent = true })
vim.keymap.set("n", "<S-Tab>", "<cmd>BufferLineCyclePrev<cr>", { desc = "Previous tab", silent = true })
vim.keymap.set("n", "<leader>c", function()
  local buf = vim.api.nvim_get_current_buf()
  vim.cmd("BufferLineCyclePrev")
  vim.cmd("bdelete! " .. buf)
end, { desc = "Close tab", silent = true })

-- Clipboard: always yank to system clipboard
vim.keymap.set("n", "y", '"+y', { desc = "Yank to clipboard", silent = true })
vim.keymap.set("v", "y", '"+y', { desc = "Yank to clipboard", silent = true })
vim.keymap.set("n", "Y", '"+Y', { desc = "Yank line to clipboard", silent = true })
vim.keymap.set("n", "p", '"+p', { desc = "Paste from clipboard", silent = true })
vim.keymap.set("n", "P", '"+P', { desc = "Paste from clipboard before", silent = true })
vim.keymap.set("v", "p", '"+p', { desc = "Paste from clipboard", silent = true })

-- Clipboard (Cmd+C / Cmd+V for GUI/terminals that support it)
vim.keymap.set("n", "<D-c>", '"+y', { desc = "Copy to clipboard", silent = true })
vim.keymap.set("v", "<D-c>", '"+y', { desc = "Copy to clipboard", silent = true })
vim.keymap.set("n", "<D-v>", '"+p', { desc = "Paste from clipboard", silent = true })
vim.keymap.set("i", "<D-v>", "<C-r>+", { desc = "Paste from clipboard", silent = true })
vim.keymap.set("t", "<D-v>", function()
  local clipboard = vim.fn.getreg("+")
  vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(clipboard, true, true, true), "t", false)
end, { desc = "Paste from clipboard", silent = true })

-- Format
vim.keymap.set("n", "<leader>lf", function() vim.lsp.buf.format({ async = true }) end, { desc = "Format file", silent = true })
vim.keymap.set("v", "<leader>lf", function() vim.lsp.buf.format({ async = true }) end, { desc = "Format selection", silent = true })

-- Terminal
vim.keymap.set("n", "<leader>th", "<cmd>belowright split | terminal<cr>", { desc = "Terminal below", silent = true })
vim.keymap.set("n", "<leader>tv", "<cmd>belowright vsplit | terminal<cr>", { desc = "Terminal right", silent = true })
vim.keymap.set("t", "<Esc>", "<Esc>", { silent = true })
vim.keymap.set("t", "<C-n>", [[<C-\\><C-n>]], { silent = true })
vim.keymap.set("t", "<C-h>", [[<C-\\><C-n><C-w>h]], { silent = true })
vim.keymap.set("t", "<C-j>", [[<C-\\><C-n><C-w>j]], { silent = true })
vim.keymap.set("t", "<C-k>", [[<C-\\><C-n><C-w>k]], { silent = true })
vim.keymap.set("t", "<C-l>", [[<C-\\><C-n><C-w>l]], { silent = true })`;

const diagnosticsLua = `-- Diagnostic signs in the gutter
local signs = { Error = " ", Warn = " ", Hint = "󰠠 ", Info = " " }
for type, icon in pairs(signs) do
  local hl = "DiagnosticSign" .. type
  vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = "" })
end

-- Inline virtual text and floating windows
vim.diagnostic.config({
  virtual_text = { prefix = "●" },
  signs = true,
  underlines = true,
  update_in_insert = false,
  severity_sort = true,
  float = { border = "rounded", source = true },
})

-- Highlight error/warning lines with a tinted background
vim.api.nvim_set_hl(0, "DiagnosticLineError", { bg = "#2d0000" })
vim.api.nvim_set_hl(0, "DiagnosticLineWarn", { bg = "#2d2600" })

vim.api.nvim_create_autocmd("DiagnosticChanged", {
  callback = function()
    local ns = vim.api.nvim_create_namespace("diagnostic_lines")
    for _, buf in ipairs(vim.api.nvim_list_bufs()) do
      if vim.api.nvim_buf_is_valid(buf) then
        vim.api.nvim_buf_clear_namespace(buf, ns, 0, -1)
      end
    end
    local buf = vim.api.nvim_get_current_buf()
    local diagnostics = vim.diagnostic.get(buf)
    for _, d in ipairs(diagnostics) do
      local hl = d.severity == vim.diagnostic.severity.ERROR and "DiagnosticLineError"
        or d.severity == vim.diagnostic.severity.WARN and "DiagnosticLineWarn"
        or nil
      if hl and d.lnum < vim.api.nvim_buf_line_count(buf) then
        vim.api.nvim_buf_set_extmark(buf, ns, d.lnum, 0, { line_hl_group = hl, priority = 1 })
      end
    end
  end,
})`;

/* ─── Component ─── */

export default function NeovimSetupSection() {
	return (
		<div className="space-y-6">
			{/* ── Intro ── */}
			<h2 className="text-xl md:text-2xl font-semibold">My Neovim Setup</h2>
			<p>
				Neovim is fast, runs entirely in your terminal, and is configured with Lua. The plugin ecosystem is excellent, and once
				you get everything set up, it genuinely feels like a better IDE than most IDEs.
			</p>
			<p>
				All of your Neovim config lives in <code className={codeCls}>~/.config/nvim/</code>.
          Let's go through the entire set up.
			</p>

			{/* ── Install ── */}
			<h3 className="text-lg md:text-xl font-semibold">Install Neovim</h3>
			<p>First, install Neovim itself plus a few dependencies that plugins will need:</p>
			<Terminal command="brew install neovim" />
			<Terminal command="brew install ripgrep fd lazygit btop node npm" />
			<p>
				<strong>ripgrep</strong> and <strong>fd</strong> power Telescope&#39;s file search.{" "}
				<strong>lazygit</strong> is a terminal Git UI. <strong>btop</strong> is a process
				monitor. <strong>node/npm</strong> are needed by some LSP servers and plugins.
			</p>

			{/* ── Directory structure ── */}
			<h3 className="text-lg md:text-xl font-semibold">Directory Structure</h3>
			<p>
				Create this folder layout inside <code className={codeCls}>~/.config/nvim/</code>:
			</p>
			<Terminal
				command={`~/.config/nvim/
├── init.lua
└── lua/
    ├── config/
    │   ├── keymaps.lua
    │   └── diagnostics.lua
    └── plugins/
        ├── colorscheme.lua
        ├── nvim-tree.lua
        ├── telescope.lua
        ├── treesitter.lua
        ├── editor.lua
        ├── lsp.lua
        ├── lualine.lua
        ├── ui.lua
        ├── git.lua
        ├── alpha.lua
        ├── session.lua
        └── tools.lua`}
				multiline
			/>
			<p>
				<code className={codeCls}>init.lua</code> is the entry point. Neovim reads it on
				startup. Everything under <code className={codeCls}>lua/plugins/</code> gets
				auto-discovered by lazy.nvim (the plugin manager), and{" "}
				<code className={codeCls}>lua/config/</code> holds our keymaps and diagnostic settings.
			</p>

			{/* ── init.lua ── */}
			<h3 className="text-lg md:text-xl font-semibold">init.lua, The Entry Point</h3>
			<CodeBlock filename="~/.config/nvim/init.lua" code={initLua} />
			<p>What&#39;s happening here:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<strong>Leader key</strong> set to <code className={codeCls}>Space</code>. This
					is the prefix for most custom keybindings. Must be set before loading plugins.
				</li>
				<li>
					<strong>Basic options</strong> line numbers, relative numbers, 2-space tabs,
					smart indent, no line wrapping, always-visible sign column, cursor line highlight.
				</li>
				<li>
					<strong>Autosave</strong> automatically writes the file when you leave insert
					mode or switch away. You no longer have to write <code className={codeCls}>:w</code> every 5 seconds.
				</li>
				<li>
					<strong>lazy.nvim bootstrap</strong> clones the plugin manager if it&#39;s not
					already installed, then loads all plugin files from{" "}
					<code className={codeCls}>lua/plugins/</code>.
				</li>
			</ul>

			{/* ── Plugin 1: Colorscheme ── */}
			<h3 className="text-lg md:text-xl font-semibold">1. Colorscheme</h3>
			<p>
				First things first, let&#39;s make it look good. Catppuccin Mocha is a warm,
				low-contrast theme with great plugin support.
			</p>
			<CodeBlock filename="lua/plugins/colorscheme.lua" code={colorschemeLua} />
			<p>
				The <code className={codeCls}>integrations</code> table tells Catppuccin to apply
				matching colors to all the other plugins we&#39;ll install. We also keep a few
				alternative themes (<code className={codeCls}>tokyonight</code>,{" "}
				<code className={codeCls}>kanagawa</code>, <code className={codeCls}>nightfox</code>)
				available but lazy-loaded in case you want to switch.{" "}
				<code className={codeCls}>nvim-web-devicons</code> provides the file type icons used
				across the UI.
			</p>

			{/* ── Plugin 2: nvim-tree ── */}
			<h3 className="text-lg md:text-xl font-semibold">2. File Explorer (nvim-tree)</h3>
			<p>
				You need a way to see your project files. nvim-tree gives you a sidebar file
				explorer with git status indicators and icons.
			</p>
			<CodeBlock filename="lua/plugins/nvim-tree.lua" code={nvimTreeLua} />
			<p>
				Toggle it with <code className={codeCls}>Space + e</code>. The tree shows git
				status with colored icons (green for new, yellow for modified, red for deleted).
				Relative line numbers let you jump to files with Vim motions.
			</p>

			{/* ── Plugin 3: Telescope ── */}
			<h3 className="text-lg md:text-xl font-semibold">3. Telescope (Fuzzy Finder)</h3>
			<p>
				Telescope is probably the plugin you&#39;ll use most. It&#39;s a fuzzy finder for
				files, text, git commits, and basically anything.
			</p>
			<CodeBlock filename="lua/plugins/telescope.lua" code={telescopeLua} />
			<p>Key bindings:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li><code className={codeCls}>Space ff</code> find files</li>
				<li><code className={codeCls}>Space fg</code> live grep (search text across all files)</li>
				<li><code className={codeCls}>Space fr</code> recent files</li>
				<li><code className={codeCls}>Space fc</code> search for word under cursor</li>
				<li><code className={codeCls}>Space ft</code> find TODO comments</li>
				<li><code className={codeCls}>Space fp</code> switch between projects</li>
				<li><code className={codeCls}>Space gc</code> browse git commits</li>
				<li><code className={codeCls}>Space gb</code> browse git branches</li>
			</ul>
			<p>
				The <code className={codeCls}>telescope-fzf-native</code> extension makes the
				fuzzy matching significantly faster.
			</p>

			{/* ── Plugin 4: Treesitter ── */}
			<h3 className="text-lg md:text-xl font-semibold">4. Treesitter (Syntax Highlighting)</h3>
			<p>
				Treesitter parses your code into an AST (abstract syntax tree) which gives you
				much better syntax highlighting than regex-based highlighting.
			</p>
			<CodeBlock filename="lua/plugins/treesitter.lua" code={treesitterLua} />
			<p>
				It auto-installs parsers for all the languages listed. The{" "}
				<code className={codeCls}>incremental_selection</code> feature lets you expand your
				selection by AST node with <code className={codeCls}>Ctrl+Space</code>,
				press it repeatedly to select larger and larger chunks of code. The{" "}
				<code className={codeCls}>autotag</code> integration auto-closes and auto-renames
				HTML/JSX tags.
			</p>

			{/* ── Plugin 5: Editor ── */}
			<h3 className="text-lg md:text-xl font-semibold">5. Editor Enhancements</h3>
			<p>
				These are the quality-of-life editing plugins that make writing code feel smooth.
			</p>
			<CodeBlock filename="lua/plugins/editor.lua" code={editorLua} />
			<p>What each plugin does:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<strong>nvim-autopairs</strong> automatically closes brackets, quotes, etc.
				</li>
				<li>
					<strong>nvim-highlight-colors</strong> shows color previews inline for hex
					codes and Tailwind classes.
				</li>
				<li>
					<strong>Comment.nvim</strong> toggle comments with{" "}
					<code className={codeCls}>gcc</code> (line) or{" "}
					<code className={codeCls}>gc</code> (selection). Handles JSX/TSX correctly.
				</li>
				<li>
					<strong>todo-comments</strong> highlights TODO, FIXME, HACK, etc. in your
					code with distinct colors. Jump between them with{" "}
					<code className={codeCls}>]t</code> / <code className={codeCls}>[t</code>.
				</li>
				<li>
					<strong>nvim-surround</strong> add/change/delete surrounding characters.{" "}
					<code className={codeCls}>ysiw&quot;</code> to surround a word with quotes,{" "}
					<code className={codeCls}>cs&quot;&#39;</code> to change quotes, <code className={codeCls}>ds&quot;</code> to
					delete them.
				</li>
				<li>
					<strong>indent-blankline</strong> shows indent guide lines so you can
					visually track scope.
				</li>
				<li>
					<strong>flash.nvim</strong> press <code className={codeCls}>s</code> then
					type a few characters to jump anywhere on screen instantly. Press{" "}
					<code className={codeCls}>S</code> to select by treesitter node.
				</li>
				<li>
					<strong>vim-illuminate</strong> highlights all occurrences of the word under
					your cursor. <code className={codeCls}>]]</code> / <code className={codeCls}>[[</code> to
					jump between them.
				</li>
			</ul>

			{/* ── Plugin 6: LSP ── */}
			<h3 className="text-lg md:text-xl font-semibold">6. LSP (Language Server Protocol)</h3>
			<p>
				This is the big one. LSP is what gives you go-to-definition, autocomplete, inline
				errors, rename-symbol, and code actions, basically everything that makes an editor
				feel like an IDE.
			</p>
			<CodeBlock filename="lua/plugins/lsp.lua" code={lspLua} />
			<p>
				The setup uses three plugins working together:
			</p>
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<strong>mason.nvim</strong> installs and manages LSP servers automatically.
					Run <code className={codeCls}>:Mason</code> to see what&#39;s available.
				</li>
				<li>
					<strong>mason-lspconfig</strong> bridges Mason with nvim-lspconfig so
					servers are configured automatically. It ensures{" "}
					<code className={codeCls}>lua_ls</code> and{" "}
					<code className={codeCls}>pyright</code> are always installed, plus a default
					handler for any others you add.
				</li>
				<li>
					<strong>nvim-cmp</strong> the autocompletion engine. It pulls suggestions
					from the LSP, the current buffer, file paths, and snippets. Use{" "}
					<code className={codeCls}>Tab</code>/<code className={codeCls}>Shift+Tab</code>{" "}
					to cycle through suggestions, <code className={codeCls}>Enter</code> to confirm.
				</li>
				<li>
					<strong>Trouble</strong> a pretty diagnostics panel. Open it with{" "}
					<code className={codeCls}>Space xx</code> to see all errors/warnings across
					your project.
				</li>
			</ul>
			<p>LSP keybindings:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li><code className={codeCls}>gd</code> go to definition</li>
				<li><code className={codeCls}>gr</code> find references</li>
				<li><code className={codeCls}>K</code> hover documentation</li>
				<li><code className={codeCls}>Space rn</code> rename symbol</li>
				<li><code className={codeCls}>Space ca</code> code action</li>
				<li><code className={codeCls}>Space d</code> show diagnostic message</li>
				<li><code className={codeCls}>[d</code> / <code className={codeCls}>]d</code> jump between diagnostics</li>
			</ul>

			<div className={tipBoxCls}>
				<p>
					<strong>Tip:</strong> To add support for more languages, just install the LSP
					server through Mason (<code className={codeCls}>:Mason</code>). The default
					handler will configure it automatically.
				</p>
			</div>

			{/* ── Plugin 7: Lualine ── */}
			<h3 className="text-lg md:text-xl font-semibold">7. Statusline (Lualine)</h3>
			<p>
				Lualine gives you a nice statusline at the bottom showing your current mode, git
				branch, diagnostics, filename, file type, and more.
			</p>
			<CodeBlock filename="lua/plugins/lualine.lua" code={lualineLua} />
			<p>
				It uses the Catppuccin theme to match everything else. The right side shows LSP
				progress (so you can see when a server is loading) and lazy.nvim update
				notifications.
			</p>

			{/* ── Plugin 8: UI ── */}
			<h3 className="text-lg md:text-xl font-semibold">8. UI Enhancements</h3>
			<p>
				These plugins make the overall Neovim UI feel modern and polished.
			</p>
			<CodeBlock filename="lua/plugins/ui.lua" code={uiLua} />
			<p>What each plugin does:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<strong>bufferline</strong> tabs along the top for open buffers. Use{" "}
					<code className={codeCls}>Tab</code>/<code className={codeCls}>Shift+Tab</code>{" "}
					to switch between them, <code className={codeCls}>Space c</code> to close.
				</li>
				<li>
					<strong>noice.nvim</strong> replaces the command line and notification popups
					with modern floating windows. Press <code className={codeCls}>Space nd</code>{" "}
					to dismiss notifications.
				</li>
				<li>
					<strong>nvim-notify</strong> beautiful toast-style notifications with fade
					animations.
				</li>
				<li>
					<strong>barbecue + nvim-navic</strong> breadcrumbs bar at the top showing
					your current code location (e.g. file → class → method).
				</li>
				<li>
					<strong>incline</strong> floating filename labels on each split so you always
					know which file you&#39;re looking at.
				</li>
				<li>
					<strong>dressing.nvim</strong> makes input dialogs (like rename) and select
					menus look nicer.
				</li>
				<li>
					<strong>which-key</strong> shows a popup of available keybindings when you
					start a key sequence. Press <code className={codeCls}>Space</code> and wait to
					see all your options.
				</li>
			</ul>

			{/* ── Plugin 9: Git ── */}
			<h3 className="text-lg md:text-xl font-semibold">9. Git Integration</h3>
			<p>
				Full Git workflow without leaving Neovim.
			</p>
			<CodeBlock filename="lua/plugins/git.lua" code={gitLua} />
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<strong>git-blame</strong> shows who last modified each line in the
					statusline.
				</li>
				<li>
					<strong>lazygit</strong> open a full Git TUI with{" "}
					<code className={codeCls}>Space lg</code>. Stage, commit, push, rebase,
					all from a visual interface.
				</li>
				<li>
					<strong>gitsigns</strong> gutter markers showing added/changed/deleted lines.
					Jump between hunks with <code className={codeCls}>]h</code> /{" "}
					<code className={codeCls}>[h</code>, preview with{" "}
					<code className={codeCls}>Space hp</code>.
				</li>
				<li>
					<strong>diffview</strong> side-by-side diff viewer. Open with{" "}
					<code className={codeCls}>Space gd</code>, view file history with{" "}
					<code className={codeCls}>Space gh</code>.
				</li>
			</ul>

			{/* ── Plugin 10: Alpha ── */}
			<h3 className="text-lg md:text-xl font-semibold">10. Dashboard (Alpha)</h3>
			<p>
				Alpha gives you a start screen when you open Neovim without a file. It shows
				quick-action shortcuts and your recent projects.
			</p>
			<CodeBlock filename="lua/plugins/alpha.lua" code={alphaLua} />
			<p>
				The dashboard has two columns: actions on the left (new file, find file, grep,
				etc.) and recent projects on the right. Press the highlighted key to trigger each
				action. This uses <code className={codeCls}>project.nvim</code> to track your
				project directories automatically. You can add anything you want here really, this is just an example.
			</p>

			<div className={tipBoxCls}>
				<p>
					<strong>Note:</strong> I&#39;ve abbreviated the alpha config here since the
					full two-column layout code is fairly long. The key idea is: project.nvim
					detects your projects, and alpha displays them on the dashboard with keybindings
					to jump to each one.
				</p>
			</div>

			{/* ── Plugin 11: Session ── */}
			<h3 className="text-lg md:text-xl font-semibold">11. Session Management</h3>
			<p>
				auto-session saves and restores your open buffers, splits, and cursor positions
				per project directory.
			</p>
			<CodeBlock filename="lua/plugins/session.lua" code={sessionLua} />
			<ul className="list-disc pl-6 space-y-1">
				<li><code className={codeCls}>Space wr</code> restore the session for the current directory</li>
				<li><code className={codeCls}>Space ws</code> save the current session</li>
			</ul>
			<p>
				I keep auto-restore and auto-save disabled so it doesn&#39;t interfere when I
				open Neovim for a quick edit. You can enable them if you prefer.
			</p>

			{/* ── Plugin 12: Tools ── */}
			<h3 className="text-lg md:text-xl font-semibold">12. Extra Tools</h3>
			<CodeBlock filename="lua/plugins/tools.lua" code={toolsLua} />
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<strong>oil.nvim</strong> lets you edit your filesystem like a buffer. Open
					it with <code className={codeCls}>Space o</code>, rename files by editing
					text, delete by deleting lines.
				</li>
				<li>
					<strong>markdown-preview</strong> live preview of markdown files in your
					browser. Toggle with <code className={codeCls}>Space mp</code>.
				</li>
			</ul>

			{/* ── Core config files ── */}
			<h3 className="text-lg md:text-xl font-semibold">Core Config Files</h3>
			<p>
				These aren&#39;t plugins, they&#39;re plain Lua files that set up keymaps and
				diagnostics.
			</p>

			<h4 className="text-base md:text-lg font-semibold">Keymaps</h4>
			<CodeBlock filename="lua/config/keymaps.lua" code={keymapsLua} />
			<p>Highlights:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<strong>Split navigation</strong> <code className={codeCls}>Ctrl+h/j/k/l</code>{" "}
					to move between splits (works in terminal mode too).
				</li>
				<li>
					<strong>Buffer tabs</strong> <code className={codeCls}>Tab</code> /{" "}
					<code className={codeCls}>Shift+Tab</code> to cycle,{" "}
					<code className={codeCls}>Space c</code> to close.
				</li>
				<li>
					<strong>System clipboard</strong> yank and paste always use the system
					clipboard. No more <code className={codeCls}>&quot;+y</code>.
				</li>
				<li>
					<strong>Format</strong> <code className={codeCls}>Space lf</code> to format
					the current file or selection via LSP.
				</li>
				<li>
					<strong>Terminal</strong> <code className={codeCls}>Space th</code> for a
					horizontal terminal, <code className={codeCls}>Space tv</code> for vertical.
				</li>
			</ul>

			<h4 className="text-base md:text-lg font-semibold">Diagnostics</h4>
			<CodeBlock filename="lua/config/diagnostics.lua" code={diagnosticsLua} />
			<p>
				This sets up custom diagnostic icons in the gutter (with Nerd Font symbols), enables
				inline virtual text with dot prefixes, and adds a tinted background highlight on
				lines with errors (red) or warnings (yellow) so they&#39;re impossible to miss.
			</p>

			{/* ── Closing ── */}
			<h3 className="text-lg md:text-xl font-semibold">That&#39;s It</h3>
			<p>
				You now have a fully configured Neovim setup with LSP, autocompletion, fuzzy
				finding, git integration, and a clean UI.
			</p>
			<p>
				The best part about Neovim is that it&#39;s endlessly customizable. Use this as a
				starting point, poke around, break things, fix them, and do what you want really.
			</p>

			<Image
				src="/neovim-dashboard.png"
				alt="Neovim dashboard with Alpha"
				width={1456}
				height={512}
				className="rounded-md w-full"
			/>
		</div>
	);
}
