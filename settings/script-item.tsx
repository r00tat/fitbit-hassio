import { Script } from '../common/settings';
import { PropChangedFunction } from './interfaces';

export function ScriptItem({
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
