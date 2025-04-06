import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

const WEBSOCKET_SERVER = 'ws://localhost:1234'; // Change this later to the actual WebSocket server URL

export interface CollaborationSession {
  doc: Y.Doc;
  provider: WebsocketProvider;
  binding?: MonacoBinding;
  outputMap?: Y.Map<any>
  languageMap?: Y.Map<any>
  awareness: any;
}

export function createCollaborationSession(roomId: string): CollaborationSession {
  const doc = new Y.Doc();
  
  const provider = new WebsocketProvider(WEBSOCKET_SERVER, roomId, doc);

  const outputMap = doc.getMap('output');

  const languageMap = doc.getMap('language');

  provider.awareness.setLocalState({
    user: {
      name: `User-${Math.floor(Math.random() * 10000)}`,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
    }
  });
  console.log('Awareness state:', provider.awareness.getStates());
  
  return { doc, provider, outputMap, languageMap, awareness: provider.awareness };
}

export function setupEditorBinding(
  editor: any, 
  language: string,
  collaborationSession: CollaborationSession
): MonacoBinding {
  const { doc, provider } = collaborationSession;
  
  const sharedText = doc.getText(`monaco-${language}`);
  
  const binding = new MonacoBinding(
    sharedText,
    editor.getModel(),
    new Set([editor]),
    provider.awareness
  );
  
  return binding;
}

export function destroyCollaborationSession(session: CollaborationSession) {
  if (session.binding) {
    session.binding.destroy();
  }
  session.provider.disconnect();
  session.doc.destroy();
}

export function updateSharedOutput(
  session: CollaborationSession,
  output: string[],
  isError: boolean
) {
  if (session.outputMap) {
    session.outputMap.set('output', output);
    session.outputMap.set('isError', isError);
    session.outputMap.set('lastRun', Date.now());
  }
}

export function observeRunAction(
  session: CollaborationSession,
  callback: (output: string[], isError: boolean) => void
) {
  if (session.outputMap) {
    session.outputMap.observe(event => {
      if (event.keysChanged.has('lastRun')) {
        const output = session.outputMap?.get('output') || []
        const isError = session.outputMap?.get('isError') || false
        callback(output, isError);
      }
    })
  }
}

export function updateSharedLanguage(
  session: CollaborationSession,
  language: string
) {
  if (session.languageMap) {
    session.languageMap.set('currentLanguage', language);
  }
}

export function observeLanguageChange(
  session: CollaborationSession,
  callback: (language: string) => void
) {
  if (session.languageMap) {
    session.languageMap.observe(event => {
      if (event.keysChanged.has('currentLanguage')) {
        const language = session.languageMap?.get('currentLanguage');
        if (language) {
          callback(language);
        }
      }
    });
  }
}
