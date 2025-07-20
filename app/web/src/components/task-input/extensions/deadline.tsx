import { InputRule, mergeAttributes, Node } from '@tiptap/core';

// perfect date match
const dateRegex = /(^|\s)(\d{1,2}\/\d{2})$/g;

// this will set the hours
const hoursRegex = /(^|\s)(\d{1,2}h(\d{1,2})?)$/g;

const joursRegex = /(^|\s)(\d{1,2}\s?j)$/g;

const semainesRegex = /(^|\s)(\d{1,2}\s?sem)$/g;

const moisRegex = /(^|\s)(\d{1,2}\s?m)$/g;

const dateHoursRegex = /(^|\s)(\d{1,2}\/\d{1,2}\s\d{1,2}h(\d{1,2})?)$/g;

// match dem, sem, lun, mar, mer, jeu, ven, sam, dim type keyword
// this will set the hours to 5pm
const keywordRegex = /(^|\s)(dem|sem|lun|mar|mer|jeu|ven|sam|dim)$/g;

// match dans 10 mois, dans 10 jours, dans 10 heures type natural language
const naturalLanguageRegex = /(^|\s)dans\s(\d{1,2})(m|j|h|sem)$/g;

export const allPossibleMatches = {
  date: {
    regex: dateRegex,
    label: 'date',
    priority: 0,
  },
  hours: {
    regex: hoursRegex,
    label: 'hours',
    priority: 2,
  },
  jours: {
    regex: joursRegex,
    label: 'jours',
    priority: 2,
  },
  semaines: {
    regex: semainesRegex,
    label: 'semaines',
    priority: 2,
  },
  mois: {
    regex: moisRegex,
    label: 'mois',
    priority: 2,
  },
  dateHours: {
    regex: dateHoursRegex,
    label: 'dateHours',
    priority: 1,
  },
  keyword: {
    regex: keywordRegex,
    label: 'keyword',
    priority: 5,
  },
  naturalLanguage: {
    regex: naturalLanguageRegex,
    label: 'naturalLanguage',
    priority: 0,
  },
};

type DeadlineNodeOptions = {
  onDeadlineChange: (value: string) => void;
};

export const DeadlineNode = Node.create<DeadlineNodeOptions>({
  name: 'deadline',
  inline: true,
  group: 'inline',
  selectable: false,

  addAttributes() {
    return {
      date: {
        default: '',
      },
      labelRender: {
        default: 'dem',
      },
      type: {
        default: 'date',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-deadline]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const attributes = mergeAttributes(
      // @ts-expect-error
      this.options.HTMLAttributes,
      HTMLAttributes,
      {
        level: 1,
        class:
          'mx-1 px-[4px] pb-[2px] py-[1px] ml-1 bg-slate-200/70 rounded-xs',
      }
    );

    return ['span', attributes, node.attrs.labelRender];
  },

  renderText({ node }) {
    return ` ${node.attrs.labelRender}`;
  },

  addInputRules() {
    const rules: InputRule[] = [];

    const sortedMatches = Object.values(allPossibleMatches).sort(
      (a, b) => a.priority - b.priority
    );

    for (const value of sortedMatches) {
      rules.push(
        new InputRule({
          find: value.regex,
          handler: ({ range, chain, match }) => {
            const input = match[0];
            let newRange = range;

            if (input.startsWith('p')) {
              newRange = {
                from: range.from + 2,
                to: range.to,
              };
            }

            chain()
              .insertContentAt(newRange, {
                type: this.name,
                attrs: {
                  date: input,
                  labelRender: input.trim(),
                  type: value.label,
                },
              })
              .run();

            this.options.onDeadlineChange(input.trim());
          },
        })
      );
    }

    return rules;
  },
});
