function AddScriptItem() {
  return (
    <TextInput
      title="Script name"
      label="Add new script"
      placeholder="name of the script"
      action="Add Item"
    />
  );
}

function ScriptItem({ name, params, propChanged }) {
  return (
    <Section title={<Text>Script {name}</Text>}>
      <TextInput
        title="Script name"
        label="script"
        placeholder="name of the script"
        value={name}
        onChange={(value) => propChanged(name, 'name', value)}
      />
      <TextInput
        title="Parameters"
        label="params"
        placeholder="JSON encoded arguments"
        value={params}
        onChange={(value) => propChanged(name, 'params', value)}
      />
    </Section>
  );
}

const HassSettings = () => (
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
  </Section>
);

const SettingsPage = ({ settings, settingsStorage }) => {
  if (!settings.scripts) {
    settings.scripts = '[]';
  }

  const propChanged = (
    name: string,
    key: string,
    { name: value }: { name: string }
  ) => {
    try {
      const scripts = JSON.parse(settings.scripts);
      console.info(
        `searching for settings change ${name} ${key} ${JSON.stringify(value)}`
      );
      console.info(`scripts: ${JSON.stringify(scripts)}`);
      let idx = -1;
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].name === name) {
          idx = i;
        }
      }
      if (idx >= 0) {
        const script = scripts[idx];
        script[key] = value;
        console.info(`putting settings in storage: ${JSON.stringify(scripts)}`);
        settingsStorage.setItem('scripts', JSON.stringify(scripts));
      } else {
        console.info(`item not found!`);
      }
    } catch (err) {
      console.error(`failed to update scripts prop`, err);
    }
  };
  return (
    <Page>
      <HassSettings />

      <Section title={<Text>Scripts</Text>}>
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
          renderItem={({ name, params }) => (
            <ScriptItem name={name} params={params} propChanged={propChanged} />
          )}
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
};

registerSettingsPage(SettingsPage);
