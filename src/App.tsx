import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/layout/Sidebar';
import { MainPanel } from './components/layout/MainPanel';
import { InspectorPanel } from './components/layout/InspectorPanel';
import { GlobalSettings } from './components/settings/GlobalSettings';
import { ProtocolEditor } from './components/settings/ProtocolEditor';
import { RestConfig } from './components/settings/RestConfig';
import { Modal } from './components/shared/Modal';
import { Button } from './components/shared/Button';
import { Settings, FileCode, Globe } from 'lucide-react';

export default function App() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [showRest, setShowRest] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700 bg-slate-800/50">
        <h1 className="text-sm font-semibold text-slate-200 flex-1">Universal WebSocket Chat Simulator</h1>
        <Button size="sm" variant="ghost" onClick={() => setShowProtocol(true)} title="Protocol Profiles">
          <FileCode size={14} />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowRest(true)} title="REST Endpoints">
          <Globe size={14} />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowSettings(true)} title="Settings">
          <Settings size={14} />
        </Button>
      </div>
      <div className="h-[calc(100vh-41px)]">
        <AppLayout
          sidebar={<Sidebar selectedClientId={selectedClientId} onSelectClient={setSelectedClientId} />}
          main={<MainPanel selectedClientId={selectedClientId} />}
          inspector={<InspectorPanel />}
        />
      </div>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Global Settings">
        <GlobalSettings onClose={() => setShowSettings(false)} />
      </Modal>
      <Modal isOpen={showProtocol} onClose={() => setShowProtocol(false)} title="Protocol Profiles">
        <ProtocolEditor onClose={() => setShowProtocol(false)} />
      </Modal>
      <Modal isOpen={showRest} onClose={() => setShowRest(false)} title="REST Endpoints">
        <RestConfig onClose={() => setShowRest(false)} />
      </Modal>
    </div>
  );
}