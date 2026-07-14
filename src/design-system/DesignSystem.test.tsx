import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button, Input, Modal, Tabs } from './index';

describe('design system primitives', () => {
  it('marks loading buttons as busy and disabled', () => {
    render(<Button isLoading>Launch</Button>);

    const button = screen.getByRole('button', { name: /launch/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('connects field labels to inputs', () => {
    render(<Input label="Element search" placeholder="Hydrogen" />);

    expect(screen.getByLabelText('Element search')).toHaveAttribute(
      'placeholder',
      'Hydrogen',
    );
  });

  it('switches tabs and exposes the active panel', async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);

    await user.click(screen.getByRole('tab', { name: 'Data' }));

    expect(screen.getByRole('tab', { name: 'Data' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Data panel');
  });

  it('closes modal dialogs with Escape', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

function TabsHarness() {
  const [value, setValue] = useState('controls');
  return (
    <Tabs
      ariaLabel="Demo tabs"
      value={value}
      onChange={setValue}
      items={[
        { id: 'controls', label: 'Controls', content: 'Controls panel' },
        { id: 'data', label: 'Data', content: 'Data panel' },
      ]}
    />
  );
}

function ModalHarness() {
  const [open, setOpen] = useState(true);
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
      Body
    </Modal>
  );
}
