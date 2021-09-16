import axios from 'axios';

import React, { useState, FormEvent } from 'react';

import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import Button from 'react-bootstrap/Button';

import { Settings } from '~/types.d';
import { apiRoot } from '~/utils/constants';

interface SettingsPageProps {
  settings: Settings;
  onSave?: () => void;
}

const SettingsPage = ({ settings, onSave }: SettingsPageProps): JSX.Element => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);

  const handleSettingChange = (fieldName: string, e: FormEvent): void => {
    const newValue: string | number = (e.target as HTMLInputElement).value;

    setCurrentSettings({ ...currentSettings, [fieldName]: newValue });
  }

  const handleSave = async () => {
    await axios.patch(`${apiRoot}/settings`, currentSettings);

    onSave();
  };

  return (
    <div className="h-100 flex flex-column">
      <h3>Настройки</h3>
      <div className="flex-auto">
        <FormLabel>Порог ошибки</FormLabel>
        <FormControl defaultValue={settings.errorThreshold} placeholder="Порог ошибки" onChange={e => handleSettingChange('errorThreshold', e)} />
      </div>
      <div className="flex justify-center"><Button onClick={handleSave}>Сохранить</Button></div>
    </div>
  );
};

export default SettingsPage;
