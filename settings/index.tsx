import { Script } from '../common/settings';
import { HassSettings } from './hass-settings';
import { PropChangedFunction } from './interfaces';
import { Scripts } from './scripts';

const SettingsPage = ({ settings, settingsStorage }) => {
  try {
    if (!settings.scripts) {
      settings.scripts = JSON.stringify([
        {
          title: 'homeassistant script',
          name: 'script_name',
          params: '{}',
        },
      ]);
    }

    const propChanged: PropChangedFunction = ({
      index,
      key,
      value,
      action = 'change',
    }) => {
      try {
        const scripts: Script[] = JSON.parse(settings.scripts);
        console.info(
          `settings.scripts ${action} ${index} ${key} ${JSON.stringify(value)}`
        );
        console.info(`old scripts: ${JSON.stringify(scripts)}`);
        let scriptToMove: Script;
        switch (action) {
          case 'change':
            scripts[index][key] = value;
            break;
          case 'delete':
            scripts.splice(index, 1);
            break;
          case 'moveup':
            [scriptToMove] = scripts.splice(index, 1);
            scripts.splice(index - 1, 0, scriptToMove);
            break;
          case 'movedown':
            [scriptToMove] = scripts.splice(index, 1);
            scripts.splice(index + 1, 0, scriptToMove);
            break;
        }
        console.info(`putting scripts in storage: ${JSON.stringify(scripts)}`);
        settingsStorage.setItem('scripts', JSON.stringify(scripts));
      } catch (err) {
        console.error(`failed to update scripts prop`, err);
      }
    };

    const scripts: Script[] = JSON.parse(settings.scripts);
    const scriptsSection =
      scripts !== null && scripts instanceof Array
        ? Scripts(scripts, propChanged)
        : undefined;
    const addScript = () => {
      scripts.push({
        name: `script_${scripts.length + 1}`,
        title: `Script ${scripts.length + 1}`,
        params: '{}',
      });
      settingsStorage.setItem('scripts', JSON.stringify(scripts));
    };

    return (
      <Page>
        <HassSettings addScript={addScript} />

        {scriptsSection}
        <Section title={<Text>All Scripts</Text>}>
          <TextInput
            title="All Scripts"
            label="Scripts"
            value={settings.scripts}
            onChange={(value: any) => {
              console.info(`scripts json changed, ${value.name}`);
              settingsStorage.setItem('scripts', value.name);
              scripts.splice(0, scripts.length, ...JSON.parse(value.name));
            }}
          />
        </Section>

        <Section title={<Text>Reset</Text>}>
          <Button
            label="Clear Settings"
            onClick={() => {
              settingsStorage.clear();
            }}
          />
        </Section>
      </Page>
    );
  } catch (err) {
    console.error(`failed to render settings: ${err}`, err);
    return <Text>Failed to render settings ${err}</Text>;
  }
};

try {
  console.info(`starting settings`);
  registerSettingsPage(SettingsPage);
} catch (err) {
  console.error(`failed to render settings`, err, err.stacktrace);
}
