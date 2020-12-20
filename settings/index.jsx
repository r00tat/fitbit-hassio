registerSettingsPage(({ settings }) => (
  <Page>
    <Section
      title={
        <Text bold align="center">
          App Settings
        </Text>
      }
    >
      <Text>Hello world!</Text>
    </Section>

    <Section>
      <Text>Scripts</Text>
      <AdditiveList
        title="A list of callable scripts"
        settingsKey="scripts"
        maxItems="10"
        renderItem={({ name, value }) => (
          <>
            <Text>name: {name}</Text>
            <TextInput
              title="Script name"
              label="script name"
              placeholder="name of the script"
              action="Add Item"
              value={value.script}
            />
            <TextInput
              title="Parameters"
              label="params JSON encoded"
              placeholder="JSON encoded arguments"
              action="Add Item"
              value={value.params || '{}'}
            />
          </>
        )}
        addAction={
          <>
            <TextInput
              title="Script name"
              label="script"
              placeholder="name of the script"
              action="Add Item"
            />
            <TextInput
              title="Parameters"
              label="params"
              placeholder="JSON encoded arguments"
              action="Add Item"
            />
          </>
        }
      />
    </Section>
  </Page>
));
