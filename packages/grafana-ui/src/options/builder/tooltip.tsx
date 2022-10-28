import { FieldOverrideContext, PanelOptionsEditorBuilder } from '@grafana/data';
import { OptionsWithTooltip, TooltipDisplayMode, SortOrder } from '@grafana/schema';

export function addTooltipOptions<T extends OptionsWithTooltip>(
  builder: PanelOptionsEditorBuilder<T>,
  singleOnly = false
) {
  const category = ['Tooltip'];
  const modeOptions = singleOnly
    ? [
        { value: TooltipDisplayMode.Single, label: 'Single' },
        { value: TooltipDisplayMode.None, label: 'Hidden' },
      ]
    : [
        { value: TooltipDisplayMode.Single, label: 'Single' },
        { value: TooltipDisplayMode.Multi, label: 'All' },
        { value: TooltipDisplayMode.None, label: 'Hidden' },
      ];

  const sortOptions = [
    { value: SortOrder.None, label: 'None' },
    { value: SortOrder.Ascending, label: 'Ascending' },
    { value: SortOrder.Descending, label: 'Descending' },
  ];

  builder
    .addRadio({
      path: 'tooltip.mode',
      name: 'Tooltip mode',
      category,
      defaultValue: 'single',
      settings: {
        options: modeOptions,
      },
    })
    .addRadio({
      path: 'tooltip.sort',
      name: 'Values sort order',
      category,
      defaultValue: SortOrder.None,
      showIf: (options: T) => options.tooltip.mode === TooltipDisplayMode.Multi,
      settings: {
        options: sortOptions,
      },
    })
    .addBooleanSwitch({
      path: 'tooltip.showLabels',
      name: 'Show labels',
      category,
      defaultValue: false,
    })
    .addMultiSelect({
      path: 'tooltip.labels',
      name: 'Shown labels',
      category,
      showIf: (options: T) => options.tooltip.showLabels === true,
      settings: {
        allowCustomValue: false,
        options: [],
        getOptions: async (context: FieldOverrideContext) => {
          const labels = new Set<string>();
          if (context && context.data && context.data.length > 0) {
            // Seems to happen when you apply any kind of transformation
            if (context.data.length === 1) {
              const fields = context.data[0].fields;
              for (const field of fields) {
                for (const [label, _] of Object.entries(field.labels ?? {})) {
                  labels.add(label);
                }
              }
            } else {
              const seenNames: string[] = [];
              const frames = context.data.filter((f) => {
                if (f.name && !seenNames.includes(f.name)) {
                  seenNames.push(f.name);
                  return true;
                }
                return false;
              });
              for (const frame of frames) {
                for (const field of frame.fields) {
                  for (const [label, _] of Object.entries(field.labels ?? {})) {
                    labels.add(label);
                  }
                }
              }
            }
          }
          return Array.from(labels).map((label) => ({ value: label, label: label }));
        },
      },
    });
}
