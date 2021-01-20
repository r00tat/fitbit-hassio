import { Script } from '../common/settings';

interface PropChangedFunction {
  ({
    index,
    key,
    value,
    action,
  }: {
    index: number;
    key?: string;
    value?: string;
    action?: 'change' | 'moveup' | 'movedown' | 'delete';
  }): void;
}

function ScriptItem({
  name,
  params,
  title,
  propChanged,
  index,
  scripts,
}: {
  name: string;
  params: string;
  title: string;
  propChanged: PropChangedFunction;
  index: number;
  scripts: Script[];
}) {
  return (
    <Section title={<Text>Script {title || name}</Text>}>
      <TextInput
        title="Display Title"
        label="title"
        placeholder="title displayed on the watch"
        value={title}
        onChange={(value) =>
          propChanged({
            index,
            key: 'title',
            value: (value as any).name,
          })
        }
      />
      <TextInput
        title="Script name"
        label="script"
        placeholder="name of the script"
        value={name}
        onChange={(value) =>
          propChanged({ index, key: 'name', value: (value as any).name })
        }
      />
      <TextInput
        title="Parameters"
        label="params"
        placeholder="JSON encoded arguments"
        value={params}
        onChange={(value) =>
          propChanged({ index, key: 'params', value: (value as any).name })
        }
      />
      <Button
        label="Delete"
        onClick={() => {
          propChanged({
            index,
            action: 'delete',
          });
        }}
      />
      {index > 0 && (
        <Button
          label="Move up"
          onClick={() => {
            propChanged({
              index,
              action: 'moveup',
            });
          }}
        />
      )}
      {index < scripts.length - 1 && (
        <Button
          label="Move down"
          onClick={() => {
            propChanged({
              index,
              action: 'movedown',
            });
          }}
        />
      )}
    </Section>
  );
}

const HassSettings = ({ addScript }: { addScript: () => void }) => (
  <Section title={<Text>Homeassistant Settings</Text>}>
    <TextInput
      title="URL"
      label="URL"
      placeholder="http://hassio.local:8123"
      settingsKey="url"
    />
    <TextInput
      title="Bearer Token"
      label="Bearer Token"
      placeholder=""
      settingsKey="token"
    />
    <Button
      label="Add a new script"
      onClick={() => {
        addScript();
      }}
    />
  </Section>
);

const Scripts = (scripts: Script[], propChanged: PropChangedFunction) => {
  return scripts.map(({ name = '', title = '', params = '' }, index) => (
    <ScriptItem
      name={name}
      title={title}
      params={params}
      propChanged={propChanged}
      index={index}
      scripts={scripts}
    />
  ));
};

const SettingsPage = ({ settings, settingsStorage }) => {
  try {
    if (!settings.scripts) {
      settings.scripts = JSON.stringify([
        {
          title: 'My first script',
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
    const scriptsSection = Scripts(scripts, propChanged);
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

        {/* <Section title={<Text>Scripts</Text>}>
          <AdditiveList
            settingsKey="scripts"
            addAction={
              <TextInput
                title="Script name"
                label="Add new script"
                placeholder="name of the script"
                action="Add Item"
              />
            }
            renderItem={({ name, params, title }) => (
              <ScriptItem
                name={name}
                params={params}
                title={title}
                propChanged={propChanged}
              />
            )}
          />
        </Section> */}

        {scriptsSection}

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
  registerSettingsPage(SettingsPage);
} catch (err) {
  console.error(`failed to render settings`, err, err.stacktrace);
}
