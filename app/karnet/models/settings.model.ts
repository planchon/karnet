import { action, makeObservable, observable, reaction } from 'mobx';
import posthog from 'posthog-js';
import { AbstractModel } from './abstract.model';

export const Theme = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeType = (typeof Theme)[keyof typeof Theme];

export class SettingsModel extends AbstractModel {
  theme: ThemeType = 'light';
  disableLinks = false;

  constructor(props: Partial<SettingsModel> & { id: string }) {
    super(props);

    makeObservable(this, {
      theme: observable,
      setTheme: action,
      disableLinks: observable,
      setDisableLinks: action,
    });

    reaction(
      () => this.theme,
      (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    );
  }

  toJSON() {
    return {
      ...this,
    };
  }

  getSmallId(id: number): string {
    return `SETT-${id}`;
  }

  _id() {
    return 'p6n-settings';
  }

  setTheme = (theme: ThemeType) => {
    this.theme = theme;
  };

  setDisableLinks(disableLinks: boolean) {
    posthog.capture('disable_links', { disableLinks });
    this.disableLinks = disableLinks;
  }
}
