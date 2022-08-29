export const HassSettings = ({ addScript }: { addScript: () => void }) => (
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
