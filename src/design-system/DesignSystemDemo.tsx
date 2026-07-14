import { useState } from 'react';
import {
  Alert,
  Badge,
  BottomSheet,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  DataTable,
  Drawer,
  Dropdown,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  LoadingState,
  Modal,
  NavigationItem,
  PageHeader,
  Panel,
  Popover,
  ProgressBar,
  Radio,
  SectionHeader,
  Select,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  Textarea,
  Toast,
  Tooltip,
} from './index';

const labRows = [
  { module: 'Periodic Table', progress: '118 elements', status: 'Ready' },
  { module: 'Fusion Core', progress: '3 reactions', status: 'Calibrating' },
  { module: 'Virtual Lab', progress: '1 experiment', status: 'Ready' },
];

export function DesignSystemDemo() {
  const [tab, setTab] = useState('controls');
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState(false);

  return (
    <main
      style={{
        background: 'var(--as-bg-soft)',
        color: 'var(--as-text-body)',
        display: 'grid',
        gap: '24px',
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      <PageHeader
        eyebrow="Internal reference"
        title="Angie Scientific Design System"
        description="Phase 3 component inventory for the new laboratory UI."
        actions={<Button onClick={() => setModal(true)}>Open modal</Button>}
      />

      <Panel
        title="Navigation"
        actions={
          <Dropdown
            label="Actions"
            items={[
              { label: 'Save view', onSelect: () => undefined },
              { label: 'Reset filters', onSelect: () => undefined, tone: 'warning' },
            ]}
          />
        }
      >
        <Breadcrumb
          items={[
            { href: '#', label: 'Lab' },
            { href: '#', label: 'Chemistry' },
            { label: 'Fusion Core' },
          ]}
        />
        <div style={{ display: 'grid', gap: '8px', maxWidth: '260px' }}>
          <NavigationItem active label="Dashboard" badge={<Badge>New</Badge>} />
          <NavigationItem label="Periodic table" />
          <NavigationItem label="Quests" />
        </div>
      </Panel>

      <Tabs
        ariaLabel="Design system sections"
        value={tab}
        onChange={setTab}
        items={[
          {
            id: 'controls',
            label: 'Controls',
            content: <ControlsDemo onDrawer={() => setDrawer(true)} />,
          },
          {
            id: 'feedback',
            label: 'Feedback',
            content: <FeedbackDemo onSheet={() => setSheet(true)} />,
          },
          {
            id: 'data',
            label: 'Data',
            content: <DataDemo />,
          },
        ]}
      />

      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title="Confirm lab action"
        actions={<Button onClick={() => setModal(false)}>Confirm</Button>}
      >
        This dialog closes with Escape and exposes a clear title.
      </Modal>
      <Drawer isOpen={drawer} onClose={() => setDrawer(false)} title="Element inspector">
        Contextual scientific data belongs here.
      </Drawer>
      <BottomSheet isOpen={sheet} onClose={() => setSheet(false)} title="Mobile action">
        This bottom sheet is reserved for small screens.
      </BottomSheet>
    </main>
  );
}

function ControlsDemo({ onDrawer }: { onDrawer: () => void }) {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <SectionHeader title="Controls" description="Core states and form controls." />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <Button>Primary</Button>
        <Button variant="outline" selected>
          Selected
        </Button>
        <Button tone="success" variant="solid">
          Success
        </Button>
        <Button isLoading>Loading</Button>
        <Tooltip content="Open inspector">
          <IconButton label="Open inspector" onClick={onDrawer} icon={<span>i</span>} />
        </Tooltip>
      </div>
      <Input label="Element search" placeholder="Hydrogen, Fe, 26..." />
      <Textarea label="Observation notes" placeholder="Describe what happened." />
      <Select
        label="Difficulty"
        options={[
          { value: 'discovery', label: 'Discovery' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'scientific', label: 'Scientific' },
        ]}
      />
      <Checkbox label="Save as favorite" />
      <Radio name="mode" label="Practice mode" defaultChecked />
      <Switch label="Reduced motion" />
      <Slider label="Temperature" min={0} max={100} defaultValue={42} valueLabel="42%" />
    </div>
  );
}

function FeedbackDemo({ onSheet }: { onSheet: () => void }) {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <SectionHeader title="Feedback" description="Status, loading, and empty states." />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Badge tone="success">Badge</Badge>
        <Badge tone="warning">Quest due</Badge>
        <Badge tone="error">Safety</Badge>
      </div>
      <ProgressBar label="Mission progress" value={64} tone="success" />
      <Alert title="Lab notice">Use safety explanations beside every reaction.</Alert>
      <Toast title="Saved" tone="success">
        Progress synchronized locally.
      </Toast>
      <LoadingState />
      <Skeleton style={{ height: '48px' }} />
      <EmptyState title="No discoveries yet" action={<Button onClick={onSheet}>Start</Button>}>
        The first element card should invite a clear next action.
      </EmptyState>
      <ErrorState title="Experiment paused">
        The user needs a recovery action before data changes.
      </ErrorState>
      <Popover label="Hint">Keep explanations short and tied to the current task.</Popover>
    </div>
  );
}

function DataDemo() {
  return (
    <Card>
      <DataTable
        caption="Module readiness"
        rows={labRows}
        getRowKey={(row) => row.module}
        columns={[
          { key: 'module', header: 'Module', render: (row) => row.module },
          { key: 'progress', header: 'Progress', render: (row) => row.progress },
          { key: 'status', header: 'Status', render: (row) => row.status },
        ]}
      />
    </Card>
  );
}
