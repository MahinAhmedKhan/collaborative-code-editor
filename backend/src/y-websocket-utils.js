import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as map from 'lib0/map';

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

// Map from room names to shared documents
const docs = new Map();

const messageSync = 0;
const messageAwareness = 1;

// Get the Y.js document for a specific room
const getYDoc = (docName) => {
  let doc = docs.get(docName);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docName, doc);
  }
  return doc;
};

export const setupWSConnection = (ws, req, { docName = 'default' } = {}) => {
  const doc = getYDoc(docName);
  const awareness = new awarenessProtocol.Awareness(doc);

  // Connection ready state
  let connectionReady = false;

  // Check if connection is still alive
  let pingTimeout = null;

  // Send sync step 1
  const sendSync = () => {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    ws.send(encoding.toUint8Array(encoder));
  };


  const sendAwareness = () => {
    const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
      awareness,
      Array.from(awareness.getStates().keys())
    );
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageAwareness);
    encoding.writeVarUint8Array(encoder, awarenessUpdate);
    ws.send(encoding.toUint8Array(encoder));
  };


  // Clean up on close
  const closeConn = () => {
    if (pingTimeout) {
      clearTimeout(pingTimeout);
    }
    const clientID = req.headers['sec-websocket-key'];
    awarenessProtocol.removeAwarenessStates(awareness, [clientID], null);
    ws.close();
  };

  const setPingTimeout = () => {
    if (pingTimeout) {
      clearTimeout(pingTimeout);
    }
    pingTimeout = setTimeout(() => {
      if (ws.readyState === wsReadyStateOpen) {
        ws.ping();
        setPingTimeout();
      }
    }, 30000);
  };

  ws.on('message', (message) => {
    const encoder = encoding.createEncoder();
    const decoder = decoding.createDecoder(new Uint8Array(message));
    const messageType = decoding.readVarUint(decoder);

    switch (messageType) {
      case messageSync:
        syncProtocol.readSyncMessage(decoder, encoder, doc, req.headers['sec-websocket-key']);
        if (encoding.length(encoder) > 1) {
          ws.send(encoding.toUint8Array(encoder));
        }
        break;
      case messageAwareness:
        awarenessProtocol.applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), req.headers['sec-websocket-key']);
        break;
    }

    if (!connectionReady) {
      connectionReady = true;
      sendSync();
      sendAwareness();
    }
  });

  ws.on('close', closeConn);

  ws.on('pong', setPingTimeout);

  setPingTimeout();

  doc.on('update', (update, origin) => {
    if (origin !== req.headers['sec-websocket-key'] && ws.readyState === wsReadyStateOpen) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeSyncStep1(encoder, doc);
      ws.send(encoding.toUint8Array(encoder));
    }
  });

  awareness.on('update', ({ added, updated, removed }) => {
    // console.log('Awareness update - added:', added, 'updated:', updated, 'removed:', removed);
    // console.log('Current awareness states:', awareness.getStates().size);
    // console.log('Room:', docName);
    // console.log('Awareness states:', Array.from(awareness.getStates().keys()));
    const changedClients = [...added, ...updated, ...removed];
    if (ws.readyState === wsReadyStateOpen) {
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
        awareness,
        changedClients
      );
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(encoder, awarenessUpdate);
      ws.send(encoding.toUint8Array(encoder));
    }
  });

};
