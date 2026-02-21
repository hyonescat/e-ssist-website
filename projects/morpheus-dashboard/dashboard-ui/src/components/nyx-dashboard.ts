import { LitElement, html, css, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ConnectionState } from '../types/gateway.js';
import { 
  Menu, 
  X, 
  MessageSquare, 
  Globe, 
  Clock, 
  Bot, 
  Wrench, 
  Server, 
  Settings, 
  Bug, 
  FileText, 
  Files 
} from 'lucide';
import './nyx-agent-roster.js';
import './nyx-activity-log.js';

const MENU_ITEMS = [
  { id: 'sessions', label: 'Sessions', icon: MessageSquare },
  { id: 'chrome', label: 'Chrome', icon: Globe },
  { id: 'jobs', label: 'Jobs', icon: Clock },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'nodes', label: 'Nodes', icon: Server },
  { id: 'config', label: 'Config', icon: Settings },
  { id: 'debug', label: 'Debug', icon: Bug },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'documents', label: 'Documents', icon: Files },
];

@customElement('nyx-dashboard')
export class NyxDashboard extends LitElement {
  @state() private connectionState: ConnectionState = 'disconnected';
  @state() private activeAgents = 0;
  @state() private menuOpen = false;
  @state() private activeMenuItem: string = 'agents';

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: #0a0a0f;
      color: #fff;
      font-family: 'Inter', system-ui, sans-serif;
    }
    
    .dashboard {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
    }
    
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: rgba(5, 5, 8, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 255, 65, 0.1);
      position: relative;
      z-index: 20;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(0, 255, 65, 0.1);
      border: 1px solid rgba(0, 255, 65, 0.3);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #00ff41;
      padding: 0;
    }
    
    .menu-toggle:hover {
      background: rgba(0, 255, 65, 0.2);
      border-color: rgba(0, 255, 65, 0.5);
      transform: scale(1.05);
    }
    
    .menu-toggle:active {
      transform: scale(0.95);
    }
    
    .menu-toggle svg {
      width: 20px;
      height: 20px;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(0, 255, 65, 0.2), rgba(0, 255, 65, 0.05));
      border: 1px solid rgba(0, 255, 65, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .brand h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: -0.02em;
    }
    
    .brand span {
      color: #00ff41;
    }
    
    .status-bar {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .connection-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'JetBrains Mono', monospace;
    }
    
    .connection-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #666;
    }
    
    .connection-dot.connected {
      background: #00ff41;
      box-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
    }
    
    .connection-dot.connecting {
      background: #ffaa00;
      animation: pulse 1s ease infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .stats {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stat-value {
      color: #00ff41;
      font-weight: 600;
    }
    
    /* Sidebar Styles */
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 30;
    }
    
    .sidebar-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      background: rgba(10, 10, 15, 0.95);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(0, 255, 65, 0.2);
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 40;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar.open {
      transform: translateX(0);
    }
    
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(0, 255, 65, 0.1);
    }
    
    .sidebar-title {
      font-size: 1rem;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      color: #00ff41;
      margin: 0;
    }
    
    .sidebar-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: rgba(255, 255, 255, 0.6);
      padding: 0;
    }
    
    .sidebar-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    
    .sidebar-close svg {
      width: 18px;
      height: 18px;
    }
    
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }
    
    .menu-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .menu-item:hover {
      background: rgba(0, 255, 65, 0.05);
      color: #fff;
    }
    
    .menu-item.active {
      background: rgba(0, 255, 65, 0.1);
      border-left-color: #00ff41;
      color: #00ff41;
    }
    
    .menu-item svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .menu-item span {
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(0, 255, 65, 0.1);
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      font-family: 'JetBrains Mono', monospace;
    }
    
    main {
      display: grid;
      grid-template-columns: 1fr 320px;
      overflow: hidden;
    }
    
    .roster-section {
      overflow-y: auto;
    }
    
    .log-section {
      overflow: hidden;
    }
    
    @media (max-width: 900px) {
      main {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto;
      }
      
      .log-section {
        max-height: 200px;
      }
    }
  `;

  private toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  private closeMenu() {
    this.menuOpen = false;
  }

  private selectMenuItem(id: string) {
    this.activeMenuItem = id;
    console.log(`Navigating to: ${id}`);
    this.closeMenu();
  }

  private iconToSvg(iconFn: unknown) {
    // Lucide icons return an SVG string, convert to lit svg template
    const iconSvg = (iconFn as (opts: { size: number }) => string)({ size: 20 });
    // Extract the SVG content (skip the <svg> wrapper since we use lit's svg tag)
    const svgMatch = iconSvg.match(/<svg[^>]*>(.*)<\/svg>/s);
    if (svgMatch) {
      // Create a simple SVG element by trusting the content
      return html`${svg([svgMatch[1]] as unknown as TemplateStringsArray)}`;
    }
    return html``;
  }

  render() {
    return html`
      <div class="dashboard">
        <header>
          <div class="header-left">
            <button class="menu-toggle" @click=${this.toggleMenu} aria-label="Toggle menu">
              ${this.iconToSvg(this.menuOpen ? X : Menu)}
            </button>
            <div class="brand">
              <div class="logo">🌙</div>
              <h1>Nyx <span>Gateway</span></h1>
            </div>
          </div>
          <div class="status-bar">
            <div class="connection-status">
              <div class="connection-dot ${this.connectionState}"></div>
              <span>${this.connectionState.toUpperCase()}</span>
            </div>
            <div class="stats">
              <div class="stat">
                <span>Active:</span>
                <span class="stat-value">${this.activeAgents}</span>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay ${this.menuOpen ? 'open' : ''}" @click=${this.closeMenu}></div>
        
        <!-- Sidebar -->
        <aside class="sidebar ${this.menuOpen ? 'open' : ''}">
          <div class="sidebar-header">
            <h2 class="sidebar-title">Navigation</h2>
            <button class="sidebar-close" @click=${this.closeMenu} aria-label="Close menu">
              ${this.iconToSvg(X)}
            </button>
          </div>
          
          <nav class="sidebar-nav">
            ${MENU_ITEMS.map(item => html`
              <div 
                class="menu-item ${this.activeMenuItem === item.id ? 'active' : ''}"
                @click=${() => this.selectMenuItem(item.id)}
              >
                ${this.iconToSvg(item.icon)}
                <span>${item.label}</span>
              </div>
            `)}
          </nav>
          
          <div class="sidebar-footer">
            Nyx Gateway v1.0
          </div>
        </aside>
        
        <main>
          <div class="roster-section">
            <nyx-agent-roster></nyx-agent-roster>
          </div>
          <div class="log-section">
            <nyx-activity-log></nyx-activity-log>
          </div>
        </main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nyx-dashboard': NyxDashboard;
  }
}
