import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TwAccordion, TwAccordionItem, TwTab, TwTabList, TwTabPanel, TwTabs } from 'ngwind';

/**
 * These specs verify the runtime wiring of the styled Aria wrappers — that the
 * @angular/aria primitives applied via hostDirectives / nested components still
 * coordinate correctly across component view boundaries (DI-based registration).
 */

@Component({
  imports: [TwTabs, TwTabList, TwTab, TwTabPanel],
  template: `
    <tw-tabs>
      <tw-tab-list [(selectedTab)]="active">
        <button tw-tab value="a">A</button>
        <button tw-tab value="b">B</button>
      </tw-tab-list>
      <div tw-tab-panel value="a">Panel A</div>
      <div tw-tab-panel value="b">Panel B</div>
    </tw-tabs>
  `,
})
class TabsHost {
  readonly active = signal('a');
}

@Component({
  imports: [TwAccordion, TwAccordionItem],
  template: `
    <tw-accordion [multiExpandable]="false">
      <tw-accordion-item>
        <span tw-accordion-header>First</span>
        <p>First body</p>
      </tw-accordion-item>
      <tw-accordion-item>
        <span tw-accordion-header>Second</span>
        <p>Second body</p>
      </tw-accordion-item>
    </tw-accordion>
  `,
})
class AccordionHost {}

describe('Aria widget wrappers', () => {
  it('wires tabs: roles, selection, and reacting to model changes', async () => {
    const fixture = TestBed.createComponent(TabsHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const tabs = Array.from(el.querySelectorAll<HTMLElement>('[role="tab"]'));
    expect(tabs.length).toBe(2);
    expect(el.querySelectorAll('[role="tabpanel"]').length).toBe(2);

    // Initial selection follows the bound model ('a').
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');

    // Driving the model updates the selected tab.
    fixture.componentInstance.active.set('b');
    await fixture.whenStable();
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('wires accordion: triggers control panels and toggle on click', async () => {
    const fixture = TestBed.createComponent(AccordionHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const triggers = Array.from(el.querySelectorAll<HTMLButtonElement>('button[aria-expanded]'));
    expect(triggers.length).toBe(2);
    // Each trigger must be linked to a panel (proves trigger<->panel wiring).
    expect(triggers[0].getAttribute('aria-controls')).toBeTruthy();

    // Collapsed: panel body content is not rendered in the DOM.
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(el.textContent).not.toContain('First body');

    // Expanding renders the content...
    triggers[0].click();
    await fixture.whenStable();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(el.textContent).toContain('First body');

    // ...and collapsing removes it again.
    triggers[0].click();
    await fixture.whenStable();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(el.textContent).not.toContain('First body');
  });
});
