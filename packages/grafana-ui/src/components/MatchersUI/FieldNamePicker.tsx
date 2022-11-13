import React, { useCallback } from 'react';

import { FieldNamePickerConfigSettings, SelectableValue, StandardEditorProps } from '@grafana/data';

import { MultiSelect, Select } from '../Select/Select';

import { useFieldDisplayNames, useSelectOptions, frameHasName } from './utils';

// Pick a field name out of the fields
export const FieldNamePicker: React.FC<StandardEditorProps<string, FieldNamePickerConfigSettings>> = ({
  value,
  onChange,
  context,
  item,
}) => {
  const settings: FieldNamePickerConfigSettings = item.settings ?? {};
  const names = useFieldDisplayNames(context.data, settings?.filter);
  const selectOptions = useSelectOptions(names, value);

  const onSelectChange = useCallback(
    (selection?: SelectableValue<string>) => {
      if (selection && !frameHasName(selection.value, names)) {
        return; // can not select name that does not exist?
      }
      return onChange(selection?.value);
    },
    [names, onChange]
  );

  const selectedOption = selectOptions.find((v) => v.value === value);
  return (
    <>
      <Select
        value={selectedOption}
        placeholder={settings.placeholderText ?? 'Select field'}
        options={selectOptions}
        onChange={onSelectChange}
        noOptionsMessage={settings.noFieldsMessage}
        width={settings.width}
        isClearable={true}
      />
    </>
  );
};

// Pick a field name out of the fields
export const MultiFieldNamePicker: React.FC<StandardEditorProps<string[], FieldNamePickerConfigSettings>> = ({
  value,
  onChange,
  context,
  item,
}) => {
  const settings: FieldNamePickerConfigSettings = item.settings ?? {};
  const names = useFieldDisplayNames(context.data, settings?.filter);
  const selectOptions = useSelectOptions(names, '');

  // const onSelectChange = useCallback(
  //   (selection?: SelectableValue<string>) => {
  //     if (selection && !frameHasName(selection.value, names)) {
  //       return; // can not select name that does not exist?
  //     }
  //     return onChange(selection?.value);
  //   },
  //   [names, onChange]
  // );

  // const selectedOption = selectOptions.filter((v) => v.value === value);
  return (
    <>
      <MultiSelect<string>
        value={value}
        placeholder={settings.placeholderText ?? 'Select fields'}
        options={selectOptions}
        onChange={(e) => {
          onChange(e.map((v) => v.value).flatMap((v) => (v !== undefined ? [v] : [])));
        }}
        noOptionsMessage={settings.noFieldsMessage}
        width={settings.width}
        isClearable={true}
      />
    </>
  );
};
