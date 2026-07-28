import { create } from 'zustand';

export type ViewMode = 'large-icons' | 'small-icons' | 'list' | 'details';
export type SortBy = 'name' | 'size' | 'type' | 'date';

export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  type: 'recycle-bin' | 'my-computer' | 'my-documents' | 'folder' | 'file' | 'shortcut';
  isEmpty?: boolean;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  target: 'desktop' | 'icon';
  iconId?: string;
}

export interface WindowItem {
  id: string;
  title: string;
  icon: string;
  type: 'my-computer' | 'recycle-bin' | 'notepad' | 'calculator' | 'game' | 'folder' | 'picture-viewer' | 'run' | 'control-panel' | 'minesweeper';
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  currentPath: string;
  fileContent?: string;
  imageSrc?: string;
  gameUrl?: string;
}

export interface FileNode {
  name: string;
  type: 'drive' | 'folder' | 'file';
  icon?: string;
  size?: string;
  modified?: string;
  content?: string;
  imageSrc?: string;
  children?: FileNode[];
}

// Initial Windows XP Filesystem structure
export const INITIAL_FILESYSTEM: FileNode = {
  name: 'My Computer',
  type: 'drive',
  children: [
    {
      name: 'Local Disk (C:)',
      type: 'drive',
      icon: '/assets/images/icons/drive-c.svg',
      size: '40.0 GB',
      children: [
        {
          name: 'WINDOWS',
          type: 'folder',
          modified: '7/27/2006 10:00 AM',
          children: [
            {
              name: 'System32',
              type: 'folder',
              modified: '7/27/2006 10:00 AM',
              children: [
                { name: 'cmd.exe', type: 'file', size: '250 KB', modified: '8/23/2001 12:00 PM', content: 'Microsoft Windows XP [Version 5.1.2600]\n(C) Copyright 1985-2001 Microsoft Corp.\n\nC:\\WINDOWS\\system32>' },
                { name: 'calc.exe', type: 'file', size: '112 KB', modified: '8/23/2001 12:00 PM' },
                { name: 'notepad.exe', type: 'file', size: '68 KB', modified: '8/23/2001 12:00 PM' },
                { name: 'user32.dll', type: 'file', size: '578 KB', modified: '8/23/2001 12:00 PM' }
              ]
            },
            {
              name: 'Media',
              type: 'folder',
              modified: '7/27/2006 10:00 AM',
              children: [
                { name: 'Windows XP Startup.wav', type: 'file', size: '344 KB', modified: '8/23/2001 12:00 PM' },
                { name: 'Windows XP Shutdown.wav', type: 'file', size: '210 KB', modified: '8/23/2001 12:00 PM' }
              ]
            },
            { name: 'explorer.exe', type: 'file', size: '1,032 KB', modified: '8/23/2001 12:00 PM' }
          ]
        },
        {
          name: 'Program Files',
          type: 'folder',
          modified: '7/27/2006 10:00 AM',
          children: [
            {
              name: 'Internet Explorer',
              type: 'folder',
              children: [
                { name: 'iexplore.exe', type: 'file', size: '92 KB', modified: '8/23/2001 12:00 PM' }
              ]
            },
            {
              name: 'Windows Media Player',
              type: 'folder',
              children: [
                { name: 'wmplayer.exe', type: 'file', size: '1,240 KB', modified: '8/23/2001 12:00 PM' }
              ]
            }
          ]
        },
        {
          name: 'Documents and Settings',
          type: 'folder',
          modified: '7/27/2006 10:00 AM',
          children: [
            {
              name: 'User',
              type: 'folder',
              children: [
                {
                  name: 'My Documents',
                  type: 'folder',
                  children: [
                    {
                      name: 'My Pictures',
                      type: 'folder',
                      children: [
                        { name: 'Bliss.jpg', type: 'file', size: '225 KB', imageSrc: '/assets/images/bliss.png', modified: '8/23/2001 12:00 PM' }
                      ]
                    },
                    { name: 'Welcome to Windows XP.txt', type: 'file', size: '2 KB', content: 'Welcome to Microsoft Windows XP!\n\nThank you for exploring this interactive Windows XP website.\n\nFeatures built:\n- Authentic Bliss wallpaper & Luna taskbar\n- Window management with draggable windows\n- Full file manager (My Computer) with directory navigation\n- Start Menu with All Programs\n- Custom right-click context menu\n- Startup sound & classic cursors', modified: '7/27/2006 12:00 PM' },
                    { name: 'Todo.txt', type: 'file', size: '1 KB', content: '1. Play Pinball\n2. Defrag Hard Drive\n3. Customize Desktop theme\n4. Connect to Dial-up Internet', modified: '7/27/2006 01:15 PM' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Local Disk (D:)',
      type: 'drive',
      icon: '/assets/images/icons/drive-c.svg',
      size: '80.0 GB',
      children: [
        {
          name: 'Backups',
          type: 'folder',
          children: [
            { name: 'Backup_2006.zip', type: 'file', size: '4.2 GB', modified: '5/10/2006 08:30 AM' }
          ]
        },
        {
          name: 'Games',
          type: 'folder',
          children: [
            { name: 'Minesweeper.exe', type: 'file', size: '120 KB', modified: '8/23/2001 12:00 PM' },
            { name: 'Solitaire.exe', type: 'file', size: '95 KB', modified: '8/23/2001 12:00 PM' },
            { name: 'Pinball.exe', type: 'file', size: '1,450 KB', modified: '8/23/2001 12:00 PM' }
          ]
        }
      ]
    },
    {
      name: 'Shared Documents',
      type: 'folder',
      icon: '/assets/images/icons/folder.svg',
      children: [
        { name: 'Shared Notes.txt', type: 'file', size: '1 KB', content: 'Shared folder for network users.', modified: '6/12/2006 11:00 AM' }
      ]
    }
  ]
};

interface DesktopState {
  // Boot state
  isBooting: boolean;
  isBootComplete: boolean;
  setBooting: (value: boolean) => void;
  setBootComplete: (value: boolean) => void;

  // Desktop icons
  icons: DesktopIcon[];
  selectedIconId: string | null;
  setIcons: (icons: DesktopIcon[]) => void;
  updateIconPosition: (id: string, x: number, y: number) => void;
  selectIcon: (id: string | null) => void;
  addDesktopIcon: (name: string, type: 'folder' | 'file') => void;

  // View settings
  viewMode: ViewMode;
  sortBy: SortBy;
  showGrid: boolean;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setShowGrid: (show: boolean) => void;

  // Context menu
  contextMenu: ContextMenuState;
  openContextMenu: (x: number, y: number, target: 'desktop' | 'icon', iconId?: string) => void;
  closeContextMenu: () => void;

  // Start menu
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;

  // Clock
  currentTime: Date;
  setCurrentTime: (time: Date) => void;

  // Window Management
  windows: WindowItem[];
  activeWindowId: string | null;
  topZIndex: number;
  openWindow: (
    type: WindowItem['type'],
    title: string,
    icon: string,
    currentPath?: string,
    extra?: { fileContent?: string; imageSrc?: string; gameUrl?: string; width?: number; height?: number; x?: number; y?: number }
  ) => void;
  openRunDialog: () => void;
  openControlPanel: () => void;
  openMinesweeper: () => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowPath: (id: string, path: string) => void;
  minimizeAll: () => void;
  restoreAll: () => void;
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  // Boot state
  isBooting: true,
  isBootComplete: false,
  setBooting: (value) => set({ isBooting: value }),
  setBootComplete: (value) => set({ isBootComplete: value }),

  // Desktop icons
  icons: [
    {
      id: 'my-computer',
      name: 'My Computer',
      icon: '/assets/images/icons/my-computer.svg',
      x: 20,
      y: 20,
      type: 'my-computer',
    },
    {
      id: 'my-documents',
      name: 'My Documents',
      icon: '/assets/images/icons/my-documents.svg',
      x: 20,
      y: 110,
      type: 'my-documents',
    },
    {
      id: 'recycle-bin',
      name: 'Recycle Bin',
      icon: '/assets/images/icons/recycle-bin-empty.svg',
      x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 95) : 900,
      y: typeof window !== 'undefined' ? Math.max(20, window.innerHeight - 130) : 560,
      type: 'recycle-bin',
      isEmpty: true,
    },
    {
      id: 'super-mario',
      name: 'Super Mario Bros',
      icon: '/assets/images/icons/mario.svg',
      x: 20,
      y: 200,
      type: 'shortcut',
    },
    {
      id: 'notepad-shortcut',
      name: 'Notepad',
      icon: '📝',
      x: 20,
      y: 290,
      type: 'shortcut',
    },
{
       id: 'calculator-shortcut',
       name: 'Calculator',
       icon: '🧮',
       x: 20,
       y: 380,
       type: 'shortcut',
     },
     {
       id: 'control-panel-shortcut',
       name: 'Control Panel',
       icon: '/assets/images/icons/control-panel.svg',
       x: 20,
       y: 470,
       type: 'shortcut',
     },
  ],
  selectedIconId: null,
  setIcons: (icons) => set({ icons }),
  updateIconPosition: (id, x, y) =>
    set((state) => ({
      icons: state.icons.map((icon) =>
        icon.id === id ? { ...icon, x, y } : icon
      ),
    })),
  selectIcon: (id) => set({ selectedIconId: id }),
  addDesktopIcon: (name, type) =>
    set((state) => {
      const newId = `desktop-item-${Date.now()}`;
      const iconPath = type === 'folder' ? '/assets/images/icons/folder.svg' : '/assets/images/icons/my-documents.svg';
      const offset = state.icons.length * 10;
      return {
        icons: [
          ...state.icons,
          {
            id: newId,
            name,
            icon: iconPath,
            x: 20 + offset,
            y: 200 + offset,
            type,
          },
        ],
      };
    }),

  // View settings
  viewMode: 'large-icons',
  sortBy: 'name',
  showGrid: true,
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setShowGrid: (show) => set({ showGrid: show }),

  // Context menu
  contextMenu: { isOpen: false, x: 0, y: 0, target: 'desktop' },
  openContextMenu: (x, y, target, iconId) =>
    set({ contextMenu: { isOpen: true, x, y, target, iconId } }),
  closeContextMenu: () =>
    set((state) => ({
      contextMenu: { ...state.contextMenu, isOpen: false },
    })),

  // Start menu
  isStartMenuOpen: false,
  toggleStartMenu: () =>
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  // Clock
  currentTime: new Date(),
  setCurrentTime: (time) => set({ currentTime: time }),

  // Window Management
  windows: [],
  activeWindowId: null,
  topZIndex: 100,

  openRunDialog: () => {
    const { openWindow } = get();
    openWindow('run', 'Run', '🏃', 'run', {
      width: 380,
      height: 160,
      x: typeof window !== 'undefined' ? (window.innerWidth - 380) / 2 : 300,
      y: typeof window !== 'undefined' ? (window.innerHeight - 160) / 2 : 200,
    });
  },

  openControlPanel: () => {
    const { openWindow } = get();
    openWindow('control-panel', 'Control Panel', '/assets/images/icons/control-panel.svg', 'Control Panel');
  },

  openMinesweeper: () => {
    const { openWindow } = get();
    openWindow('minesweeper', 'Minesweeper', '💣', 'minesweeper');
  },

  openWindow: (type, title, icon, currentPath = 'My Computer', extra) => {
    const { windows, topZIndex } = get();
    // Check if window of same type & path already exists (allow multiple notepad/calculator/game)
    const canMulti = type === 'notepad' || type === 'calculator' || type === 'game' || type === 'picture-viewer' || type === 'minesweeper';
    if (!canMulti) {
      const existing = windows.find((w) => w.type === type && w.currentPath === currentPath);
      if (existing) {
        const newZ = topZIndex + 1;
        set({
          windows: windows.map((w) =>
            w.id === existing.id ? { ...w, isMinimized: false, zIndex: newZ } : w
          ),
          activeWindowId: existing.id,
          topZIndex: newZ,
        });
        return;
      }
    }

    const newZ = topZIndex + 1;
    const newId = `window-${type}-${Date.now()}`;
    const initialWidth = type === 'notepad' ? 520 : type === 'calculator' ? 240 : type === 'game' ? 800 : type === 'picture-viewer' ? 600 : type === 'minesweeper' ? 210 : 720;
    const initialHeight = type === 'notepad' ? 380 : type === 'calculator' ? 310 : type === 'game' ? 560 : type === 'picture-viewer' ? 450 : type === 'minesweeper' ? 290 : 480;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

    const posX = Math.max(40, (screenWidth - initialWidth) / 2 + (windows.length % 5) * 20);
    const posY = Math.max(30, (screenHeight - initialHeight) / 2 - 20 + (windows.length % 5) * 20);

    const newWindow: WindowItem = {
      id: newId,
      title,
      icon,
      type,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      x: posX,
      y: posY,
      width: initialWidth,
      height: initialHeight,
      currentPath,
      fileContent: extra?.fileContent,
      imageSrc: extra?.imageSrc,
      gameUrl: extra?.gameUrl,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newId,
      topZIndex: newZ,
      isStartMenuOpen: false,
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const filtered = state.windows.filter((w) => w.id !== id);
      const nextActive = filtered.length > 0 ? filtered[filtered.length - 1].id : null;
      return {
        windows: filtered,
        activeWindowId: nextActive,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)),
    }));
  },

  focusWindow: (id) => {
    const { topZIndex, windows } = get();
    const newZ = topZIndex + 1;
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: newZ } : w)),
      activeWindowId: id,
      topZIndex: newZ,
    });
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  updateWindowPath: (id, path) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, currentPath: path } : w)),
    }));
  },

  minimizeAll: () => {
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, isMinimized: true })),
      activeWindowId: null,
    }));
  },

  restoreAll: () => {
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, isMinimized: false })),
    }));
  },
}));
