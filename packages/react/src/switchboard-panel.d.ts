import type { SwitchboardPanelElement } from '@switchboard-js/devtools';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'switchboard-panel': React.DetailedHTMLProps<
        React.HTMLAttributes<SwitchboardPanelElement>,
        SwitchboardPanelElement
      >;
    }
  }
}

export {};
