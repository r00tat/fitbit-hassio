import { Script } from '../common/settings';
import { PropChangedFunction } from './interfaces';
import { ScriptItem } from './script-item';

export const Scripts = (
  scripts: Script[],
  propChanged: PropChangedFunction
) => {
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
